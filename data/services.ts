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
    title: "Website Development",
    description: "Responsive, fast & modern websites that convert visitors into customers.",
    icon: Code,
    technologies: ["HTML", "CSS", "JavaScript", "React", "Next.js", "Tailwind CSS"],
  },
  {
    id: "app-development",
    title: "App Development",
    description: "Scalable mobile apps for iOS & Android with smooth performance.",
    icon: Smartphone,
    technologies: ["React Native", "Flutter", "Swift", "Kotlin"],
  },
  {
    id: "business-automation",
    title: "Business Automation",
    description: "Workflow and process automation to save time and reduce errors.",
    icon: Cpu,
    technologies: ["Zapier", "Make", "Custom Scripts", "Python"],
  },
  {
    id: "whatsapp-automation",
    title: "WhatsApp Automation",
    description: "Automated customer communication and marketing flows.",
    icon: MessageSquare,
    technologies: ["WhatsApp Business API", "Twilio"],
  },
  {
    id: "chatbot-integration",
    title: "Chatbot Integration",
    description: "AI-powered conversational experiences for 24/7 support.",
    icon: Bot,
    technologies: ["Dialogflow", "OpenAI", "Custom NLP"],
  },
  {
    id: "final-year-projects",
    title: "Final Year Projects",
    description: "Software project development and guidance for students.",
    icon: GraduationCap,
    technologies: ["Various Frameworks", "Mentorship", "Documentation"],
  },
  {
    id: "seo",
    title: "SEO",
    description: "Search visibility and optimization. Rank higher, get found.",
    icon: Search,
    technologies: ["Technical SEO", "Content Strategy", "Analytics"],
  },
];
