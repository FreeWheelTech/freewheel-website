"use client";

import { motion } from "framer-motion";
import { services } from "@/data/services";
import { MagneticButton } from "./MagneticButton";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";

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
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 16 },
  },
};

export const ServicesOverview = () => {
  return (
    <section className="py-28 relative bg-secondary/30 dark:bg-background/40 border-t border-border/80 overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/3 left-0 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[140px] -z-10" />
      <div className="absolute bottom-1/4 right-0 w-[450px] h-[450px] bg-primary-bright/10 rounded-full blur-[140px] -z-10" />

      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-4">
              <Layers className="w-3.5 h-3.5" />
              <span>Core Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 tracking-tight">
              Empowering your <span className="text-gradient">digital evolution</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              From enterprise web architectures to AI-powered business automations, we build reliable software that scales with your ambitions.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className="glass-card rounded-2xl p-7 glass-card-hover group flex flex-col justify-between relative overflow-hidden"
            >
              {/* Subtle top accent gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div>
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(8,124,255,0.25)] transition-all duration-300">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Tech Stack Badges */}
                {service.technologies && service.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {service.technologies.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-secondary/80 text-muted-foreground border border-border/60"
                      >
                        {tech}
                      </span>
                    ))}
                    {service.technologies.length > 3 && (
                      <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-secondary/50 text-muted-foreground">
                        +{service.technologies.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <Link href={`/contact?service=${service.id}`} className="mt-auto w-full pt-2">
                <MagneticButton
                  variant="outline"
                  className="w-full text-xs py-2.5 rounded-lg justify-between px-4 group/btn bg-card/50"
                >
                  <span>Request Service</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                </MagneticButton>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
