"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, categories, type ProjectCategory } from "@/data/projects";
import { CTA } from "@/components/CTA";
import { MagneticButton } from "@/components/MagneticButton";

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "All">("All");

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <>
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10" />
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6">
            Featured <span className="text-gradient">Projects</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Explore our portfolio of cutting-edge websites, mobile apps, and enterprise solutions.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-16">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === "All" 
                  ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(8,124,255,0.4)]" 
                  : "bg-card border border-border hover:border-primary text-foreground"
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category 
                    ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(8,124,255,0.4)]" 
                    : "bg-card border border-border hover:border-primary text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-6">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
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
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <CTA />
    </>
  );
}
