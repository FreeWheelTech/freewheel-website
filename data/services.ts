import {
  Code,
  Smartphone,
  Cpu,
  MessageSquare,
  Bot,
  GraduationCap,
  Search,
  type LucideIcon,
} from "lucide-react";

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  technologies: string[];
}

export const services: Service[] = [
  {
    id: "web-development",
    title: "Web App & SaaS Development",
    description: "High-performance web applications, client portals, and SaaS dashboards built with Next.js, TypeScript, and scalable cloud databases.",
    icon: Code,
    technologies: ["Next.js", "React", "TypeScript", "PostgreSQL", "Tailwind CSS"],
  },
  {
    id: "app-development",
    title: "Mobile App Development",
    description: "Cross-platform mobile applications for iOS & Android with smooth native performance, offline support, and secure auth.",
    icon: Smartphone,
    technologies: ["React Native", "Flutter", "iOS", "Android", "Firebase"],
  },
  {
    id: "business-automation",
    title: "Business & Workflow Automation",
    description: "Custom automated pipelines and webhook connectors that eliminate manual data entry across your CRMs, billing, and databases.",
    icon: Cpu,
    technologies: ["Python", "FastAPI", "Webhooks", "Make", "PostgreSQL"],
  },
  {
    id: "whatsapp-automation",
    title: "WhatsApp Cloud API Solutions",
    description: "Automated customer inquiry handling, interactive catalog flows, and real-time order notifications powered by official WhatsApp APIs.",
    icon: MessageSquare,
    technologies: ["WhatsApp Business API", "Node.js", "Redis", "Cloud Functions"],
  },
  {
    id: "chatbot-integration",
    title: "AI Chatbots & Virtual Assistants",
    description: "Intelligent conversational agents trained on your business knowledge base for 24/7 customer support and automated qualification.",
    icon: Bot,
    technologies: ["OpenAI API", "LangChain", "Vector DBs", "Next.js"],
  },
  {
    id: "final-year-projects",
    title: "Final Year Software Projects",
    description: "End-to-end software project development, architectural diagrams, clean modular codebases, and guidance for engineering students.",
    icon: GraduationCap,
    technologies: ["Full-Stack", "AI/ML", "Cloud Systems", "Documentation"],
  },
  {
    id: "seo",
    title: "Technical SEO & Speed Tuning",
    description: "Sub-second Core Web Vitals optimization, server-side rendering, dynamic schema markup, and top search ranking architecture.",
    icon: Search,
    technologies: ["Core Web Vitals", "Dynamic SSR", "Schema.org", "Analytics"],
  },
];
