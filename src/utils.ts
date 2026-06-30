import { ProfileData, TechSkill } from "./types";
import { PRESET_SKILLS } from "./data";

export function generateMarkdown(profile: ProfileData): string {
  const { name, role, location, email, aboutMe, pronouns, socials, techStack, stats, layout } = profile;
  const { alignment, showTypingEffect, typingTexts, showVisitorCounter, showDailyQuote, customTitlePrefix, dividerStyle } = layout;

  const alignTag = alignment === "center" ? ' align="center"' : "";
  const divAlign = alignment === "center" ? "center" : "left";

  let md = "";

  // 1. HEADER SECTION
  if (alignment === "center") {
    md += `<div align="center">\n\n`;
  }

  // Name Greeting
  md += `# ${customTitlePrefix || "Hey there! I'm"} **${name}** ${pronouns ? `_(${pronouns})_` : ""}\n\n`;

  // Role & Location Subtitle
  md += `### 🚀 ${role}\n`;
  md += `📍 Based in **${location}**\n\n`;

  // Visitor Counter
  if (showVisitorCounter && socials.github) {
    md += `![Visitor Count](https://komarev.com/ghvc/?username=${socials.github}&color=3178C6&style=flat-square&label=PROFILE+VIEWS) \n\n`;
  }

  // Typing SVG effect
  if (showTypingEffect && typingTexts && typingTexts.length > 0) {
    const encodedLines = typingTexts
      .map((t) => encodeURIComponent(t))
      .join(";");
    const themeColor = layout.themeStyle === "minimal-slate" ? "334155" : layout.themeStyle === "cyberpunk" ? "00F0FF" : "EE4C2C";
    const typingUrl = `https://readme-typing-svg.demolab.com?font=Inter&weight=600&size=20&duration=3000&pause=1000&color=${themeColor}&center=${alignment === "center" ? "true" : "false"}&width=500&lines=${encodedLines}`;
    md += `<img src="${typingUrl}" alt="Typing Effect" />\n\n`;
  }

  if (alignment === "center") {
    md += `</div>\n\n`;
  }

  // Divider
  md += getDividerMarkdown(dividerStyle);

  // 2. ABOUT ME
  md += `## 👤 About Me\n\n`;
  if (aboutMe) {
    md += `> ${aboutMe.replace(/\n/g, "\n> ")}\n\n`;
  }

  // Daily Quote (Sleek GitHub addition)
  if (showDailyQuote) {
    md += `_✨ "The best way to predict the future is to invent it." - Alan Kay_ \n\n`;
  }

  md += getDividerMarkdown(dividerStyle);

  // 3. TECH STACK (BADGES)
  md += `## 🛠️ Tech Stack & Competencies\n\n`;
  if (alignment === "center") {
    md += `<div align="center">\n\n`;
  }

  // Map chosen badge ids to tech skills
  const activeSkills = PRESET_SKILLS.filter((s) => techStack.includes(s.id));
  
  // Categorize selected skills
  const categories: ("Languages" | "Databases" | "Frontend" | "Backend" | "Data Science & BI" | "Tools & Cloud")[] = [
    "Languages",
    "Data Science & BI",
    "Backend",
    "Databases",
    "Frontend",
    "Tools & Cloud"
  ];

  categories.forEach((cat) => {
    const catSkills = activeSkills.filter((s) => s.category === cat);
    if (catSkills.length > 0) {
      md += `**${cat}**\n\n`;
      catSkills.forEach((skill) => {
        const badgeUrl = `https://img.shields.io/badge/${encodeURIComponent(skill.name)}-${skill.color}?style=${layout.badgeStyle}&logo=${skill.slug}&logoColor=white`;
        md += `![${skill.name}](${badgeUrl}) `;
      });
      md += `\n\n`;
    }
  });

  if (alignment === "center") {
    md += `</div>\n\n`;
  }

  // Core Methodologies & Advanced Competencies Table
  md += `### 🧠 Core Methodologies & Advanced Competencies\n\n`;
  md += `| Domain | Demonstrated Capabilities & Methodologies |\n`;
  md += `| :--- | :--- |\n`;
  md += `| **Machine Learning & Deep Learning** | • **Ensemble Paradigms**: Bagging (Random Forest) vs. Boosting (XGBoost, CatBoost, LightGBM) bias-variance trade-offs.<br>• **Deep Learning for Tabular Data**: Regularization (Dropout, weight decay) & evaluation of Feedforward Neural Networks (MLPs) using TensorFlow/Keras.<br>• **Hyperparameter Tuning**: Optuna (Bayesian search), GridSearchCV, and k-Fold/RepeatedKFold validation. |\n`;
  md += `| **Data Science & Engineering Pipeline** | • **Data Wrangling & Cleaning**: Manipulation of heterogeneous data streams, missing value imputation, & outlier treatment.<br>• **Feature Transformation**: Target stabilization (Log transforms, exponential back-transforms), mathematical scaling, and encoding.<br>• **Pipeline Architecture**: Leakage-free preprocessing pipelines using Scikit-Learn \`Pipeline\` & \`ColumnTransformer\`. |\n`;
  md += `| **Explainable AI (XAI) & Ethics** | • **Game-Theoretic Interpretability**: Dissecting complex black-box models using Cooperative Game Theory concepts (SHAP Shapley values).<br>• **Visual Transparency**: Auditing model predictions with SHAP beeswarm summary plots, dependency plots, & local force plots. |\n`;
  md += `| **Data Storytelling & Visualization** | • **Interactive Web Dashboards**: Designing and building fully responsive technical infographics using Tailwind CSS & Chart.js/Power BI.<br>• **Data Storytelling**: Translating high-dimensional architectural concepts (spatial transforms, residual attention, convergence) into dynamic visual aids. |\n`;
  md += `| **Research & Academic Writing** | • **CRISP-DM Execution**: Systematic implementation of the industry-standard data mining process model across research stages.<br>• **IEEE Formatting**: Structuring academic literature reviews, methodological formulations, and peer-reviewed style bibliography references. |\n\n`;

  md += getDividerMarkdown(dividerStyle);

  // 4. EXPERIENCE SECTION
  if (profile.experience.length > 0) {
    md += `## 💼 Professional Experience\n\n`;
    profile.experience.forEach((exp) => {
      md += `### **${exp.role}** | **${exp.company}**\n`;
      md += `_${exp.period} | ${exp.location}_\n\n`;
      exp.bullets.forEach((bullet) => {
        md += `- ${bullet}\n`;
      });
      md += `\n`;
    });
    md += getDividerMarkdown(dividerStyle);
  }

  // 5. PROJECTS SECTION
  if (profile.projects.length > 0) {
    md += `## 🚀 Projects & Initiatives\n\n`;
    profile.projects.forEach((proj) => {
      md += `### **${proj.title}**\n`;
      if (proj.description) {
        md += `_${proj.description}_\n\n`;
      }
      proj.bullets.forEach((bullet) => {
        md += `- ${bullet}\n`;
      });
      md += `\n`;
    });
    md += getDividerMarkdown(dividerStyle);
  }

  // 6. EDUCATION SECTION
  if (profile.education.length > 0) {
    md += `## 🎓 Education & Academic Milestones\n\n`;
    profile.education.forEach((edu) => {
      md += `### **${edu.degree}** (${edu.major})\n`;
      md += `**${edu.institution}** | _${edu.period}_ \n`;
      if (edu.cgpa) {
        md += `- **CGPA**: \`${edu.cgpa}\` \n`;
      }
      edu.achievements.forEach((ach) => {
        md += `- ${ach}\n`;
      });
      md += `\n`;
    });
    md += getDividerMarkdown(dividerStyle);
  }

  // 7. GITHUB STATS CARDS
  if (stats.showStats || stats.showLanguages || stats.showStreak || stats.showTrophies || stats.showActivityGraph) {
    md += `## 📊 GitHub Analytics & Insights\n\n`;
    
    const ghUser = socials.github || "joymoung";
    const statTheme = stats.theme || "radical";
    
    if (alignment === "center") {
      md += `<div align="center">\n\n`;
    } else {
      md += `<p align="left">\n`;
    }

    if (stats.layout === "grid") {
      // Grid style layout: Cards positioned elegantly side-by-side
      if (stats.showStats) {
        md += `  <a href="https://github.com/${ghUser}">\n    <img src="https://github-readme-stats.vercel.app/api?username=${ghUser}&show_icons=true&theme=${statTheme}&count_private=true" alt="${ghUser}'s GitHub stats" height="180" />\n  </a>\n`;
      }
      if (stats.showLanguages) {
        md += `  <a href="https://github.com/${ghUser}">\n    <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${ghUser}&layout=compact&theme=${statTheme}&langs_count=8" alt="Top Languages" height="180" />\n  </a>\n`;
      }
      if (stats.showStreak) {
        md += `  <a href="https://github.com/${ghUser}">\n    <img src="https://github-readme-streak-stats.herokuapp.com/?user=${ghUser}&theme=${statTheme}" alt="GitHub Streak" height="180" />\n  </a>\n`;
      }
      if (stats.showActivityGraph) {
        md += `  <a href="https://github.com/${ghUser}">\n    <img src="https://github-readme-activity-graph.vercel.app/graph?username=${ghUser}&theme=${statTheme}" alt="Activity Graph" height="180" />\n  </a>\n`;
      }
    } else {
      // Stacked list style
      if (stats.showStats) {
        md += `  [![${ghUser}'s GitHub stats](https://github-readme-stats.vercel.app/api?username=${ghUser}&show_icons=true&theme=${statTheme}&count_private=true)](https://github.com/${ghUser})\n\n`;
      }
      if (stats.showLanguages) {
        md += `  [![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${ghUser}&layout=compact&theme=${statTheme}&langs_count=8)](https://github.com/${ghUser})\n\n`;
      }
      if (stats.showStreak) {
        md += `  [![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=${ghUser}&theme=${statTheme})](https://github.com/${ghUser})\n\n`;
      }
      if (stats.showActivityGraph) {
        md += `  [![Activity Graph](https://github-readme-activity-graph.vercel.app/graph?username=${ghUser}&theme=${statTheme})](https://github.com/${ghUser})\n\n`;
      }
    }

    if (stats.showTrophies) {
      md += `  [![GitHub Trophies](https://github-profile-trophy.vercel.app/?username=${ghUser}&theme=flat)](https://github.com/${ghUser})\n\n`;
    }

    if (alignment === "center") {
      md += `</div>\n\n`;
    } else {
      md += `</p>\n\n`;
    }

    md += getDividerMarkdown(dividerStyle);
  }

  // 8. CONNECT WITH ME (SOCIALS)
  md += `## 🤝 Connect with Me\n\n`;
  if (alignment === "center") {
    md += `<p align="center">\n`;
  } else {
    md += `<p align="left">\n`;
  }

  // LinkedIn
  if (socials.linkedin) {
    md += `  <a href="https://linkedin.com/in/${socials.linkedin}">\n    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />\n  </a>\n`;
  }
  // GitHub
  if (socials.github) {
    md += `  <a href="https://github.com/${socials.github}">\n    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />\n  </a>\n`;
  }
  // Email
  if (socials.email) {
    md += `  <a href="mailto:${socials.email}">\n    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />\n  </a>\n`;
  }
  // Portfolio
  if (socials.portfolio) {
    md += `  <a href="https://${socials.portfolio}">\n    <img src="https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Portfolio" />\n  </a>\n`;
  }
  // Twitter / X
  if (socials.twitter) {
    md += `  <a href="https://twitter.com/${socials.twitter}">\n    <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter" />\n  </a>\n`;
  }

  if (alignment === "center") {
    md += `</p>\n\n`;
  } else {
    md += `</p>\n\n`;
  }

  return md.trim() + "\n";
}

function getDividerMarkdown(style: string): string {
  switch (style) {
    case "line":
      return "---\n\n";
    case "classic":
      return "======================================================================\n\n";
    case "dash":
      return "- - -\n\n";
    case "none":
    default:
      return "\n";
  }
}
