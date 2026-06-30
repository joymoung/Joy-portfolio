import React, { useState } from "react";
import { 
  User, Wrench, Briefcase, Cpu, GraduationCap, BarChart3, Link, 
  Sparkles, Plus, Trash2, Check, RefreshCw, AlertCircle, Search, HelpCircle 
} from "lucide-react";
import { ProfileData, TechSkill, EducationItem, ExperienceItem, ProjectItem } from "../types";

interface FormPanelProps {
  profile: ProfileData;
  onChange: (updated: ProfileData) => void;
  onSuggestSkills: (skillsStr: string) => Promise<void>;
  isSuggestingSkills: boolean;
  allSkills: TechSkill[];
}

export default function FormPanel({ profile, onChange, onSuggestSkills, isSuggestingSkills, allSkills }: FormPanelProps) {
  const [activeTab, setActiveTab] = useState<string>("bio");
  const [skillSearch, setSkillSearch] = useState<string>("");
  const [customSkillInput, setCustomSkillInput] = useState<string>("");
  
  // AI Polish states
  const [polishingField, setPolishingField] = useState<string | null>(null);
  const [polishInstruction, setPolishInstruction] = useState<string>("");
  const [aiDraft, setAiDraft] = useState<string | null>(null);

  // Toggle active accordion section
  const toggleSection = (section: string) => {
    setActiveTab(activeTab === section ? "" : section);
    // Clear draft states when switching
    setAiDraft(null);
    setPolishInstruction("");
  };

  // Helper to deep update profile state
  const updateProfile = (key: keyof ProfileData, value: any) => {
    onChange({
      ...profile,
      [key]: value
    });
  };

  const updateLayout = (key: string, value: any) => {
    onChange({
      ...profile,
      layout: {
        ...profile.layout,
        [key]: value
      }
    });
  };

  const updateStats = (key: string, value: any) => {
    onChange({
      ...profile,
      stats: {
        ...profile.stats,
        [key]: value
      }
    });
  };

  // 1. Skill badge toggler
  const toggleSkill = (skillId: string) => {
    const current = [...profile.techStack];
    if (current.includes(skillId)) {
      updateProfile("techStack", current.filter((id) => id !== skillId));
    } else {
      updateProfile("techStack", [...current, skillId]);
    }
  };

  // 2. Experience array manager
  const updateExperienceItem = (id: string, updatedItem: Partial<ExperienceItem>) => {
    const list = profile.experience.map((item) => {
      if (item.id === id) {
        return { ...item, ...updatedItem };
      }
      return item;
    });
    updateProfile("experience", list);
  };

  const addExperienceBullet = (id: string) => {
    const item = profile.experience.find((x) => x.id === id);
    if (item) {
      updateExperienceItem(id, {
        bullets: [...item.bullets, "New high-impact achievement..."]
      });
    }
  };

  const updateExperienceBullet = (id: string, index: number, text: string) => {
    const item = profile.experience.find((x) => x.id === id);
    if (item) {
      const updatedBullets = [...item.bullets];
      updatedBullets[index] = text;
      updateExperienceItem(id, { bullets: updatedBullets });
    }
  };

  const deleteExperienceBullet = (id: string, index: number) => {
    const item = profile.experience.find((x) => x.id === id);
    if (item) {
      updateExperienceItem(id, {
        bullets: item.bullets.filter((_, idx) => idx !== index)
      });
    }
  };

  // 3. Projects array manager
  const updateProjectItem = (id: string, updatedItem: Partial<ProjectItem>) => {
    const list = profile.projects.map((item) => {
      if (item.id === id) {
        return { ...item, ...updatedItem };
      }
      return item;
    });
    updateProfile("projects", list);
  };

  const addProjectBullet = (id: string) => {
    const item = profile.projects.find((x) => x.id === id);
    if (item) {
      updateProjectItem(id, {
        bullets: [...item.bullets, "Implemented modular feature supporting..."]
      });
    }
  };

  const updateProjectBullet = (id: string, index: number, text: string) => {
    const item = profile.projects.find((x) => x.id === id);
    if (item) {
      const updatedBullets = [...item.bullets];
      updatedBullets[index] = text;
      updateProjectItem(id, { bullets: updatedBullets });
    }
  };

  const deleteProjectBullet = (id: string, index: number) => {
    const item = profile.projects.find((x) => x.id === id);
    if (item) {
      updateProjectItem(id, {
        bullets: item.bullets.filter((_, idx) => idx !== index)
      });
    }
  };

  // 4. Education manager
  const updateEducationItem = (id: string, updatedItem: Partial<EducationItem>) => {
    const list = profile.education.map((item) => {
      if (item.id === id) {
        return { ...item, ...updatedItem };
      }
      return item;
    });
    updateProfile("education", list);
  };

  const addEduAchievement = (id: string) => {
    const item = profile.education.find((x) => x.id === id);
    if (item) {
      updateEducationItem(id, {
        achievements: [...item.achievements, "Outstanding grade or academic project..."]
      });
    }
  };

  const updateEduAchievement = (id: string, index: number, text: string) => {
    const item = profile.education.find((x) => x.id === id);
    if (item) {
      const list = [...item.achievements];
      list[index] = text;
      updateEducationItem(id, { achievements: list });
    }
  };

  const deleteEduAchievement = (id: string, index: number) => {
    const item = profile.education.find((x) => x.id === id);
    if (item) {
      updateEducationItem(id, {
        achievements: item.achievements.filter((_, idx) => idx !== index)
      });
    }
  };

  // 5. AI Polishing Handler
  const handleAiPolish = async (type: "summary" | "bullet", originalText: string, contextId?: string, bulletIndex?: number) => {
    const fieldKey = contextId ? `${type}-${contextId}-${bulletIndex ?? ""}` : type;
    setPolishingField(fieldKey);
    setAiDraft(null);

    try {
      const response = await fetch("/api/polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: originalText,
          type,
          instructions: polishInstruction
        })
      });

      const data = await response.json();
      if (response.ok && data.polishedText) {
        setAiDraft(data.polishedText);
      } else {
        alert(data.error || "Failed to polish text via AI.");
      }
    } catch (err: any) {
      console.error(err);
      alert("Error reaching server: " + err.message);
    } finally {
      setPolishingField(null);
    }
  };

  // Apply AI Polished version
  const applyAiPolish = (targetType: string, contextId?: string, bulletIndex?: number) => {
    if (!aiDraft) return;

    if (targetType === "summary") {
      updateProfile("aboutMe", aiDraft);
    } else if (targetType === "bullet-experience" && contextId !== undefined && bulletIndex !== undefined) {
      updateExperienceBullet(contextId, bulletIndex, aiDraft);
    } else if (targetType === "bullet-project" && contextId !== undefined && bulletIndex !== undefined) {
      updateProjectBullet(contextId, bulletIndex, aiDraft);
    }

    setAiDraft(null);
    setPolishInstruction("");
  };

  // Filter skills based on search
  const filteredSkills = allSkills.filter((s) => 
    s.name.toLowerCase().includes(skillSearch.toLowerCase()) || 
    s.category.toLowerCase().includes(skillSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 bg-[#0d1117] p-4 border-r border-[#30363d] h-full overflow-y-auto font-sans">
      <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
        <h2 className="text-sm font-semibold text-[#c9d1d9] tracking-wide flex items-center gap-1.5 uppercase font-mono">
          🎛️ Builder Control Deck
        </h2>
        <span className="text-[10px] text-[#8b949e] bg-[#161b22] border border-[#30363d] px-2 py-0.5 rounded font-mono">
          Ready
        </span>
      </div>

      {/* 1. BIO & INFO SECTION */}
      <div className="rounded-lg border border-[#30363d] bg-[#161b22] overflow-hidden transition-all shadow-sm">
        <button
          onClick={() => toggleSection("bio")}
          className="w-full flex items-center justify-between p-4 text-left font-semibold text-[#c9d1d9] hover:bg-[#21262d] cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <User className="h-4 w-4 text-[#58a6ff]" />
            <span className="text-sm font-medium">Header & Biography</span>
          </div>
          <span className="text-[#8b949e] text-xs">{activeTab === "bio" ? "▼" : "▶"}</span>
        </button>

        {activeTab === "bio" && (
          <div className="p-4 border-t border-[#30363d] bg-[#0d1117] flex flex-col gap-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#8b949e] font-medium mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => updateProfile("name", e.target.value)}
                  className="w-full rounded bg-[#0d1117] border border-[#30363d] px-3 py-2 text-[#c9d1d9] outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
                />
              </div>
              <div>
                <label className="text-[#8b949e] font-medium mb-1 block">Pronouns</label>
                <input
                  type="text"
                  placeholder="e.g. He/Him"
                  value={profile.pronouns || ""}
                  onChange={(e) => updateProfile("pronouns", e.target.value)}
                  className="w-full rounded bg-[#0d1117] border border-[#30363d] px-3 py-2 text-[#c9d1d9] outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
                />
              </div>
            </div>

            <div>
              <label className="text-[#8b949e] font-medium mb-1 block">Professional Headline</label>
              <input
                type="text"
                value={profile.role}
                onChange={(e) => updateProfile("role", e.target.value)}
                className="w-full rounded bg-[#0d1117] border border-[#30363d] px-3 py-2 text-[#c9d1d9] outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#8b949e] font-medium mb-1 block">Greeting Prefix</label>
                <input
                  type="text"
                  value={profile.layout.customTitlePrefix}
                  onChange={(e) => updateLayout("customTitlePrefix", e.target.value)}
                  className="w-full rounded bg-[#0d1117] border border-[#30363d] px-3 py-2 text-[#c9d1d9] outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
                />
              </div>
              <div>
                <label className="text-[#8b949e] font-medium mb-1 block">Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => updateProfile("location", e.target.value)}
                  className="w-full rounded bg-[#0d1117] border border-[#30363d] px-3 py-2 text-[#c9d1d9] outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[#8b949e] font-medium block">About Me / Professional Summary</label>
                <span className="text-[10px] text-[#8b949e]">Fact-preserved</span>
              </div>
              <textarea
                rows={6}
                value={profile.aboutMe}
                onChange={(e) => updateProfile("aboutMe", e.target.value)}
                className="w-full rounded bg-[#0d1117] border border-[#30363d] p-3 text-[#c9d1d9] outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] resize-none font-mono text-[11px]"
              />
            </div>

            {/* AI Summary Polisher Module */}
            <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-3 mt-1">
              <div className="flex items-center gap-1.5 text-[#58a6ff] font-medium mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="font-mono text-[11px] tracking-wide uppercase">AI Summary Optimizer</span>
              </div>
              
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="e.g., Emphasize predictive pipelines and CGPA scores..."
                  value={polishInstruction}
                  onChange={(e) => setPolishInstruction(e.target.value)}
                  className="w-full rounded bg-[#0d1117] border border-[#30363d] px-2.5 py-1.5 text-[11px] text-[#c9d1d9] outline-none placeholder-[#8b949e]/50 focus:border-[#58a6ff]"
                />
                
                <button
                  id="btn-ai-polish-summary"
                  disabled={polishingField !== null}
                  onClick={() => handleAiPolish("summary", profile.aboutMe)}
                  className="w-full rounded bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] py-1.5 font-medium text-[#58a6ff] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {polishingField === "summary" ? (
                    <>
                      <RefreshCw className="h-3 w-3 animate-spin text-[#58a6ff]" />
                      <span>Synthesizing Bio...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-[#e3b341]" />
                      <span>Enhance Biography with Gemini</span>
                    </>
                  )}
                </button>
              </div>

              {aiDraft && (
                <div className="mt-3 border-t border-[#30363d] pt-3 flex flex-col gap-2 bg-[#0d1117] p-2.5 rounded">
                  <div className="text-[10px] text-[#d29922] font-medium">Gemini Polished Draft:</div>
                  <p className="text-[10px] text-[#c9d1d9] italic font-mono leading-relaxed bg-[#161b22]/50 p-2 rounded max-h-36 overflow-y-auto">
                    {aiDraft}
                  </p>
                  <div className="flex items-center justify-end gap-2 text-[10px]">
                    <button
                      onClick={() => { setAiDraft(null); setPolishInstruction(""); }}
                      className="px-2 py-1 rounded border border-[#30363d] text-[#8b949e] hover:bg-[#161b22] cursor-pointer"
                    >
                      Discard
                    </button>
                    <button
                      onClick={() => applyAiPolish("summary")}
                      className="px-2 py-1 rounded bg-[#238636] text-white border border-[#2ea043]/35 hover:bg-[#2ea043] cursor-pointer flex items-center gap-1 font-medium"
                    >
                      <Check className="h-3 w-3" />
                      Apply Bio
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sub-layout elements */}
            <div className="grid grid-cols-2 gap-3 mt-1 pt-1 border-t border-[#30363d]">
              <div className="flex items-center justify-between bg-[#161b22] p-2 rounded border border-[#30363d]">
                <span className="text-[#8b949e]">Typing Effect SVG</span>
                <input
                  type="checkbox"
                  checked={profile.layout.showTypingEffect}
                  onChange={(e) => updateLayout("showTypingEffect", e.target.checked)}
                  className="rounded bg-[#0d1117] border-[#30363d] text-[#58a6ff] h-4 w-4 cursor-pointer focus:ring-0 focus:ring-offset-0"
                />
              </div>
              <div className="flex items-center justify-between bg-[#161b22] p-2 rounded border border-[#30363d]">
                <span className="text-[#8b949e]">Visitor views meter</span>
                <input
                  type="checkbox"
                  checked={profile.layout.showVisitorCounter}
                  onChange={(e) => updateLayout("showVisitorCounter", e.target.checked)}
                  className="rounded bg-[#0d1117] border-[#30363d] text-[#58a6ff] h-4 w-4 cursor-pointer focus:ring-0 focus:ring-offset-0"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. TECH STACK SELECTION */}
      <div className="rounded-lg border border-[#30363d] bg-[#161b22] overflow-hidden transition-all shadow-sm">
        <button
          onClick={() => toggleSection("tech")}
          className="w-full flex items-center justify-between p-4 text-left font-semibold text-[#c9d1d9] hover:bg-[#21262d] cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Wrench className="h-4 w-4 text-[#e3b341]" />
            <span className="text-sm font-medium">Tech Stack & Shields.io Badges</span>
          </div>
          <span className="text-[#8b949e] text-xs">{activeTab === "tech" ? "▼" : "▶"}</span>
        </button>

        {activeTab === "tech" && (
          <div className="p-4 border-t border-[#30363d] bg-[#0d1117] flex flex-col gap-3 text-xs">
            {/* Search filter */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#8b949e]" />
              <input
                type="text"
                placeholder="Search skills (e.g. Python, BI, SQL...)"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                className="w-full rounded bg-[#0d1117] border border-[#30363d] pl-8 pr-3 py-2 text-[#c9d1d9] outline-none text-[11px] focus:border-[#58a6ff]"
              />
            </div>

            {/* Quick stats on selected */}
            <div className="flex items-center justify-between text-[10px] text-[#8b949e] bg-[#161b22] border border-[#30363d] p-2 rounded">
              <span>Selected Badges: <strong className="text-[#7ee787] font-bold">{profile.techStack.length}</strong></span>
              <button 
                onClick={() => updateProfile("techStack", [])}
                className="text-[#58a6ff] hover:underline cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Badges select design style */}
            <div className="flex items-center justify-between bg-[#161b22]/50 p-2 rounded border border-[#30363d]">
              <span className="text-[#8b949e]">Badge Theme style</span>
              <select
                value={profile.layout.badgeStyle}
                onChange={(e) => updateLayout("badgeStyle", e.target.value)}
                className="rounded bg-[#0d1117] border border-[#30363d] px-2 py-1 text-[#c9d1d9] outline-none focus:border-[#58a6ff]"
              >
                <option value="for-the-badge">for-the-badge</option>
                <option value="flat">flat</option>
                <option value="flat-square">flat-square</option>
                <option value="plastic">plastic</option>
              </select>
            </div>

            {/* List of Skills categorized */}
            <div className="max-h-60 overflow-y-auto flex flex-col gap-3 pr-1">
              {Array.from(new Set(allSkills.map((s) => s.category))).map((cat) => {
                const skillsInCat = filteredSkills.filter((s) => s.category === cat);
                if (skillsInCat.length === 0) return null;
                
                return (
                  <div key={cat} className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-mono text-[#8b949e] uppercase tracking-wider font-semibold">
                      {cat}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {skillsInCat.map((skill) => {
                        const isActive = profile.techStack.includes(skill.id);
                        return (
                          <button
                            key={skill.id}
                            onClick={() => toggleSkill(skill.id)}
                            className={`px-2 py-1.5 rounded transition-all flex items-center gap-1.5 border cursor-pointer ${
                              isActive
                                ? "bg-[#238636]/15 text-[#7ee787] border-[#238636]/45"
                                : "bg-[#0d1117] text-[#8b949e] border-[#30363d] hover:border-[#8b949e]/50 hover:text-[#c9d1d9]"
                            }`}
                          >
                            <span 
                              className="h-1.5 w-1.5 rounded-full" 
                              style={{ backgroundColor: `#${skill.color}` }}
                            />
                            <span className="text-[10px] font-medium">{skill.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dynamic AI skills suggester */}
            <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-3 mt-1">
              <div className="flex items-center gap-1.5 text-[#58a6ff] font-medium mb-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="font-mono text-[10px] tracking-wide uppercase">AI Badge Suggestion Engine</span>
              </div>
              <p className="text-[10px] text-[#8b949e] mb-2 leading-relaxed">
                Need to add complex libraries, platforms, or tools? Enter custom technologies separated by commas.
              </p>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Scrapy, PySpark, Drizzle ORM..."
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  className="flex-1 rounded bg-[#0d1117] border border-[#30363d] px-2.5 py-1.5 text-[11px] text-[#c9d1d9] outline-none placeholder-[#8b949e]/50 focus:border-[#58a6ff]"
                />
                <button
                  id="btn-ai-suggest-badges"
                  disabled={isSuggestingSkills}
                  onClick={async () => {
                    if (!customSkillInput.trim()) return;
                    await onSuggestSkills(customSkillInput);
                    setCustomSkillInput("");
                  }}
                  className="rounded bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] p-2 font-medium text-[#58a6ff] flex items-center justify-center transition-colors cursor-pointer"
                >
                  {isSuggestingSkills ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. EXPERIENCE SECTION */}
      <div className="rounded-lg border border-[#30363d] bg-[#161b22] overflow-hidden transition-all shadow-sm">
        <button
          onClick={() => toggleSection("experience")}
          className="w-full flex items-center justify-between p-4 text-left font-semibold text-[#c9d1d9] hover:bg-[#21262d] cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Briefcase className="h-4 w-4 text-[#58a6ff]" />
            <span className="text-sm font-medium">Professional Experience</span>
          </div>
          <span className="text-[#8b949e] text-xs">{activeTab === "experience" ? "▼" : "▶"}</span>
        </button>

        {activeTab === "experience" && (
          <div className="p-4 border-t border-[#30363d] bg-[#0d1117] flex flex-col gap-4 text-xs">
            {profile.experience.map((exp) => (
              <div key={exp.id} className="bg-[#161b22] p-3 rounded-lg border border-[#30363d] flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[#8b949e] text-[10px] font-medium block mb-0.5">Role/Title</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateExperienceItem(exp.id, { role: e.target.value })}
                      className="w-full rounded bg-[#0d1117] border border-[#30363d] px-2 py-1 text-[#c9d1d9] outline-none focus:border-[#58a6ff]"
                    />
                  </div>
                  <div>
                    <label className="text-[#8b949e] text-[10px] font-medium block mb-0.5">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperienceItem(exp.id, { company: e.target.value })}
                      className="w-full rounded bg-[#0d1117] border border-[#30363d] px-2 py-1 text-[#c9d1d9] outline-none focus:border-[#58a6ff]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[#8b949e] text-[10px] font-medium block mb-0.5">Period</label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => updateExperienceItem(exp.id, { period: e.target.value })}
                      className="w-full rounded bg-[#0d1117] border border-[#30363d] px-2 py-1 text-[#c9d1d9] outline-none focus:border-[#58a6ff]"
                    />
                  </div>
                  <div>
                    <label className="text-[#8b949e] text-[10px] font-medium block mb-0.5">Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => updateExperienceItem(exp.id, { location: e.target.value })}
                      className="w-full rounded bg-[#0d1117] border border-[#30363d] px-2 py-1 text-[#c9d1d9] outline-none focus:border-[#58a6ff]"
                    />
                  </div>
                </div>

                {/* Bullets array list */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8b949e] font-medium font-mono text-[10px] uppercase">Bullet Achievements</span>
                    <button
                      onClick={() => addExperienceBullet(exp.id)}
                      className="text-[#58a6ff] hover:text-[#79c0ff] font-medium flex items-center gap-0.5 cursor-pointer text-[11px]"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add
                    </button>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {exp.bullets.map((bullet, bIdx) => {
                      const bulletKey = `exp-${exp.id}-${bIdx}`;
                      return (
                        <div key={bIdx} className="flex flex-col gap-1.5 bg-[#0d1117] p-2 rounded border border-[#30363d]">
                          <div className="flex items-start gap-2">
                            <span className="text-[#8b949e] mt-1.5 font-bold font-mono">#{bIdx + 1}</span>
                            <textarea
                              rows={2}
                              value={bullet}
                              onChange={(e) => updateExperienceBullet(exp.id, bIdx, e.target.value)}
                              className="flex-1 rounded bg-[#161b22] border border-[#30363d] p-2 text-[#c9d1d9] outline-none text-[11px] focus:border-[#58a6ff]"
                            />
                            <button
                              onClick={() => deleteExperienceBullet(exp.id, bIdx)}
                              className="text-[#f85149] hover:text-[#ff7b72] mt-1 cursor-pointer"
                              title="Delete Bullet"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* AI Polish Bullet button */}
                          <div className="flex items-center justify-between border-t border-[#30363d] pt-1.5">
                            <span className="text-[9px] text-[#8b949e] flex items-center gap-1">
                              <HelpCircle className="h-3 w-3" /> Tone polish below
                            </span>
                            <button
                              id={`btn-ai-polish-exp-${exp.id}-${bIdx}`}
                              disabled={polishingField !== null}
                              onClick={() => handleAiPolish("bullet", bullet, exp.id, bIdx)}
                              className="text-[#58a6ff] hover:text-[#79c0ff] flex items-center gap-1 text-[10px] font-medium cursor-pointer"
                            >
                              {polishingField === bulletKey ? (
                                <>
                                  <RefreshCw className="h-2.5 w-2.5 animate-spin text-[#58a6ff]" />
                                  <span>Polishing...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-3 w-3 text-[#e3b341]" />
                                  <span>Gemini Polish</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* AI Draft overlay for this specific bullet */}
                          {aiDraft && polishingField === null && activeTab === "experience" && (
                            <div className="mt-2 bg-[#161b22] p-2 rounded border border-[#30363d]">
                              <span className="text-[9px] text-[#d29922] font-semibold block mb-1">Polished Version:</span>
                              <p className="text-[10px] text-[#c9d1d9] italic mb-2 leading-relaxed bg-[#0d1117] p-1.5 rounded">{aiDraft}</p>
                              <div className="flex items-center justify-end gap-1.5">
                                <button 
                                  onClick={() => setAiDraft(null)} 
                                  className="px-1.5 py-0.5 rounded border border-[#30363d] text-[#8b949e] hover:bg-[#0d1117] text-[9px] cursor-pointer"
                                >
                                  Discard
                                </button>
                                <button 
                                  onClick={() => applyAiPolish("bullet-experience", exp.id, bIdx)} 
                                  className="px-1.5 py-0.5 rounded bg-[#238636] border border-[#2ea043]/30 text-white hover:bg-[#2ea043] text-[9px] font-semibold cursor-pointer"
                                >
                                  Apply
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. PROJECTS SECTION */}
      <div className="rounded-lg border border-[#30363d] bg-[#161b22] overflow-hidden transition-all shadow-sm">
        <button
          onClick={() => toggleSection("projects")}
          className="w-full flex items-center justify-between p-4 text-left font-semibold text-[#c9d1d9] hover:bg-[#21262d] cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Cpu className="h-4 w-4 text-[#7ee787]" />
            <span className="text-sm font-medium">Projects & Initiatives</span>
          </div>
          <span className="text-[#8b949e] text-xs">{activeTab === "projects" ? "▼" : "▶"}</span>
        </button>

        {activeTab === "projects" && (
          <div className="p-4 border-t border-[#30363d] bg-[#0d1117] flex flex-col gap-4 text-xs">
            {profile.projects.map((proj) => (
              <div key={proj.id} className="bg-[#161b22] p-3 rounded-lg border border-[#30363d] flex flex-col gap-3">
                <div>
                  <label className="text-[#8b949e] text-[10px] font-medium block mb-0.5">Project Title</label>
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => updateProjectItem(proj.id, { title: e.target.value })}
                    className="w-full rounded bg-[#0d1117] border border-[#30363d] px-2 py-1 text-[#c9d1d9] outline-none focus:border-[#58a6ff]"
                  />
                </div>

                <div>
                  <label className="text-[#8b949e] text-[10px] font-medium block mb-0.5">Subtitle/Context</label>
                  <input
                    type="text"
                    value={proj.description}
                    onChange={(e) => updateProjectItem(proj.id, { description: e.target.value })}
                    className="w-full rounded bg-[#0d1117] border border-[#30363d] px-2 py-1 text-[#c9d1d9] outline-none focus:border-[#58a6ff]"
                  />
                </div>

                {/* Bullets array list */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8b949e] font-medium font-mono text-[10px] uppercase">Bullet Details</span>
                    <button
                      onClick={() => addProjectBullet(proj.id)}
                      className="text-[#58a6ff] hover:text-[#79c0ff] font-medium flex items-center gap-0.5 cursor-pointer text-[11px]"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add
                    </button>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {proj.bullets.map((bullet, bIdx) => {
                      const bulletKey = `proj-${proj.id}-${bIdx}`;
                      return (
                        <div key={bIdx} className="flex flex-col gap-1.5 bg-[#0d1117] p-2 rounded border border-[#30363d]">
                          <div className="flex items-start gap-2">
                            <span className="text-[#8b949e] mt-1.5 font-bold font-mono">#{bIdx + 1}</span>
                            <textarea
                              rows={2}
                              value={bullet}
                              onChange={(e) => updateProjectBullet(proj.id, bIdx, e.target.value)}
                              className="flex-1 rounded bg-[#161b22] border border-[#30363d] p-2 text-[#c9d1d9] outline-none text-[11px] focus:border-[#58a6ff]"
                            />
                            <button
                              onClick={() => deleteProjectBullet(proj.id, bIdx)}
                              className="text-[#f85149] hover:text-[#ff7b72] mt-1 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* AI Polish Bullet button */}
                          <div className="flex items-center justify-between border-t border-[#30363d] pt-1.5">
                            <span className="text-[9px] text-[#8b949e]">Custom context applies</span>
                            <button
                              id={`btn-ai-polish-proj-${proj.id}-${bIdx}`}
                              disabled={polishingField !== null}
                              onClick={() => handleAiPolish("bullet", bullet, proj.id, bIdx)}
                              className="text-[#58a6ff] hover:text-[#79c0ff] flex items-center gap-1 text-[10px] font-medium cursor-pointer"
                            >
                              {polishingField === bulletKey ? (
                                <>
                                  <RefreshCw className="h-2.5 w-2.5 animate-spin text-[#58a6ff]" />
                                  <span>Polishing...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-3 w-3 text-[#e3b341]" />
                                  <span>Gemini Polish</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* AI Draft overlay for this specific project bullet */}
                          {aiDraft && polishingField === null && activeTab === "projects" && (
                            <div className="mt-2 bg-[#161b22] p-2 rounded border border-[#30363d]">
                              <span className="text-[9px] text-[#d29922] font-semibold block mb-1">Polished Version:</span>
                              <p className="text-[10px] text-[#c9d1d9] italic mb-2 leading-relaxed bg-[#0d1117] p-1.5 rounded">{aiDraft}</p>
                              <div className="flex items-center justify-end gap-1.5">
                                <button 
                                  onClick={() => setAiDraft(null)} 
                                  className="px-1.5 py-0.5 rounded border border-[#30363d] text-[#8b949e] hover:bg-[#0d1117] text-[9px] cursor-pointer"
                                >
                                  Discard
                                </button>
                                <button 
                                  onClick={() => applyAiPolish("bullet-project", proj.id, bIdx)} 
                                  className="px-1.5 py-0.5 rounded bg-[#238636] border border-[#2ea043]/30 text-white hover:bg-[#2ea043] text-[9px] font-semibold cursor-pointer"
                                >
                                  Apply
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. EDUCATION SECTIONS */}
      <div className="rounded-lg border border-[#30363d] bg-[#161b22] overflow-hidden transition-all shadow-sm">
        <button
          onClick={() => toggleSection("education")}
          className="w-full flex items-center justify-between p-4 text-left font-semibold text-[#c9d1d9] hover:bg-[#21262d] cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <GraduationCap className="h-4 w-4 text-[#8a63d2]" />
            <span className="text-sm font-medium">Education & Degrees</span>
          </div>
          <span className="text-[#8b949e] text-xs">{activeTab === "education" ? "▼" : "▶"}</span>
        </button>

        {activeTab === "education" && (
          <div className="p-4 border-t border-[#30363d] bg-[#0d1117] flex flex-col gap-4 text-xs">
            {profile.education.map((edu) => (
              <div key={edu.id} className="bg-[#161b22] p-3 rounded-lg border border-[#30363d] flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[#8b949e] text-[10px] block mb-0.5">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducationItem(edu.id, { degree: e.target.value })}
                      className="w-full rounded bg-[#0d1117] border border-[#30363d] px-2 py-1 text-[#c9d1d9] outline-none focus:border-[#58a6ff]"
                    />
                  </div>
                  <div>
                    <label className="text-[#8b949e] text-[10px] block mb-0.5">Major/Focus</label>
                    <input
                      type="text"
                      value={edu.major}
                      onChange={(e) => updateEducationItem(edu.id, { major: e.target.value })}
                      className="w-full rounded bg-[#0d1117] border border-[#30363d] px-2 py-1 text-[#c9d1d9] outline-none focus:border-[#58a6ff]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[#8b949e] text-[10px] block mb-0.5">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducationItem(edu.id, { institution: e.target.value })}
                      className="w-full rounded bg-[#0d1117] border border-[#30363d] px-2 py-1 text-[#c9d1d9] outline-none focus:border-[#58a6ff]"
                    />
                  </div>
                  <div>
                    <label className="text-[#8b949e] text-[10px] block mb-0.5">Period</label>
                    <input
                      type="text"
                      value={edu.period}
                      onChange={(e) => updateEducationItem(edu.id, { period: e.target.value })}
                      className="w-full rounded bg-[#0d1117] border border-[#30363d] px-2 py-1 text-[#c9d1d9] outline-none focus:border-[#58a6ff]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[#8b949e] text-[10px] block mb-0.5">GPA/CGPA</label>
                    <input
                      type="text"
                      value={edu.cgpa || ""}
                      onChange={(e) => updateEducationItem(edu.id, { cgpa: e.target.value })}
                      className="w-full rounded bg-[#0d1117] border border-[#30363d] px-2 py-1 text-[#c9d1d9] outline-none focus:border-[#58a6ff]"
                    />
                  </div>
                </div>

                {/* Achievements block */}
                <div className="flex flex-col gap-1.5 mt-1 border-t border-[#30363d] pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#8b949e] font-medium text-[9px] uppercase tracking-wider">Achievements</span>
                    <button
                      onClick={() => addEduAchievement(edu.id)}
                      className="text-[#58a6ff] hover:text-[#79c0ff] text-[10px] font-medium flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" /> Add Achievement
                    </button>
                  </div>
                  {edu.achievements.map((ach, aIdx) => (
                    <div key={aIdx} className="flex items-center gap-1.5 bg-[#0d1117] p-1.5 rounded border border-[#30363d]">
                      <input
                        type="text"
                        value={ach}
                        onChange={(e) => updateEduAchievement(edu.id, aIdx, e.target.value)}
                        className="flex-1 bg-transparent border-none text-[11px] text-[#c9d1d9] outline-none px-1"
                      />
                      <button
                        onClick={() => deleteEduAchievement(edu.id, aIdx)}
                        className="text-[#f85149] hover:text-[#ff7b72] cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. GITHUB STATS CARDS CONFIG */}
      <div className="rounded-lg border border-[#30363d] bg-[#161b22] overflow-hidden transition-all shadow-sm">
        <button
          onClick={() => toggleSection("stats")}
          className="w-full flex items-center justify-between p-4 text-left font-semibold text-[#c9d1d9] hover:bg-[#21262d] cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <BarChart3 className="h-4 w-4 text-[#ff7b72]" />
            <span className="text-sm font-medium">GitHub Analytics & Themes</span>
          </div>
          <span className="text-[#8b949e] text-xs">{activeTab === "stats" ? "▼" : "▶"}</span>
        </button>

        {activeTab === "stats" && (
          <div className="p-4 border-t border-[#30363d] bg-[#0d1117] flex flex-col gap-4 text-xs">
            <div className="bg-[#161b22] p-3 rounded-lg border border-[#30363d] flex flex-col gap-3">
              <span className="text-[#8b949e] font-mono text-[10px] uppercase tracking-wide">Dynamic Cards</span>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#c9d1d9] font-medium">General Stats Card</span>
                  <input
                    type="checkbox"
                    checked={profile.stats.showStats}
                    onChange={(e) => updateStats("showStats", e.target.checked)}
                    className="rounded bg-[#0d1117] border-[#30363d] text-[#58a6ff] h-4 w-4 cursor-pointer focus:ring-0 focus:ring-offset-0"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#c9d1d9] font-medium">Most Used Languages Card</span>
                  <input
                    type="checkbox"
                    checked={profile.stats.showLanguages}
                    onChange={(e) => updateStats("showLanguages", e.target.checked)}
                    className="rounded bg-[#0d1117] border-[#30363d] text-[#58a6ff] h-4 w-4 cursor-pointer focus:ring-0 focus:ring-offset-0"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#c9d1d9] font-medium">GitHub Streak stats</span>
                  <input
                    type="checkbox"
                    checked={profile.stats.showStreak}
                    onChange={(e) => updateStats("showStreak", e.target.checked)}
                    className="rounded bg-[#0d1117] border-[#30363d] text-[#58a6ff] h-4 w-4 cursor-pointer focus:ring-0 focus:ring-offset-0"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#c9d1d9] font-medium">Profile Activity Graph</span>
                  <input
                    type="checkbox"
                    checked={profile.stats.showActivityGraph}
                    onChange={(e) => updateStats("showActivityGraph", e.target.checked)}
                    className="rounded bg-[#0d1117] border-[#30363d] text-[#58a6ff] h-4 w-4 cursor-pointer focus:ring-0 focus:ring-offset-0"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#c9d1d9] font-medium">GitHub Profile Trophies</span>
                  <input
                    type="checkbox"
                    checked={profile.stats.showTrophies}
                    onChange={(e) => updateStats("showTrophies", e.target.checked)}
                    className="rounded bg-[#0d1117] border-[#30363d] text-[#58a6ff] h-4 w-4 cursor-pointer focus:ring-0 focus:ring-offset-0"
                  />
                </div>
              </div>
            </div>

            {/* Custom Theme Selector */}
            <div className="bg-[#161b22] p-3 rounded-lg border border-[#30363d] flex flex-col gap-3">
              <div>
                <label className="text-[#8b949e] font-medium block mb-1">Stats Card Theme</label>
                <select
                  value={profile.stats.theme}
                  onChange={(e) => updateStats("theme", e.target.value)}
                  className="w-full rounded bg-[#0d1117] border border-[#30363d] px-3 py-2 text-[#c9d1d9] outline-none focus:border-[#58a6ff] font-mono text-[11px]"
                >
                  <option value="radical">radical (Dynamic Red)</option>
                  <option value="dracula">dracula (Deep Purple)</option>
                  <option value="github_dark">github_dark (Official Dark)</option>
                  <option value="monokai">monokai (Vintage Tech)</option>
                  <option value="ocean">ocean (Ambient Blue)</option>
                  <option value="highcontrast">highcontrast (Neon Accent)</option>
                  <option value="tokyonight">tokyonight (Cyberpunk)</option>
                  <option value="solarized_dark">solarized_dark (Teal-Yellow)</option>
                </select>
              </div>

              <div>
                <label className="text-[#8b949e] font-medium block mb-1">Stats Cards Layout</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    onClick={() => updateStats("layout", "grid")}
                    className={`px-3 py-2 rounded text-center border font-medium cursor-pointer ${
                      profile.stats.layout === "grid"
                        ? "bg-[#238636]/15 border-[#238636] text-[#7ee787] font-bold"
                        : "bg-[#0d1117] border-[#30363d] text-[#8b949e]"
                    }`}
                  >
                    Grid Row (Side-by-side)
                  </button>
                  <button
                    onClick={() => updateStats("layout", "stacked")}
                    className={`px-3 py-2 rounded text-center border font-medium cursor-pointer ${
                      profile.stats.layout === "stacked"
                        ? "bg-[#238636]/15 border-[#238636] text-[#7ee787] font-bold"
                        : "bg-[#0d1117] border-[#30363d] text-[#8b949e]"
                    }`}
                  >
                    Stacked Column
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 7. SOCIAL LINKS */}
      <div className="rounded-lg border border-[#30363d] bg-[#161b22] overflow-hidden transition-all shadow-sm">
        <button
          onClick={() => toggleSection("socials")}
          className="w-full flex items-center justify-between p-4 text-left font-semibold text-[#c9d1d9] hover:bg-[#21262d] cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Link className="h-4 w-4 text-[#58a6ff]" />
            <span className="text-sm font-medium">Social & Contact Links</span>
          </div>
          <span className="text-[#8b949e] text-xs">{activeTab === "socials" ? "▼" : "▶"}</span>
        </button>

        {activeTab === "socials" && (
          <div className="p-4 border-t border-[#30363d] bg-[#0d1117] flex flex-col gap-3 text-xs">
            <div>
              <label className="text-[#8b949e] font-medium mb-1 block">GitHub Username (Crucial)</label>
              <input
                type="text"
                placeholder="e.g. joymoung"
                value={profile.socials.github || ""}
                onChange={(e) => updateProfile("socials", { ...profile.socials, github: e.target.value })}
                className="w-full rounded bg-[#0d1117] border border-[#30363d] px-3 py-2 text-[#c9d1d9] outline-none focus:border-[#58a6ff]"
              />
            </div>

            <div>
              <label className="text-[#8b949e] font-medium mb-1 block">LinkedIn slug</label>
              <input
                type="text"
                placeholder="e.g. jaw-ae-maung-joy"
                value={profile.socials.linkedin || ""}
                onChange={(e) => updateProfile("socials", { ...profile.socials, linkedin: e.target.value })}
                className="w-full rounded bg-[#0d1117] border border-[#30363d] px-3 py-2 text-[#c9d1d9] outline-none focus:border-[#58a6ff]"
              />
            </div>

            <div>
              <label className="text-[#8b949e] font-medium mb-1 block">Email Address</label>
              <input
                type="email"
                placeholder="e.g. joymoung@gmail.com"
                value={profile.socials.email || ""}
                onChange={(e) => updateProfile("socials", { ...profile.socials, email: e.target.value })}
                className="w-full rounded bg-[#0d1117] border border-[#30363d] px-3 py-2 text-[#c9d1d9] outline-none focus:border-[#58a6ff]"
              />
            </div>

            <div>
              <label className="text-[#8b949e] font-medium mb-1 block">Portfolio Website</label>
              <input
                type="text"
                placeholder="e.g. joymoung.dev"
                value={profile.socials.portfolio || ""}
                onChange={(e) => updateProfile("socials", { ...profile.socials, portfolio: e.target.value })}
                className="w-full rounded bg-[#0d1117] border border-[#30363d] px-3 py-2 text-[#c9d1d9] outline-none focus:border-[#58a6ff]"
              />
            </div>

            <div>
              <label className="text-[#8b949e] font-medium mb-1 block">Twitter/X handle</label>
              <input
                type="text"
                placeholder="e.g. joymoung_x"
                value={profile.socials.twitter || ""}
                onChange={(e) => updateProfile("socials", { ...profile.socials, twitter: e.target.value })}
                className="w-full rounded bg-[#0d1117] border border-[#30363d] px-3 py-2 text-[#c9d1d9] outline-none focus:border-[#58a6ff]"
              />
            </div>
          </div>
        )}
      </div>

      {/* 8. ALIGNMENT & RULES CONFIG */}
      <div className="rounded-lg border border-[#30363d] bg-[#161b22] overflow-hidden transition-all shadow-sm">
        <button
          onClick={() => toggleSection("layout")}
          className="w-full flex items-center justify-between p-4 text-left font-semibold text-[#c9d1d9] hover:bg-[#21262d] cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <User className="h-4 w-4 text-[#ff7b72]" />
            <span className="text-sm font-medium">Layout Alignment & Dividers</span>
          </div>
          <span className="text-[#8b949e] text-xs">{activeTab === "layout" ? "▼" : "▶"}</span>
        </button>

        {activeTab === "layout" && (
          <div className="p-4 border-t border-[#30363d] bg-[#0d1117] flex flex-col gap-3 text-xs">
            <div>
              <label className="text-[#8b949e] font-medium block mb-1">Global Alignment</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => updateLayout("alignment", "left")}
                  className={`px-3 py-2 rounded text-center border font-medium cursor-pointer ${
                    profile.layout.alignment === "left"
                      ? "bg-[#238636]/15 border-[#238636] text-[#7ee787] font-bold"
                      : "bg-[#0d1117] border-[#30363d] text-[#8b949e]"
                  }`}
                >
                  Left-Aligned
                </button>
                <button
                  onClick={() => updateLayout("alignment", "center")}
                  className={`px-3 py-2 rounded text-center border font-medium cursor-pointer ${
                    profile.layout.alignment === "center"
                      ? "bg-[#238636]/15 border-[#238636] text-[#7ee787] font-bold"
                      : "bg-[#0d1117] border-[#30363d] text-[#8b949e]"
                  }`}
                >
                  Centered
                </button>
              </div>
            </div>

            <div>
              <label className="text-[#8b949e] font-medium block mb-1">Section Divider Style</label>
              <select
                value={profile.layout.dividerStyle}
                onChange={(e) => updateLayout("dividerStyle", e.target.value)}
                className="w-full rounded bg-[#0d1117] border border-[#30363d] px-3 py-2 text-[#c9d1d9] outline-none font-mono text-[11px]"
              >
                <option value="line">Straight Horizontal Line (---)</option>
                <option value="classic">Classic Heavy Line (====)</option>
                <option value="dash">Dashed Spaced Line (- - -)</option>
                <option value="none">No Dividers (Clean Spacing)</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
