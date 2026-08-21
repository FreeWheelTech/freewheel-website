import { Team } from "@/components/Team";
import { CTA } from "@/components/CTA";

export default function About() {
  return (
    <>
      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6">
            We turn ideas into <span className="text-gradient">digital reality.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            FreeWheel Technology Solutions is a premier digital agency focused on delivering high-end software solutions. 
            We partner with businesses to build robust, scalable, and beautifully designed applications.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-16">
            <div className="glass-card p-8 rounded-2xl">
              <h3 className="text-2xl font-bold font-heading mb-4 text-primary">Our Vision</h3>
              <p className="text-muted-foreground">
                To become a globally trusted technology partner for businesses and creators, driving digital transformation through innovative software solutions.
              </p>
            </div>
            <div className="glass-card p-8 rounded-2xl">
              <h3 className="text-2xl font-bold font-heading mb-4 text-primary">Our Mission</h3>
              <p className="text-muted-foreground">
                Build reliable, modern, and scalable digital solutions that empower our clients to achieve their business objectives efficiently.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-left">
            <h3 className="text-2xl font-bold font-heading mb-8 text-center">Why Choose FreeWheel?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {['Fast Development', 'Client Focused', 'Innovative', 'Scalable Solutions'].map((reason, i) => (
                <div key={i} className="glass-card p-6 rounded-xl text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 text-xl font-bold text-primary">
                    {i + 1}
                  </div>
                  <h4 className="font-bold font-heading">{reason}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Team />
      <CTA />
    </>
  );
}
