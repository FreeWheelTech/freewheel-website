import { Hero } from "@/components/Hero";
import { ServicesOverview } from "@/components/ServicesOverview";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { CTA } from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <FeaturedProjects />
      <CTA />
    </>
  );
}
