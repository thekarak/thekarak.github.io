/** The small, honest version of the site. Facts come from ./projects. */

export interface WorkItem {
  name: string;
  note: string;
  href?: string;
  year?: string;
}

export interface Skill {
  name: string;
  icon?: string;
  note?: string;
}

export interface SiteData {
  name: string;
  firstName: string;
  handle: string;
  role: string;
  location: string;
  email: string;
  github: string;
  x: string;
  resume: string;
  avatar: string;
  siteUrl: string;
  tagline: string;
  status: string;
  lede: string | string[];
  now: string | string[];
  beliefs: string[];
  likes: string[];
  work: WorkItem[];
  skills: Skill[];
  careAbout: string[];
  contactLine: string;
}

export const site: SiteData = {
  name: "Sourasis Karak",
  firstName: "sourasis",
  handle: "@thekarak",
  role: "computer science undergraduate & builder",
  location: "Kolkata, India",
  email: "soykarak@gmail.com",
  github: "https://github.com/thekarak",
  x: "https://x.com/imskarak",
  resume: "/assets/resume.pdf",
  avatar: "/assets/avatar.jpg",
  siteUrl: "https://thekarak.github.io",
  tagline: "Build it. Question it. Make it worth trusting.",
  status: "open to internships and research collaborations.",
  lede: [
    "i'm a computer science student in kolkata, poking at machine learning systems and scientific agents.",
    "mostly i'm wondering: can we trust what they tell us?",
  ],
  now: [
    "i'm thinking about verification-first agents — the model proposes the work, deterministic tools do the science, and an evidence trail connects the two.",
    "alongside that i care about evaluation that actually measures something, and about small tools that make complicated ideas easier to see.",
  ],
  beliefs: [
    "open-weight models will be the best one day.",
    "learning has no age.",
    "the model proposes; deterministic tools do the science.",
    "if you can't reproduce it, you haven't measured it.",
    "leave the error bars visible.",
  ],
  likes: [
    "cycling",
    "challenging work (not reckless ones)",
    "smile",
    "clear diagrams",
    "honesty",
  ],
  work: [
    {
      name: "BioAgent-ST",
      note: "a verification-first agent for spatial transcriptomics — the model plans, deterministic tools run the science",
      href: "https://github.com/thekarak/Bioagent-ST",
    },
    {
      name: "TruthScope",
      note: "an evidence-first RAG explorer that breaks answers into claims and checks their support",
      href: "https://github.com/thekarak/Reducing-LLM-Hallucinations",
    },
    {
      name: "TokenLab",
      note: "see how language models read text — tokens, ids, and cost estimates, right in the browser",
      href: "https://tokenlabx.vercel.app",
    },
    {
      name: "VARUNA",
      note: "satellite radar for oil-spill detection, visual explanations, and vessel trajectories",
      href: "https://varuna-sih.vercel.app/",
    },
    {
      name: "WineLens",
      note: "chemical measurements to wine-quality estimates, with the prediction errors left visible",
      href: "https://github.com/thekarak/Winelens",
    },
  ],
  skills: [
    { name: "Python", icon: "python" },
    { name: "JavaScript", icon: "javascript" },
    { name: "TypeScript", icon: "typescript" },
    { name: "JSON prompting", note: "prompt craft" },
    { name: "SQL" },
    { name: "C", icon: "c" },
    { name: "PyTorch", icon: "pytorch", note: "beginner" },
    { name: "scikit-learn", icon: "scikitlearn" },
    { name: "NumPy", icon: "numpy" },
    { name: "pandas", icon: "pandas" },
    { name: "FastAPI", icon: "fastapi" },
    { name: "Next.js", icon: "nextdotjs" },
    { name: "SQLite", icon: "sqlite" },
    { name: "Streamlit", icon: "streamlit" },
  ],
  careAbout: [
    "Robust validation",
    "reproducibility",
    "provenance",
    "clear interfaces",
  ],
  contactLine:
    "good work starts with a conversation. if you have a research question, an internship, or something worth building together, i'd like to hear about it.",
};
