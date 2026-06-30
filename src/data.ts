import { TechSkill, ProfileData } from "./types";

export const PRESET_SKILLS: TechSkill[] = [
  // Languages
  { id: "python", name: "Python", slug: "python", color: "3776AB", category: "Languages" },
  { id: "sql", name: "SQL", slug: "postgresql", color: "4169E1", category: "Languages" }, // PostgreSQL badge is good for general SQL
  { id: "javascript", name: "JavaScript", slug: "javascript", color: "F7DF1E", category: "Languages" },
  { id: "typescript", name: "TypeScript", slug: "typescript", color: "3178C6", category: "Languages" },
  { id: "html5", name: "HTML5", slug: "html5", color: "E34F26", category: "Languages" },
  { id: "css3", name: "CSS3", slug: "css3", color: "1572B6", category: "Languages" },
  { id: "r_lang", name: "R Language", slug: "r", color: "276DC3", category: "Languages" },
  { id: "cpp", name: "C++", slug: "cplusplus", color: "00599C", category: "Languages" },
  
  // Data Science & BI
  { id: "powerbi", name: "Power BI", slug: "powerbi", color: "F2C811", category: "Data Science & BI" },
  { id: "numpy", name: "NumPy", slug: "numpy", color: "013243", category: "Data Science & BI" },
  { id: "pandas", name: "Pandas", slug: "pandas", color: "150458", category: "Data Science & BI" },
  { id: "scikit_learn", name: "Scikit-Learn", slug: "scikitlearn", color: "F7931E", category: "Data Science & BI" },
  { id: "tensorflow", name: "TensorFlow", slug: "tensorflow", color: "FF6F00", category: "Data Science & BI" },
  { id: "pytorch", name: "PyTorch", slug: "pytorch", color: "EE4C2C", category: "Data Science & BI" },
  { id: "jupyter", name: "Jupyter Notebook", slug: "jupyter", color: "F37626", category: "Data Science & BI" },
  { id: "tableau", name: "Tableau", slug: "tableau", color: "E12426", category: "Data Science & BI" },
  { id: "matplotlib", name: "Matplotlib", slug: "plotly", color: "3F4F75", category: "Data Science & BI" }, // Plotly slug is solid
  { id: "xgboost", name: "XGBoost", slug: "xgboost", color: "111111", category: "Data Science & BI" },
  { id: "lightgbm", name: "LightGBM", slug: "lightgbm", color: "115293", category: "Data Science & BI" },
  { id: "catboost", name: "CatBoost", slug: "catboost", color: "F6E22F", category: "Data Science & BI" },
  { id: "optuna", name: "Optuna", slug: "optuna", color: "004165", category: "Data Science & BI" },
  { id: "shap", name: "SHAP", slug: "shap", color: "000000", category: "Data Science & BI" },
  { id: "keras", name: "Keras", slug: "keras", color: "D00000", category: "Data Science & BI" },
  { id: "seaborn", name: "Seaborn", slug: "python", color: "3776AB", category: "Data Science & BI" },
  
  // Backend & APIs
  { id: "fastapi", name: "FastAPI", slug: "fastapi", color: "009688", category: "Backend" },
  { id: "flask", name: "Flask", slug: "flask", color: "000000", category: "Backend" },
  { id: "django", name: "Django", slug: "django", color: "092E20", category: "Backend" },
  { id: "nodejs", name: "Node.js", slug: "nodedotjs", color: "5FA04E", category: "Backend" },
  { id: "express", name: "Express.js", slug: "express", color: "000000", category: "Backend" },
  { id: "graphql", name: "GraphQL", slug: "graphql", color: "E10098", category: "Backend" },
  
  // Databases
  { id: "postgresql", name: "PostgreSQL", slug: "postgresql", color: "4169E1", category: "Databases" },
  { id: "mysql", name: "MySQL", slug: "mysql", color: "4479A1", category: "Databases" },
  { id: "sqlite", name: "SQLite", slug: "sqlite", color: "003B57", category: "Databases" },
  { id: "mongodb", name: "MongoDB", slug: "mongodb", color: "47A248", category: "Databases" },
  { id: "redis", name: "Redis", slug: "redis", color: "DC382D", category: "Databases" },
  
  // Frontend
  { id: "react", name: "React", slug: "react", color: "61DAFB", category: "Frontend" },
  { id: "nextjs", name: "Next.js", slug: "nextdotjs", color: "000000", category: "Frontend" },
  { id: "tailwind", name: "Tailwind CSS", slug: "tailwindcss", color: "06B6D4", category: "Frontend" },
  { id: "redux", name: "Redux", slug: "redux", color: "764ABC", category: "Frontend" },
  { id: "sass", name: "Sass", slug: "sass", color: "CC6699", category: "Frontend" },
  
  // Tools & Cloud
  { id: "git", name: "Git", slug: "git", color: "F05032", category: "Tools & Cloud" },
  { id: "github", name: "GitHub", slug: "github", color: "181717", category: "Tools & Cloud" },
  { id: "docker", name: "Docker", slug: "docker", color: "2496ED", category: "Tools & Cloud" },
  { id: "aws", name: "AWS", slug: "amazonwebservices", color: "232F3E", category: "Tools & Cloud" },
  { id: "linux", name: "Linux", slug: "linux", color: "FCC624", category: "Tools & Cloud" },
  { id: "postman", name: "Postman", slug: "postman", color: "FF6C37", category: "Tools & Cloud" },
  { id: "selenium", name: "Selenium (QA)", slug: "selenium", color: "43B02A", category: "Tools & Cloud" },
  { id: "fivem", name: "FiveM/Lua", slug: "lua", color: "00007C", category: "Tools & Cloud" }, // Uses Lua badge as representative
  { id: "latex", name: "LaTeX", slug: "latex", color: "008080", category: "Tools & Cloud" },
];

