export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: "t1",
    name: "Sundar S.",
    role: "Founder & Lead Architect",
    bio: "Full-stack systems architect specializing in scalable Next.js applications, cloud infrastructure, and business automation pipelines.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
  },
  {
    id: "t2",
    name: "Karthik R.",
    role: "Full-Stack Engineer",
    bio: "Core engineer focused on robust API design, microservices, database optimization, and high-concurrency Node.js backends.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: "t3",
    name: "Ananya M.",
    role: "UI/UX Product Designer",
    bio: "Crafting intuitive digital interfaces, accessible design systems, and friction-free user journeys from concept to production.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
  },
  {
    id: "t4",
    name: "Arjun V.",
    role: "Mobile & Automation Lead",
    bio: "Specialist in React Native cross-platform apps, WhatsApp Cloud API integrations, and webhook workflow automations.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
  }
];
