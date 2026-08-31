export interface TeamMember {
  id: string;
  name: string;
  role: string;
  departmentRoles: string[];
  bio: string;
  image: string;
  linkedin?: string;
  email?: string;
}

export interface DepartmentFilter {
  label: string;
  roleMatch: string;
}

export const departmentFilters: DepartmentFilter[] = [
  { label: "All", roleMatch: "All" },
  { label: "Project Lead", roleMatch: "Project Manager" },
  { label: "UI/UX", roleMatch: "UI/UX" },
  { label: "Frontend", roleMatch: "Frontend" },
  { label: "Backend", roleMatch: "Backend" },
  { label: "QA & Testing", roleMatch: "Testing & Deployment" },
  { label: "Client & Sales", roleMatch: "Client Communication & Sales" },
  { label: "Social Media", roleMatch: "Social Media" },
];

export const teamMembers: TeamMember[] = [
  {
    id: "sivasankaran",
    name: "Sivasankaran",
    role: "Project Manager & Backend",
    departmentRoles: ["Project Manager", "Backend", "Testing & Deployment"],
    bio: "Technical leadership and delivery orchestration, specializing in backend architectures, system testing, and release management.",
    image: "/team/sivashankaran.jpeg",
  },
  {
    id: "krishnahari",
    name: "Krishnahari",
    role: "Project Manager & UI/UX",
    departmentRoles: ["Project Manager", "UI/UX", "Client Communication & Sales"],
    bio: "Project management lead and product designer, aligning client business objectives with intuitive user experience design.",
    image: "/team/krishnahari.jpeg",
  },
  {
    id: "mohamed-asif",
    name: "Mohamed asif",
    role: "UI/UX & Frontend",
    departmentRoles: ["UI/UX", "Frontend", "Social Media"],
    bio: "User experience designer and frontend specialist building fluid, responsive interfaces and overseeing brand visual presence.",
    image: "/team/mohameedasif.jpeg",
  },
  {
    id: "meenatchisundaram",
    name: "Meenatchisundaram",
    role: "Backend Engineer",
    departmentRoles: ["Backend"],
    bio: "Core backend engineer focused on secure APIs, database systems, server performance, and scalable cloud integrations.",
    image: "/team/meenatchisundaram.jpeg",
  },
  {
    id: "hariprasanth",
    name: "Hariprasanth",
    role: "Backend & UI/UX",
    departmentRoles: ["Backend", "UI/UX"],
    bio: "Full-spectrum engineer uniting robust backend data flow with intuitive, accessible interface design systems.",
    image: "/team/hariprasath.jpeg",
  },
  {
    id: "mukilan",
    name: "Mukilan",
    role: "Frontend & Client Relations",
    departmentRoles: ["Frontend", "Client Communication & Sales"],
    bio: "Frontend engineer and client communicator, translating client requirements into performant modern web solutions.",
    image: "/team/mukilan.jpeg",
  },
  {
    id: "keshavraj",
    name: "Keshavraj",
    role: "Frontend & QA / Deployment",
    departmentRoles: ["Frontend", "Testing & Deployment"],
    bio: "Frontend developer focused on component systems, end-to-end testing, cross-browser compatibility, and deployments.",
    image: "/team/keshavraj.jpeg",
  },
  {
    id: "narayanan",
    name: "Narayanan",
    role: "Frontend & Social Media",
    departmentRoles: ["Frontend", "Social Media"],
    bio: "Modern frontend developer delivering dynamic client-side experiences and driving company social media reach.",
    image: "/team/lakshamana-narayanan.jpeg",
  },
  {
    id: "gunabalan",
    name: "Gunabalan",
    role: "Backend, QA & Social Media",
    departmentRoles: ["Backend", "Testing & Deployment", "Social Media"],
    bio: "Backend developer and quality assurance engineer ensuring reliable test automation, build integrity, and digital marketing.",
    image: "/team/gunabalan.jpeg",
  },
];
