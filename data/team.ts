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
    name: "Team Member Name",
    role: "Founder & CEO",
    bio: "Passionate about building scalable technology solutions that drive business growth.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "t2",
    name: "Team Member Name",
    role: "Lead Developer",
    bio: "Full-stack expert specializing in React and modern cloud architectures.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
  },
  {
    id: "t3",
    name: "Team Member Name",
    role: "UI/UX Designer",
    bio: "Creating intuitive and beautiful digital experiences with a focus on user needs.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: "t4",
    name: "Team Member Name",
    role: "Project Manager",
    bio: "Ensuring timely delivery and smooth communication across all our projects.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1974&auto=format&fit=crop",
  }
];
