"use client";

import { motion } from "framer-motion";
import { services } from "@/data/services";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { MagneticButton } from "./MagneticButton";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 16 },
  },
};

export const ServicesOverview = () => {
  return (
    <section className="py-20 relative overflow-hidden border-t border-border/80">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col items-center mb-14 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium text-primary bg-primary/10 border border-primary/20 mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>FULL CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-3 tracking-tight">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Tailored engineering capabilities built to solve technical bottlenecks and accelerate your growth.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className="glass-card p-7 rounded-2xl flex flex-col justify-between group glass-card-hover"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <service.icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-heading font-bold mb-2.5 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-5">
                  {service.description}
                </p>

                {service.technologies && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {service.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <Link href={`/contact?service=${service.id}`} className="mt-auto">
                <MagneticButton
                  variant="outline"
                  className="w-full text-xs py-2 px-3.5 rounded-lg justify-between"
                >
                  <span>Request Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </MagneticButton>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
