/** Portfolio content, curated from the existing site and linked project documentation. */
export type ProjectCategory = "Agents & LLMs" | "Applied ML" | "Tools";

export interface Project {
  id: string;
  number: string;
  name: string;
  category: ProjectCategory;
  description: string;
  stack: string[];
  method: string;
  limitation?: string;
  source: string;
  demo?: string;
  featured?: boolean;
}

export const profile = {
  name: "Sourasis Karak",
  email: "soykarak@gmail.com",
  github: "https://github.com/thekarak",
  location: "Kolkata, India",
  role: "Computer science undergraduate & builder",
  subline: "Machine learning & data and scientific systems.",
  tagline: "Build it. Question it. Make it worth trusting.",
  description:
    "I build machine learning systems with a simple question in mind: can we trust what they tell us? Studying at JIS College of Engineering. Exploring scientific agents, meaningful evaluation, and tools that make complex ideas easier to understand.",
  introduction:
    "I’m a computer science undergraduate at JIS College of Engineering in Kolkata. I’m interested in scientific agents, meaningful evaluation, and tools that make complex ideas easier to understand.",
  perspective:
    "My projects move between machine learning, scientific workflows, and small tools for working with language models. The question behind them stays the same:",
  status: "Open to internships & research collaborations.",
  resume: "/assets/resume.pdf",
  avatar: "/assets/avatar.jpg",
  siteUrl: "https://soykarak.vercel.app",
};

export const projects: Project[] = [
  {
    id: "bioagent",
    number: "01",
    name: "BioAgent-ST",
    category: "Agents & LLMs",
    description:
      "A verification-first agent for spatial transcriptomics. The model plans the work; deterministic tools run the science.",
    stack: ["Python", "Scanpy", "FastAPI", "Next.js", "SQLite"],
    method:
      "Co-created with Sourav Sarkar. Typed workflow plans separate the language model from scientific calculations. Policy gates validate execution; a SQLite ledger and SHA-256 hashes preserve the evidence trail.",
    source: "https://github.com/thekarak/Bioagent-ST",
    featured: true,
  },
  {
    id: "winelens",
    number: "02",
    name: "WineLens",
    category: "Applied ML",
    description:
      "From chemical measurements to wine-quality estimates. Model comparisons, exploratory analysis, and a closer look at prediction errors.",
    stack: ["scikit-learn", "pandas", "Random forests", "Streamlit"],
    method:
      "Compares regression and classification on the UCI wine-quality data, with an interactive Streamlit app for 11 chemical measurements.",
    limitation:
      "Repeated use of the test split means the reported results are exploratory, not an independent estimate of generalisation.",
    source: "https://github.com/thekarak/Winelens",
  },
  {
    id: "truthscope",
    number: "03",
    name: "TruthScope",
    category: "Agents & LLMs",
    description:
      "An evidence-first RAG explorer that breaks answers into claims, checks their support, and makes source evidence visible.",
    stack: ["Python", "Retrieval", "Claim verification", "Streamlit"],
    method:
      "A student exploration of answer verification, with a claim inspector, evidence viewer, and side-by-side system comparison.",
    limitation:
      "The committed benchmark uses a deterministic local simulator. It demonstrates the pipeline rather than establishing real-world LLM performance. Claim support is checked heuristically against the indexed corpus.",
    source: "https://github.com/thekarak/Reducing-LLM-Hallucinations",
  },
  {
    id: "tokenlab",
    number: "04",
    name: "TokenLab",
    category: "Tools",
    description:
      "A small lab for seeing how language models read text. Inspect tokens, decode IDs, and compare estimated API costs in the browser.",
    stack: ["JavaScript", "Byte-pair encoding", "tiktoken parity"],
    method:
      "Implements byte-level BPE for four OpenAI encodings, checked against tiktoken. No backend or API keys required.",
    limitation:
      "Other model families are labelled as approximations. The pricing table is a September 2026 snapshot.",
    source: "https://github.com/thekarak/Tokenlab",
    demo: "https://tokenlabx.vercel.app",
  },
  {
    id: "varuna",
    number: "05",
    name: "VARUNA",
    category: "Applied ML",
    description:
      "Maritime intelligence from satellite radar: oil-spill detection, visual explanations, and vessel-trajectory analysis.",
    stack: ["Python", "CNN", "Sentinel-1 SAR", "Grad-CAM"],
    method:
      "Built with Team CODE_FORUN for Smart India Hackathon 2026. A compact CNN classifies Sentinel-1 SAR scenes, with Grad-CAM to inspect predictions. The platform brings together slick segmentation, drift hindcasting, and AIS trajectory correlation in a geographic interface.",
    source: "https://github.com/thekarak/VARUNA",
    demo: "https://varuna-sih.vercel.app/",
  },
  {
    id: "roastme",
    number: "06",
    name: "RoastMeBuddy",
    category: "Tools",
    description:
      "Structured feedback on technical CVs. A shipped résumé-review app with predictable output and streaming responses.",
    stack: ["JavaScript", "LLM APIs", "JSON Schema", "Vercel"],
    method:
      "Strict JSON schemas keep the response structure predictable, deterministic scoring makes feedback easier to compare, and streaming APIs deliver it progressively. Deployed on Vercel.",
    source: "https://github.com/thekarak/RoastMeBuddy",
    demo: "https://roastmebuddy.vercel.app/",
  },
];

