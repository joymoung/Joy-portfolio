import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-load the Gemini API client to ensure the app boots even if the key is not set yet.
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please configure it in your Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// AI Polish API Route
app.post("/api/polish", async (req, res) => {
  try {
    const { text, type, instructions } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text content is required for polishing." });
    }

    const ai = getAiClient();
    
    let prompt = "";
    if (type === "summary") {
      prompt = `You are an expert technical writer and resume coach.
Optimize the following professional summary / bio for a developer/data scientist GitHub profile README.
It should be engaging, highly professional, sound energetic but professional, and make a massive impact.
Ensure it maintains the exact, real details provided in the text. Do not invent fake details.
Ensure it is written in the first person ("I") or an active third person depending on style, but default to first person ("I am a...").
Keep it to 2-3 sentence blockquotes or a highly scannable short paragraph.

Original Text:
"${text}"

Custom User Request / Tone Instructions:
${instructions || "Make it punchy, technical, and highlight data pipeline architecture and scaling."}`;
    } else if (type === "bullet") {
      prompt = `You are a resume and portfolio writing expert.
Optimize the following bullet points or descriptions for a project or professional experience on a GitHub Profile README.
Make them sound active, action-oriented (using strong action verbs), highlight quantifiable impact where possible, and clearly articulate technical contributions.
Do not invent facts; only refine the existing text. Keep them as 2-3 clean, punchy bullet points.

Original Bullet Points:
"${text}"

Custom User Request / Tone Instructions:
${instructions || "Make it sound highly technical, professional, and emphasize business/operational scaling."}`;
    } else {
      prompt = `Optimize this section of a developer's portfolio README. Maintain the original facts, but enhance readability, structure, and professional tone.
"${text}"
Instructions: ${instructions || "Make it clean, clear, and engaging."}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a master professional portfolio architect. Your job is to make developer resumes, bios, and project descriptions sound world-class, active, and technically precise, without ever inventing false facts or adding corporate jargon fluff. Return ONLY the polished text.",
        temperature: 0.7,
      },
    });

    res.json({ polishedText: response.text });
  } catch (error: any) {
    console.error("AI Polish error:", error);
    res.status(500).json({ error: error.message || "An error occurred during AI processing." });
  }
});

// AI Badge Suggestion Route
app.post("/api/suggest-badges", async (req, res) => {
  try {
    const { skills } = req.body;
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ error: "Skills array is required." });
    }

    const ai = getAiClient();
    const prompt = `Based on these skills: [${skills.join(", ")}], suggest a list of technology categories and corresponding modern Shields.io badges.
Return the suggestions as a JSON array of objects.
Each object should have:
- category: (e.g. "Languages", "Databases", "Frontend", "Backend", "Data Science & BI", "Tools & Cloud")
- name: (The name of the technology, e.g. "Python")
- slug: (Shields.io logo slug, e.g. "python")
- color: (The hex color code without '#', e.g. "3776AB")
- customBadgeUrl: (Formulate the standard shields.io badge URL in this exact format: https://img.shields.io/badge/TECHNAME-HEXCOLOR?style=for-the-badge&logo=SLUG&logoColor=white)

Format the JSON response precisely. Do not enclose it in markdown wrappers.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              category: { type: "string" },
              name: { type: "string" },
              slug: { type: "string" },
              color: { type: "string" },
              customBadgeUrl: { type: "string" },
            },
            required: ["category", "name", "slug", "color", "customBadgeUrl"],
          }
        },
        temperature: 0.3,
      }
    });

    const parsedData = JSON.parse(response.text.trim());
    res.json({ suggestions: parsedData });
  } catch (error: any) {
    console.error("AI Badge Suggestion error:", error);
    res.status(500).json({ error: error.message || "An error occurred during badge suggestions." });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve SPA fallback for React Router or SPA frontend
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
