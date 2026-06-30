export interface EducationItem {
  id: string;
  degree: string;
  major: string;
  institution: string;
  period: string;
  cgpa?: string;
  achievements: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  period: string;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  link?: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  email?: string;
  portfolio?: string;
  twitter?: string;
  medium?: string;
  devto?: string;
}

export interface TechSkill {
  id: string;
  name: string;
  slug: string;
  color: string;
  category: "Languages" | "Databases" | "Frontend" | "Backend" | "Data Science & BI" | "Tools & Cloud";
}

export interface StatsConfig {
  showStats: boolean;
  showLanguages: boolean;
  showStreak: boolean;
  showTrophies: boolean;
  showActivityGraph: boolean;
  theme: string; // radical, dracula, github_dark, monokai, etc.
  layout: "stacked" | "grid";
}

export interface LayoutConfig {
  alignment: "left" | "center";
  themeStyle: "minimal-slate" | "cyberpunk" | "editorial" | "sunset";
  badgeStyle: "for-the-badge" | "flat-square" | "plastic" | "flat";
  showTypingEffect: boolean;
  typingTexts: string[];
  showVisitorCounter: boolean;
  showDailyQuote: boolean;
  customTitlePrefix: string;
  dividerStyle: "line" | "classic" | "dash" | "none";
}

export interface ProfileData {
  name: string;
  role: string;
  location: string;
  email: string;
  aboutMe: string;
  pronouns?: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  socials: SocialLinks;
  techStack: string[]; // List of TechSkill ids currently enabled
  stats: StatsConfig;
  layout: LayoutConfig;
}