export const INITIAL_PROFILE_DATA: ProfileData = {
  name: "JAW AE MAUNG (JOY)",
  role: "Data Scientist | Software Engineer | Business Intelligence Specialist",
  location: "Dhaka, Bangladesh",
  email: "joymoung@gmail.com",
  pronouns: "He/Him",
  aboutMe: "Data-driven Software Engineer with an M.Sc. in Data Science and a proven track record of architecting business intelligence pipelines. Expert in Python, predictive modeling, and API development, with hands-on experience translating raw analytics into scalable system architectures. Highly adept at designing modular data processing scripts and interactive dashboards that optimize operational workflows and directly drive business scaling.",
  education: [
    {
      id: "edu-1",
      degree: "M.Sc. in Software Engineering",
      major: "Data Science",
      institution: "Daffodil International University",
      period: "Nov 2025",
      cgpa: "3.39 / 4.00",
      achievements: [
        "Secured an outstanding A+ (4.00) in both Applied Machine Learning and the final 18-credit Data Science Thesis."
      ]
    },
    {
      id: "edu-2",
      degree: "B.Sc. in Software Engineering",
      major: "General Software Design & Patterns",
      institution: "Daffodil International University",
      period: "Feb 2024",
      cgpa: "2.55 / 4.00",
      achievements: [
        "Completed 145 credits with a comprehensive grounding in programming design patterns, algorithmic calculation paradigms, and robust system lifecycles."
      ]
    },
    {
      id: "edu-3",
      degree: "Higher Secondary Certificate (HSC)",
      major: "Science",
      institution: "Winsome College (Dhaka Board)",
      period: "Aug 2014",
      cgpa: "4.70 / 5.00",
      achievements: []
    },
    {
      id: "edu-4",
      degree: "Secondary School Certificate (SSC)",
      major: "Science",
      institution: "Motijheel Model High School (Dhaka Board)",
      period: "May 2012",
      cgpa: "4.63 / 5.00",
      achievements: []
    }
  ],
  experience: [
    {
      id: "exp-1",
      company: "Gari-import.com.bd",
      role: "Data & Operations Manager (Sales & Marketing)",
      location: "Dhaka, Bangladesh",
      period: "Aug 2024 – Present",
      bullets: [
        "Designed and deployed modular Power BI architectures and Python processing scripts to convert dynamic market data points into interactive, real-time business insights.",
        "Engineered the technical automation and operational systems that supported a digital scaling strategy, successfully handling an audience footprint of over 200,000 corporate followers.",
        "Act as the technical bridge for internal operations, optimizing marketing execution through data-backed analytics and system automations."
      ]
    }
  ],
  projects: [
    {
      id: "proj-thesis",
      title: "Automobile Price Forecasting with Machine Learning (M.Sc. Thesis)",
      description: "A high-performance Random Forest benchmark study on the UCI Dataset incorporating Scikit-Learn Pipelines, Optuna Bayesian HPO, and SHAP Explainable AI (XAI).",
      bullets: [
        "**Pipeline Data Engineering**: Architected an end-to-end preprocessing workflow using Scikit-Learn ColumnTransformer pipelines; handled missing value imputation and implemented logarithmic transformations to normalize highly skewed vehicle price distributions.",
        "**Advanced Feature Engineering**: Formulated domain-specific features—such as Power-to-Weight Ratio, Engine Volume Proxy, Inverse MPG, and polynomial interaction terms—to capture non-linear physical/economic constraints.",
        "**Bayesian HPO (Optuna)**: Executed systematic hyperparameter optimization with the Optuna framework (50 cross-validated trials), achieving a **7.4% reduction in MSE** and a **4.6% reduction in MAE** over default model baselines.",
        "**Multi-Model Benchmarking**: Spearheaded head-to-head empirical evaluations of 6 algorithms (Linear Regression, Random Forest, XGBoost, CatBoost, LightGBM, and a TensorFlow/Keras MLP Neural Network) on a strictly isolated 20% hold-out test partition.",
        "**Theoretical & Empirical Validation**: Demonstrated that for small, heterogeneous tabular datasets (N=205), variance-reducing Bagging (Random Forest, achieving R²=0.925 and MAE=$1,120) significantly outperforms sequentially bias-reducing Boosting methods and data-hungry Deep Learning architectures.",
        "**Explainable AI (SHAP)**: Integrated game-theoretic Cooperative Game Theory concepts using SHAP Kernel & Tree explainers, generating global feature rankings (proving engine size and horsepower as dominant pricing factors) and individual force plots to mathematically justify automated vehicle valuations."
      ]
    },
    {
      id: "proj-1",
      title: "Business Intelligence Automotive Dashboards",
      description: "Custom Python pipeline connected to Power BI data streams.",
      bullets: [
        "Built comprehensive Power BI dashboards leveraging Python data pipelines to translate complex automotive import metrics into actionable revenue intelligence."
      ]
    },
    {
      id: "proj-2",
      title: "Custom FiveM Dedicated Server Architecture",
      description: "Systems Engineer & Game Server Developer.",
      bullets: [
        "Founded, developed, and managed a dedicated highly scalable game server environment.",
        "Maintained active performance analytics parameters, backend database scripts, and strict security protocols."
      ]
    }
  ],
  socials: {
    github: "joymoung", // Placeholders derived from email/name
    linkedin: "jaw-ae-maung-861b06159",
    email: "joymoung@gmail.com",
    portfolio: "joymoung.dev",
  },
  techStack: ["python", "sql", "powerbi", "pandas", "numpy", "scikit_learn", "tensorflow", "keras", "xgboost", "lightgbm", "catboost", "optuna", "shap", "matplotlib", "seaborn", "fastapi", "postgresql", "git", "github", "latex", "selenium", "fivem"],
  stats: {
    showStats: true,
    showLanguages: true,
    showStreak: true,
    showTrophies: false,
    showActivityGraph: true,
    theme: "radical",
    layout: "grid"
  },
  layout: {
    alignment: "left",
    themeStyle: "minimal-slate",
    badgeStyle: "for-the-badge",
    showTypingEffect: true,
    typingTexts: [
      "Data Scientist 📊",
      "Software Engineer 💻",
      "BI Architect 📈",
      "Machine Learning practitioner 🤖"
    ],
    showVisitorCounter: true,
    showDailyQuote: false,
    customTitlePrefix: "Hey there! I'm",
    dividerStyle: "line"
  }
};
