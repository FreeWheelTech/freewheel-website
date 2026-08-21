export type ProjectCategory = "Websites" | "Apps" | "Automation" | "UI/UX";

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  image: string;
  link: string;
}

export const categories: ProjectCategory[] = ["Websites", "Apps", "Automation", "UI/UX"];

export const projects: Project[] = [
  {
    id: "p1",
    title: "TechNova Platform",
    category: "Websites",
    description: "A comprehensive SaaS dashboard for tech enterprises.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    link: "#",
  },
  {
    id: "p2",
    title: "FitTrack App",
    category: "Apps",
    description: "Mobile fitness tracking application with social features.",
    image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=2006&auto=format&fit=crop",
    link: "#",
  },
  {
    id: "p3",
    title: "Brand Identity",
    category: "UI/UX",
    description: "Complete branding and design system for a modern startup.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
    link: "#",
  },
  {
    id: "p4",
    title: "Solaris Dashboard",
    category: "UI/UX",
    description: "Dark-themed analytics dashboard with real-time data visualization.",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop",
    link: "#",
  },
  {
    id: "p5",
    title: "AutoReply Bot",
    category: "Automation",
    description: "WhatsApp bot for automating customer support queries.",
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=1936&auto=format&fit=crop",
    link: "#",
  },
  {
    id: "p6",
    title: "E-Commerce Replatform",
    category: "Websites",
    description: "High-performance online store built with Next.js.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
    link: "#",
  },
];
