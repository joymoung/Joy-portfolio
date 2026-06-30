import React, { useState } from "react";
import { 
  Eye, Code, Compass, Copy, Check, Download, Info, ExternalLink,
  Laptop, Sun, Moon, AlertTriangle, BookOpen, Star, GitFork, ChevronRight
} from "lucide-react";
import { ProfileData, TechSkill } from "../types";
import { PRESET_SKILLS } from "../data";

interface PreviewPanelProps {
  profile: ProfileData;
  markdownCode: string;
  onCopy: () => void;
  isCopied: boolean;
}

export default function PreviewPanel({ profile, markdownCode, onCopy, isCopied }: PreviewPanelProps) {
  const [viewMode, setViewMode] = useState<"preview" | "code" | "guide">("preview");
  const [githubTheme, setGithubTheme] = useState<"dark" | "light">("dark");

  const { name, role, location, aboutMe, pronouns, socials, techStack, stats, layout } = profile;
  const { alignment, showTypingEffect, typingTexts, showVisitorCounter, showDailyQuote, customTitlePrefix, dividerStyle } = layout;

  const ghUser = socials.github || "joymoung";
  const statTheme = stats.theme || "radical";

  // Filter skills
  const activeSkills = PRESET_SKILLS.filter((s) => techStack.includes(s.id));

  // Typings SVG url
  const themeColor = layout.themeStyle === "minimal-slate" ? "334155" : layout.themeStyle === "cyberpunk" ? "00F0FF" : "EE4C2C";
  const encodedLines = typingTexts.map((t) => encodeURIComponent(t)).join(";");
  const typingUrl = `https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=19&duration=3000&pause=1000&color=${themeColor}&center=${alignment === "center" ? "true" : "false"}&width=460&lines=${encodedLines}`;

  // Divider symbol
  const getDividerHTML = () => {
    switch (dividerStyle) {
      case "line":
        return <hr className={`my-6 ${githubTheme === "dark" ? "border-slate-800" : "border-slate-200"}`} />;
      case "classic":
        return <div className={`my-6 font-mono text-center tracking-widest ${githubTheme === "dark" ? "text-slate-700" : "text-slate-300"}`}>======================================================================</div>;
      case "dash":
        return <hr className={`my-6 border-dashed ${githubTheme === "dark" ? "border-slate-800" : "border-slate-300"}`} />;
      case "none":
      default:
        return <div className="my-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] font-sans">
      {/* Panel Headers */}
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#0d1117] px-4 py-2.5">
        <div className="flex rounded-lg bg-[#161b22] p-0.5 border border-[#30363d] text-xs">
          <button
            onClick={() => setViewMode("preview")}
            className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 font-medium transition-colors cursor-pointer ${
              viewMode === "preview"
                ? "bg-[#21262d] text-white border border-[#30363d] shadow-sm font-semibold"
                : "text-[#8b949e] hover:text-[#c9d1d9]"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>GitHub Live Preview</span>
          </button>
          <button
            onClick={() => setViewMode("code")}
            className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 font-medium transition-colors cursor-pointer ${
              viewMode === "code"
                ? "bg-[#21262d] text-white border border-[#30363d] shadow-sm font-semibold"
                : "text-[#8b949e] hover:text-[#c9d1d9]"
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>Raw Markdown Code</span>
          </button>
          <button
            onClick={() => setViewMode("guide")}
            className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 font-medium transition-colors cursor-pointer ${
              viewMode === "guide"
                ? "bg-[#21262d] text-white border border-[#30363d] shadow-sm font-semibold"
                : "text-[#8b949e] hover:text-[#c9d1d9]"
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Deployment Guide</span>
          </button>
        </div>

        {/* GitHub Light/Dark Toggle (Only in Preview mode) */}
        {viewMode === "preview" && (
          <div className="flex items-center gap-1 bg-[#161b22] border border-[#30363d] rounded-lg p-0.5 text-xs text-[#8b949e]">
            <button
              onClick={() => setGithubTheme("dark")}
              className={`p-1.5 rounded-md cursor-pointer ${
                githubTheme === "dark" ? "bg-[#21262d] text-[#58a6ff] font-bold border border-[#30363d]" : "hover:text-[#c9d1d9]"
              }`}
              title="GitHub Dark Mode Mockup"
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setGithubTheme("light")}
              className={`p-1.5 rounded-md cursor-pointer ${
                githubTheme === "light" ? "bg-[#21262d] text-[#d29922] font-bold border border-[#30363d]" : "hover:text-[#c9d1d9]"
              }`}
              title="GitHub Light Mode Mockup"
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Panel Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#0d1117]">
        
        {/* VIEW 1: LIVE GITHUB PREVIEW */}
        {viewMode === "preview" && (
          <div className="mx-auto max-w-4xl">
            {/* Mock GitHub Frame wrapper */}
            <div className={`rounded-xl border shadow-2xl overflow-hidden transition-all duration-300 ${
              githubTheme === "dark" 
                ? "bg-[#0d1117] border-[#30363d] text-[#e6edf3]" 
                : "bg-white border-[#d0d7de] text-[#24292f]"
            }`}>
              {/* GitHub Header bar mockup */}
              <div className={`flex items-center justify-between px-4 py-3 border-b text-xs font-semibold ${
                githubTheme === "dark" ? "bg-[#161b22] border-[#30363d] text-[#8b949e]" : "bg-[#f6f8fa] border-[#d0d7de] text-[#57606a]"
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-sky-500 font-bold cursor-pointer hover:underline">{ghUser}</span>
                  <span>/</span>
                  <span className="font-bold hover:underline cursor-pointer">README.md</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 hover:text-sky-500 cursor-pointer">
                    <Star className="h-3.5 w-3.5" />
                    <span>Star</span>
                  </div>
                  <div className="flex items-center gap-1 hover:text-sky-500 cursor-pointer">
                    <GitFork className="h-3.5 w-3.5" />
                    <span>Fork</span>
                  </div>
                </div>
              </div>

              {/* GitHub File View Toolbar */}
              <div className={`flex items-center justify-between px-4 py-2 border-b text-[11px] ${
                githubTheme === "dark" ? "bg-[#0d1117] border-[#30363d] text-[#8b949e]" : "bg-white border-[#d0d7de] text-[#57606a]"
              }`}>
                <div className="flex items-center gap-2 font-mono">
                  <span>146 lines (125 sloc)</span>
                  <span>·</span>
                  <span>4.12 KB</span>
                </div>
                <span className="rounded bg-sky-500/10 text-sky-400 px-1.5 py-0.5 text-[10px] font-semibold border border-sky-800/30">
                  WYSIWYG
                </span>
              </div>

              {/* RENDERED MARKDOWN BODY */}
              <div className={`p-8 md:p-12 font-sans overflow-x-auto ${
                alignment === "center" ? "text-center" : "text-left"
              }`}>
                
                {/* Greeting header */}
                <h1 className="text-2xl md:text-3.5xl font-bold tracking-tight mb-2">
                  {customTitlePrefix || "Hey there! I'm"} <span className="text-sky-500 font-extrabold">{name}</span>
                </h1>

                {/* Sub-headline */}
                <p className={`text-sm md:text-base font-semibold mb-1 ${
                  githubTheme === "dark" ? "text-slate-300" : "text-slate-600"
                }`}>
                  🚀 {role}
                </p>
                <p className={`text-xs md:text-sm flex items-center justify-center md:justify-start gap-1 mb-4 ${
                  githubTheme === "dark" ? "text-slate-400" : "text-slate-500"
                }`}>
                  <span>📍 Based in</span> <strong className={githubTheme === "dark" ? "text-slate-200" : "text-slate-700"}>{location}</strong>
                </p>

                {/* Visitor counter */}
                {showVisitorCounter && (
                  <div className={`mb-4 flex ${alignment === "center" ? "justify-center" : "justify-start"}`}>
                    <img 
                      src={`https://komarev.com/ghvc/?username=${ghUser}&color=3178C6&style=flat-square&label=PROFILE+VIEWS`} 
                      alt="Visitor Counter"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Typing Graphic SVG */}
                {showTypingEffect && typingTexts.length > 0 && (
                  <div className={`mb-6 flex ${alignment === "center" ? "justify-center" : "justify-start"}`}>
                    <img 
                      src={typingUrl} 
                      alt="Typing Effect" 
                      referrerPolicy="no-referrer"
                      className="max-w-full"
                    />
                  </div>
                )}

                {getDividerHTML()}

                {/* ABOUT ME SECTION */}
                <div className="mb-8">
                  <h2 className={`text-lg font-bold mb-3 flex items-center gap-2 border-b pb-1.5 ${
                    githubTheme === "dark" ? "border-slate-800 text-white" : "border-slate-200 text-[#24292f]"
                  }`}>
                    👤 About Me
                  </h2>
                  {aboutMe && (
                    <blockquote className={`border-l-4 pl-4 italic text-sm text-left my-4 rounded-r py-1 ${
                      githubTheme === "dark" 
                        ? "bg-slate-900/40 border-[#30363d] text-slate-300" 
                        : "bg-slate-50 border-[#d0d7de] text-[#57606a]"
                    }`}>
                      {aboutMe}
                    </blockquote>
                  )}
                  {showDailyQuote && (
                    <p className={`text-xs italic mt-2 ${githubTheme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
                      ✨ "The best way to predict the future is to invent it." - Alan Kay
                    </p>
                  )}
                </div>

                {getDividerHTML()}

                {/* TECH STACK & BADGES */}
                <div className="mb-8">
                  <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 border-b pb-1.5 ${
                    githubTheme === "dark" ? "border-slate-800 text-white" : "border-slate-200 text-[#24292f]"
                  }`}>
                    🛠️ Tech Stack & Competencies
                  </h2>
                  <div className={`flex flex-col gap-4 ${alignment === "center" ? "items-center" : "items-start text-left"}`}>
                    
                    {/* Hardcoded categories rendering with correct filters */}
                    {(["Languages", "Data Science & BI", "Backend", "Databases", "Frontend", "Tools & Cloud"] as const).map((cat) => {
                      const catSkills = activeSkills.filter((s) => s.category === cat);
                      if (catSkills.length === 0) return null;

                      return (
                        <div key={cat} className="w-full">
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block mb-2 ${
                            githubTheme === "dark" ? "text-slate-400" : "text-slate-500"
                          }`}>
                            {cat}
                          </span>
                          <div className={`flex flex-wrap gap-2 ${alignment === "center" ? "justify-center" : "justify-start"}`}>
                            {catSkills.map((skill) => {
                              const badgeStyle = layout.badgeStyle;
                              const badgeUrl = `https://img.shields.io/badge/${encodeURIComponent(skill.name)}-${skill.color}?style=${badgeStyle}&logo=${skill.slug}&logoColor=white`;
                              return (
                                <img
                                  key={skill.id}
                                  src={badgeUrl}
                                  alt={skill.name}
                                  referrerPolicy="no-referrer"
                                  className="h-6 object-contain"
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Advanced Core Competencies table */}
                  <div className={`w-full mt-6 border-t pt-4 ${githubTheme === "dark" ? "border-slate-800" : "border-slate-200"}`}>
                    <h3 className={`text-sm font-bold mb-3 flex items-center gap-1.5 ${
                      githubTheme === "dark" ? "text-slate-200" : "text-slate-800"
                    }`}>
                      <span>🧠 Core Methodologies & Advanced Competencies</span>
                    </h3>
                    
                    <div className={`overflow-x-auto rounded-lg border ${githubTheme === "dark" ? "border-slate-800 bg-slate-950/20" : "border-slate-200 bg-slate-50/20"}`}>
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className={githubTheme === "dark" ? "bg-slate-900/60 text-slate-300" : "bg-slate-50 text-slate-600"}>
                            <th className={`p-3 border-b font-semibold w-1/4 ${githubTheme === "dark" ? "border-slate-800" : "border-slate-200"}`}>Domain</th>
                            <th className={`p-3 border-b font-semibold w-3/4 ${githubTheme === "dark" ? "border-slate-800" : "border-slate-200"}`}>Demonstrated Capabilities & Methodologies</th>
                          </tr>
                        </thead>
                        <tbody className={githubTheme === "dark" ? "divide-y divide-slate-800/50" : "divide-y divide-slate-100"}>
                          <tr>
                            <td className="p-3 font-semibold valign-top text-sky-500">Machine Learning & Deep Learning</td>
                            <td className="p-3 leading-relaxed space-y-1">
                              <div>• <strong>Ensemble Paradigms:</strong> Bagging (Random Forest) vs. Boosting (XGBoost, CatBoost, LightGBM) bias-variance trade-offs.</div>
                              <div>• <strong>Deep Learning for Tabular Data:</strong> Regularization (Dropout, weight decay) & evaluation of Feedforward Neural Networks (MLPs) using TensorFlow/Keras.</div>
                              <div>• <strong>Hyperparameter Tuning:</strong> Optuna (Bayesian search), GridSearchCV, and k-Fold/RepeatedKFold validation.</div>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold valign-top text-sky-500">Data Science & Engineering Pipeline</td>
                            <td className="p-3 leading-relaxed space-y-1">
                              <div>• <strong>Data Wrangling & Cleaning:</strong> Manipulation of heterogeneous data streams, missing value imputation, & outlier treatment.</div>
                              <div>• <strong>Feature Transformation:</strong> Target stabilization (Log transforms, exponential back-transforms), mathematical scaling, and encoding.</div>
                              <div>• <strong>Pipeline Architecture:</strong> Leakage-free preprocessing pipelines using Scikit-Learn <code>Pipeline</code> & <code>ColumnTransformer</code>.</div>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold valign-top text-sky-500">Explainable AI (XAI) & Ethics</td>
                            <td className="p-3 leading-relaxed space-y-1">
                              <div>• <strong>Game-Theoretic Interpretability:</strong> Dissecting complex black-box models using Cooperative Game Theory concepts (SHAP Shapley values).</div>
                              <div>• <strong>Visual Transparency:</strong> Auditing model predictions with SHAP beeswarm summary plots, dependency plots, & local force plots.</div>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold valign-top text-sky-500">Data Storytelling & Visualization</td>
                            <td className="p-3 leading-relaxed space-y-1">
                              <div>• <strong>Interactive Web Dashboards:</strong> Designing and building fully responsive technical infographics using Tailwind CSS & Chart.js/Power BI.</div>
                              <div>• <strong>Data Storytelling:</strong> Translating high-dimensional architectural concepts (spatial transforms, residual attention, convergence) into dynamic visual aids.</div>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold valign-top text-sky-500">Research & Academic Writing</td>
                            <td className="p-3 leading-relaxed space-y-1">
                              <div>• <strong>CRISP-DM Execution:</strong> Systematic implementation of the industry-standard data mining process model across research stages.</div>
                              <div>• <strong>IEEE Formatting:</strong> Structuring academic literature reviews, methodological formulations, and peer-reviewed style bibliography references.</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {getDividerHTML()}

                {/* EXPERIENCE SECTION */}
                {profile.experience.length > 0 && (
                  <div className="mb-8 text-left">
                    <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 border-b pb-1.5 ${
                      githubTheme === "dark" ? "border-slate-800 text-white" : "border-slate-200 text-[#24292f]"
                    }`}>
                      💼 Professional Experience
                    </h2>
                    <div className="flex flex-col gap-6">
                      {profile.experience.map((exp) => (
                        <div key={exp.id} className="relative group pl-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                            <h3 className={`text-sm md:text-base font-bold ${githubTheme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                              {exp.role} <span className="text-sky-500 font-semibold">@ {exp.company}</span>
                            </h3>
                            <span className={`text-xs font-mono font-medium block ${githubTheme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                              {exp.period} | {exp.location}
                            </span>
                          </div>
                          <ul className={`list-disc pl-5 space-y-1.5 text-xs md:text-sm ${
                            githubTheme === "dark" ? "text-slate-300" : "text-slate-600"
                          }`}>
                            {exp.bullets.map((b, bIdx) => (
                              <li key={bIdx} className="leading-relaxed">
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {profile.experience.length > 0 && getDividerHTML()}

                {/* PROJECTS SECTION */}
                {profile.projects.length > 0 && (
                  <div className="mb-8 text-left">
                    <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 border-b pb-1.5 ${
                      githubTheme === "dark" ? "border-slate-800 text-white" : "border-slate-200 text-[#24292f]"
                    }`}>
                      🚀 Projects & Initiatives
                    </h2>
                    <div className="flex flex-col gap-5">
                      {profile.projects.map((proj) => (
                        <div key={proj.id} className="pl-1">
                          <h3 className={`text-sm md:text-base font-bold mb-1 ${githubTheme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                            🛠️ {proj.title}
                          </h3>
                          {proj.description && (
                            <p className={`text-xs italic mb-2 ${githubTheme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                              {proj.description}
                            </p>
                          )}
                          <ul className={`list-disc pl-5 space-y-1 text-xs md:text-sm ${
                            githubTheme === "dark" ? "text-slate-300" : "text-slate-600"
                          }`}>
                            {proj.bullets.map((b, bIdx) => (
                              <li key={bIdx} className="leading-relaxed">
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {profile.projects.length > 0 && getDividerHTML()}

                {/* EDUCATION SECTION */}
                {profile.education.length > 0 && (
                  <div className="mb-8 text-left">
                    <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 border-b pb-1.5 ${
                      githubTheme === "dark" ? "border-slate-800 text-white" : "border-slate-200 text-[#24292f]"
                    }`}>
                      🎓 Education & Academic Milestones
                    </h2>
                    <div className="flex flex-col gap-5">
                      {profile.education.map((edu) => (
                        <div key={edu.id} className="pl-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <h3 className={`text-xs md:text-sm font-bold ${githubTheme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                              🎓 {edu.degree} <span className={`font-normal ${githubTheme === "dark" ? "text-slate-400" : "text-slate-500"}`}>({edu.major})</span>
                            </h3>
                            <span className={`text-xs font-mono block ${githubTheme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                              {edu.period}
                            </span>
                          </div>
                          <p className={`text-xs font-semibold mb-1.5 ${githubTheme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                            {edu.institution} {edu.cgpa && <span className="bg-slate-800 text-amber-400 font-mono text-[10px] rounded px-1 ml-1.5 border border-slate-700">CGPA: {edu.cgpa}</span>}
                          </p>
                          {edu.achievements.length > 0 && (
                            <ul className={`list-disc pl-5 space-y-0.5 text-xs ${
                              githubTheme === "dark" ? "text-slate-400" : "text-slate-500"
                            }`}>
                              {edu.achievements.map((ach, aIdx) => (
                                <li key={aIdx}>{ach}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {profile.education.length > 0 && getDividerHTML()}

                {/* GITHUB ANALYTICS CARDS (EMULATED) */}
                {(stats.showStats || stats.showLanguages || stats.showStreak || stats.showTrophies || stats.showActivityGraph) && (
                  <div className="mb-8">
                    <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 border-b pb-1.5 ${
                      githubTheme === "dark" ? "border-slate-800 text-white" : "border-slate-200 text-[#24292f]"
                    }`}>
                      📊 GitHub Analytics & Insights
                    </h2>
                    
                    <div className={`flex ${alignment === "center" ? "justify-center" : "justify-start"} flex-wrap gap-4`}>
                      {stats.layout === "grid" ? (
                        <div className={`grid gap-4 ${alignment === "center" ? "justify-items-center" : ""} sm:grid-cols-2`}>
                          {stats.showStats && (
                            <img
                              src={`https://github-readme-stats.vercel.app/api?username=${ghUser}&show_icons=true&theme=${statTheme}&count_private=true`}
                              alt="GitHub Stats"
                              className="h-44 object-contain rounded"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          {stats.showLanguages && (
                            <img
                              src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${ghUser}&layout=compact&theme=${statTheme}&langs_count=8`}
                              alt="Top Languages"
                              className="h-44 object-contain rounded"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          {stats.showStreak && (
                            <img
                              src={`https://github-readme-streak-stats.herokuapp.com/?user=${ghUser}&theme=${statTheme}`}
                              alt="GitHub Streak"
                              className="h-44 object-contain rounded"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          {stats.showActivityGraph && (
                            <img
                              src={`https://github-readme-activity-graph.vercel.app/graph?username=${ghUser}&theme=${statTheme}`}
                              alt="Activity Graph"
                              className="h-44 object-contain rounded"
                              referrerPolicy="no-referrer"
                            />
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4 w-full">
                          {stats.showStats && (
                            <img
                              src={`https://github-readme-stats.vercel.app/api?username=${ghUser}&show_icons=true&theme=${statTheme}&count_private=true`}
                              alt="GitHub Stats"
                              className="max-h-44 object-contain rounded self-start"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          {stats.showLanguages && (
                            <img
                              src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${ghUser}&layout=compact&theme=${statTheme}&langs_count=8`}
                              alt="Top Languages"
                              className="max-h-44 object-contain rounded self-start"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          {stats.showStreak && (
                            <img
                              src={`https://github-readme-streak-stats.herokuapp.com/?user=${ghUser}&theme=${statTheme}`}
                              alt="GitHub Streak"
                              className="max-h-44 object-contain rounded self-start"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          {stats.showActivityGraph && (
                            <img
                              src={`https://github-readme-activity-graph.vercel.app/graph?username=${ghUser}&theme=${statTheme}`}
                              alt="Activity Graph"
                              className="max-h-44 object-contain rounded self-start"
                              referrerPolicy="no-referrer"
                            />
                          )}
                        </div>
                      )}

                      {stats.showTrophies && (
                        <img
                          src={`https://github-profile-trophy.vercel.app/?username=${ghUser}&theme=flat`}
                          alt="Profile Trophies"
                          className="w-full object-contain rounded mt-2"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                  </div>
                )}

                {(stats.showStats || stats.showLanguages || stats.showStreak || stats.showTrophies || stats.showActivityGraph) && getDividerHTML()}

                {/* CONNECT WITH ME */}
                <div className="mb-4">
                  <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 border-b pb-1.5 ${
                    githubTheme === "dark" ? "border-slate-800 text-white" : "border-slate-200 text-[#24292f]"
                  }`}>
                    🤝 Connect with Me
                  </h2>
                  <div className={`flex flex-wrap gap-2 ${alignment === "center" ? "justify-center" : "justify-start"}`}>
                    {socials.linkedin && (
                      <a href={`https://linkedin.com/in/${socials.linkedin}`} target="_blank" rel="noopener noreferrer">
                        <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" referrerPolicy="no-referrer" />
                      </a>
                    )}
                    {socials.github && (
                      <a href={`https://github.com/${socials.github}`} target="_blank" rel="noopener noreferrer">
                        <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" referrerPolicy="no-referrer" />
                      </a>
                    )}
                    {socials.email && (
                      <a href={`mailto:${socials.email}`}>
                        <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" referrerPolicy="no-referrer" />
                      </a>
                    )}
                    {socials.portfolio && (
                      <a href={`https://${socials.portfolio}`} target="_blank" rel="noopener noreferrer">
                        <img src="https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Portfolio" referrerPolicy="no-referrer" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: RAW MARKDOWN CODE */}
        {viewMode === "code" && (
          <div className="mx-auto max-w-4xl flex flex-col gap-3 h-full">
            <div className="flex items-center justify-between bg-[#161b22] border border-[#30363d] rounded-lg p-3 text-xs">
              <div className="flex items-center gap-2 text-[#c9d1d9]">
                <Info className="h-4 w-4 text-[#58a6ff]" />
                <span>Copy this raw markdown code and paste it inside your GitHub <strong>README.md</strong>.</span>
              </div>
              <button
                id="btn-copy-code"
                onClick={onCopy}
                className="flex items-center gap-1 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white rounded px-3 py-1 font-semibold cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#7ee787]" />
                    <span className="text-[#7ee787]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 rounded-xl border border-[#30363d] bg-[#161b22] p-4 font-mono text-[11px] leading-relaxed overflow-auto max-h-[60vh] select-text">
              <pre className="text-[#c9d1d9] whitespace-pre-wrap">{markdownCode}</pre>
            </div>
          </div>
        )}

        {/* VIEW 3: STEP-BY-STEP DEPLOYMENT GUIDE */}
        {viewMode === "guide" && (
          <div className="mx-auto max-w-2xl bg-[#161b22] rounded-xl border border-[#30363d] p-6 flex flex-col gap-6 text-sm text-[#c9d1d9]">
            <div>
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#58a6ff]" />
                How to activate your Premium Profile README
              </h2>
              <p className="text-[#8b949e] text-xs">
                Follow these simple steps on GitHub to configure this design as your official landing card.
              </p>
            </div>

            <div className="flex flex-col gap-4 text-xs md:text-sm">
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#21262d] border border-[#30363d] text-white font-mono text-xs">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Create a Secret Repository</h3>
                  <p className="text-[#8b949e]">
                    Log in to GitHub and create a new repository. Set the **Repository Name** to match your exact GitHub username (e.g. if your username is <code className="bg-[#0d1117] border border-[#30363d] rounded px-1 text-[#58a6ff] font-semibold">{ghUser}</code>, the repository must be named <code className="bg-[#0d1117] border border-[#30363d] rounded px-1 text-[#58a6ff] font-semibold">{ghUser}</code>).
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#21262d] border border-[#30363d] text-white font-mono text-xs">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Make it Public & Add README</h3>
                  <p className="text-[#8b949e]">
                    Ensure the repository is set to **Public** (required to show up on your profile) and check the box to **"Add a README file"**.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#21262d] border border-[#30363d] text-white font-mono text-xs">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Paste your Architect Code</h3>
                  <p className="text-[#8b949e]">
                    Open the <code className="bg-[#0d1117] border border-[#30363d] rounded px-1 text-[#c9d1d9] font-mono">README.md</code> in your new repository, click the **Edit (pencil icon)**, paste the complete raw markdown generated from our control deck, and commit the changes!
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0d1117] p-4 rounded-lg border border-[#30363d] flex items-start gap-2.5 text-xs">
              <Laptop className="h-4 w-4 text-[#58a6ff] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-200 block mb-1">Real-time Stats Caveat</span>
                <p className="text-[#8b949e] leading-relaxed">
                  Your top languages and activity stats reflect actual commit telemetry on GitHub. If you just created the account, cards may appear empty or show default mock-data until you make several public commits.
                </p>
              </div>
            </div>

            <a
              href="https://github.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] border border-[#2ea043]/35 text-white font-semibold py-2.5 transition-all text-xs cursor-pointer"
            >
              <span>Go to GitHub New Repository page</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
