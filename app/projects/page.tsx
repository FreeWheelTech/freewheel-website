"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, categories, type ProjectCategory } from "@/data/projects";
import { CTA } from "@/components/CTA";
import { Sparkles, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "All">("All");

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <>
      <section className="pt-36 pb-14 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-0 w-[550px] h-[550px] bg-primary/10 rounded-full blur-[140px] -z-10 pointer-events-none" />

        <div className="container mx-auto px-6 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Portfolio</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading mb-6 tracking-tight">
              Featured <span className="text-gradient">Projects</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Explore our portfolio of scalable web platforms, high-performance mobile apps, and automated digital ecosystems.
            </p>
          </motion.div>

          {/* Filter Pills with Animated Background */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-8">
            <button
              onClick={() => setActiveCategory("All")}
              className={`relative px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                activeCategory === "All"
                  ? "text-primary-foreground font-bold shadow-md shadow-primary/25"
                  : "bg-card/70 border border-border/80 text-muted-foreground hover:text-foreground hover:border-primary/40"
              }`}
            >
              {activeCategory === "All" && (
                <motion.div
                  layoutId="active-category-pill"
                  className="absolute inset-0 bg-primary rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span>All Projects ({projects.length})</span>
            </button>

            {categories.map((category) => {
              const count = projects.filter((p) => p.category === category).length;
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "text-primary-foreground font-bold shadow-md shadow-primary/25"
                      : "bg-card/70 border border-border/80 text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-category-pill"
                      className="absolute inset-0 bg-primary rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span>
                    {category} ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-28">
        <div className="container mx-auto px-6">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="glass-card rounded-2xl overflow-hidden glass-card-hover group flex flex-col justify-between"
                >
                  <div>
                    {/* Project Image Aspect Frame */}
                    <div className="relative overflow-hidden aspect-[16/10] bg-muted">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{ backgroundImage: `url(${project.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-300" />

                      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-full border border-border/80">
                        {project.category}
                      </div>

                      <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-primary/90 text-white flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-primary/30">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="p-7">
                      <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {project.description}
                      </p>

                      {/* Tech stack pills */}
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {project.technologies.map((t, idx) => (
                            <span key={idx} className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-secondary/80 text-muted-foreground border border-border/60">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-7 pb-6 pt-0">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-bright transition-colors"
                    >
                      <span>Inquire About Similar Solution</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
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
