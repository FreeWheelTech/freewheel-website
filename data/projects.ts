export type ProjectCategory = "Websites" | "Apps" | "Automation" | "UI/UX";

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  technologies: string[];
  image: string;
  link: string;
}

export const categories: ProjectCategory[] = ["Websites", "Apps", "Automation", "UI/UX"];

export const projects: Project[] = [
  {
    id: "p1",
    title: "Multi-Tenant Cloud ERP & Billing Portal",
    category: "Websites",
    description: "A high-performance enterprise management dashboard with automated invoice generation, role-based access control, and real-time inventory tracking.",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    link: "/contact",
  },
  {
    id: "p2",
    title: "On-Demand Delivery & Fleet Tracking App",
    category: "Apps",
    description: "Cross-platform mobile application with live GPS driver dispatch, push notifications, and integrated payment gateway for local logistics operations.",
    technologies: ["React Native", "Node.js", "WebSockets", "Google Maps API"],
    image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=2006&auto=format&fit=crop",
    link: "/contact",
  },
  {
    id: "p3",
    title: "Automated WhatsApp CRM & Lead Router",
    category: "Automation",
    description: "Automated conversational pipeline processing inbound leads from Meta ads, qualifying customer requirements, and syncing data directly to Notion and Google Sheets.",
    technologies: ["WhatsApp Cloud API", "Python", "FastAPI", "Redis"],
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=1936&auto=format&fit=crop",
    link: "/contact",
  },
  {
    id: "p4",
    title: "Fintech Portfolio Tracker & Analytics Suite",
    category: "UI/UX",
    description: "Complete product redesign and component design system for a retail investment dashboard, improving user task completion speed by 40%.",
    technologies: ["Figma", "Design Systems", "Tailwind CSS", "React"],
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop",
    link: "/contact",
  },
  {
    id: "p5",
    title: "Headless D2C E-Commerce Storefront",
    category: "Websites",
    description: "Sub-second load time e-commerce store with dynamic inventory search, multi-currency checkout, and automated abandoned cart recovery.",
    technologies: ["Next.js", "Shopify Storefront API", "Tailwind", "Vercel"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
    link: "/contact",
  },
  {
    id: "p6",
    title: "AI Document Extractor & Query Bot",
    category: "Automation",
    description: "Internal business bot that scans vendor PDF invoices, parses structured tables, and responds to natural language queries from internal teams.",
    technologies: ["OpenAI API", "LangChain", "Python", "PostgreSQL"],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
    link: "/contact",
  },
];
