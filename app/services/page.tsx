import { ServicesOverview } from "@/components/ServicesOverview";
import { CTA } from "@/components/CTA";

export default function Services() {
  return (
    <>
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10" />
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6">
            Our <span className="text-gradient">Services</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive digital solutions tailored to your unique business needs. We specialize in modern web and mobile technologies.
          </p>
        </div>
      </section>

      <ServicesOverview />
      <CTA />
    </>
  );
}