export const principles = [
  {
    title: "Make failure visible",
    description:
      "Inspect individual claims and prediction errors. A single score rarely tells the whole story.",
    projectId: "truthscope",
  },
  {
    title: "Keep the evidence",
    description:
      "Trace a result to the data, tools, and steps that produced it. Reproducibility belongs in the design.",
    projectId: "bioagent",
  },
  {
    title: "Check the details",
    description:
      "Test the implementation against a reference. Small assumptions can change the entire output.",
    projectId: "tokenlab",
  },
];

// These links open repository documentation, not standalone published articles.
export const notes = [
  {
    title: "Strict JSON schemas for LLM output",
    description: "Shipping",
    href: "https://github.com/thekarak/RoastMeBuddy",
  },
  {
    title: "Keeping scientific claims attached to evidence",
    description: "Agent systems",
    href: "https://github.com/thekarak/Bioagent-ST#what-is-bioagent-st",
  },
  {
    title: "What building a tokenizer actually teaches you",
    description: "Tokenization",
    href: "https://github.com/thekarak/Tokenlab#what-i-learnt",
  },
];

export const skills = [
  { label: "Languages", items: ["Python", "SQL", "JavaScript", "C"] },
  {
    label: "Machine learning",
    items: ["PyTorch", "scikit-learn", "NumPy", "pandas"],
  },
  {
    label: "Systems & interfaces",
    items: ["FastAPI", "Next.js", "SQLite", "Streamlit"],
  },
  {
    label: "Practice",
    items: ["Validation", "Reproducibility", "Provenance", "Clear interfaces"],
  },
];

export const pipeline = [
  {
    number: "01",
    title: "Plan",
    description:
      "The language model proposes a typed workflow, separating scientific intent from execution.",
  },
  {
    number: "02",
    title: "Execute",
    description:
      "Deterministic tools run the scientific calculations. The model does not improvise the results.",
  },
  {
    number: "03",
    title: "Verify",
    description:
      "Policy gates check the run. Missing required evidence stops the pipeline before it presents an unsupported result.",
  },
  {
    number: "04",
    title: "Record",
    description:
      "A SQLite ledger and SHA-256 hashes connect outputs to their inputs and preserve the evidence trail.",
  },
];

/** Short editorial captions for the interactive conceptual hero diagram. */
export const specimenStages = [
  "First, ask a better question.",
  "Let the tools do the science.",
  "Trust is a requirement, not a feeling.",
  "A result is only the beginning of its record.",
];
