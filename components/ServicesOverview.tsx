"use client";

import { motion } from "framer-motion";
import { services } from "@/data/services";
import { MagneticButton } from "./MagneticButton";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
};

export const ServicesOverview = () => {
  return (
    <section className="py-24 relative bg-background/50 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">
              Services Overview
            </h2>
            <h3 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Empowering your digital presence
            </h3>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.slice(0, 8).map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className="glass-card rounded-xl p-8 glass-card-hover group flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-xl font-heading font-bold mb-4">{service.title}</h4>
              <p className="text-sm text-muted-foreground mb-6 flex-grow">{service.description}</p>
              <Link href="/contact" className="mt-auto w-full">
                <MagneticButton variant="outline" className="w-full text-xs py-2 bg-transparent">
                  Request Service
                </MagneticButton>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
