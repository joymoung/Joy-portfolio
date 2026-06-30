import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import FormPanel from "./components/FormPanel";
import PreviewPanel from "./components/PreviewPanel";
import { INITIAL_PROFILE_DATA, PRESET_SKILLS } from "./data";
import { generateMarkdown } from "./utils";
import { ProfileData, TechSkill } from "./types";

export default function App() {
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE_DATA);
  const [customSkills, setCustomSkills] = useState<TechSkill[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSuggestingSkills, setIsSuggestingSkills] = useState<boolean>(false);

  // Combine default presets and dynamically suggested skills
  const allSkills = [...PRESET_SKILLS, ...customSkills];

  // Generate real-time markdown
  const markdownCode = generateMarkdown(profile);

  // Handle clipboard actions
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      // Fallback
      const btn = document.getElementById("btn-copy-code");
      if (btn) {
        const textarea = document.createElement("textarea");
        textarea.value = markdownCode;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand("copy");
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        } catch (e) {
          console.error("execCommand fallback failed:", e);
        }
        document.body.removeChild(textarea);
      }
    }
  };

  // Handle markdown download file
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([markdownCode], { type: "text/markdown;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${profile.socials.github || "README"}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Handle server-side custom badge generation via Gemini
  const handleSuggestSkills = async (skillsStr: string) => {
    setIsSuggestingSkills(true);
    try {
      const response = await fetch("/api/suggest-badges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillsStr })
      });

      const data = await response.json();
      if (response.ok && Array.isArray(data.badges)) {
        const incoming: TechSkill[] = data.badges;
        
        // Add new suggested skills to our custom registry state
        setCustomSkills((prev) => {
          const merged = [...prev];
          incoming.forEach((skill) => {
            if (!merged.some((s) => s.id === skill.id) && !PRESET_SKILLS.some((s) => s.id === skill.id)) {
              merged.push(skill);
            }
          });
          return merged;
        });

        // Automatically toggle on all incoming badges in the user's active tech stack
        setProfile((prev) => {
          const currentStack = [...prev.techStack];
          incoming.forEach((skill) => {
            if (!currentStack.includes(skill.id)) {
              currentStack.push(skill.id);
            }
          });
          return {
            ...prev,
            techStack: currentStack
          };
        });
      } else {
        alert(data.error || "Failed to generate dynamic custom badges.");
      }
    } catch (err: any) {
      console.error(err);
      alert("Error generating badges: " + err.message);
    } finally {
      setIsSuggestingSkills(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0d1117] text-[#c9d1d9] select-none font-sans">
      {/* 1. Header Navigation Block */}
      <Navbar
        onCopy={handleCopy}
        onDownload={handleDownload}
        isCopied={isCopied}
        profileName={profile.name}
      />

      {/* 2. Main split view console */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Controller panel (45% width on large screens) */}
        <div className="w-full md:w-[42%] lg:w-[38%] xl:w-[34%] shrink-0 h-1/2 md:h-full">
          <FormPanel
            profile={profile}
            onChange={setProfile}
            onSuggestSkills={handleSuggestSkills}
            isSuggestingSkills={isSuggestingSkills}
            allSkills={allSkills}
          />
        </div>

        {/* Right Side: High-Fidelity GitHub Live Emulator (Remaining width) */}
        <div className="flex-1 h-1/2 md:h-full border-t md:border-t-0 md:border-l border-[#30363d]">
          <PreviewPanel
            profile={profile}
            markdownCode={markdownCode}
            onCopy={handleCopy}
            isCopied={isCopied}
          />
        </div>
      </div>
    </div>
  );
}
