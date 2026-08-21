"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { MagneticButton } from "./MagneticButton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const FeaturedProjects = () => {
  const featured = projects.slice(0, 3);

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">
              Featured Projects
            </h2>
            <h3 className="text-3xl md:text-4xl font-heading font-bold">
              Our recent work
            </h3>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/projects">
              <MagneticButton variant="outline" className="flex items-center gap-2 bg-transparent">
                View All Projects <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-xl aspect-[4/3] mb-6 glass-card">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${project.image})` }}
                />
                <div className="absolute inset-0 bg-background/20 group-hover:bg-background/0 transition-colors duration-300" />
                <div className="absolute top-4 left-4 bg-background/80 backdrop-blur text-xs font-bold px-3 py-1 rounded-full border border-border">
                  {project.category}
                </div>
              </div>
              <h4 className="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">
                {project.title}
              </h4>
              <p className="text-muted-foreground mb-4">
                {project.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
