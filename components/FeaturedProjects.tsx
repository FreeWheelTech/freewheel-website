"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { MagneticButton } from "./MagneticButton";
import Link from "next/link";
import { ArrowRight, Sparkles, ExternalLink } from "lucide-react";

export const FeaturedProjects = () => {
  const featured = projects.slice(0, 3);

  return (
    <section className="py-28 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[160px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Proven Results</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight">
              Featured <span className="text-gradient">Projects</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/projects">
              <MagneticButton variant="outline" className="flex items-center gap-2 rounded-xl px-5 py-3">
                <span>View All Projects</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
              transition={{ delay: index * 0.12, duration: 0.6 }}
              className="glass-card rounded-2xl overflow-hidden glass-card-hover group flex flex-col justify-between"
            >
              <div>
                {/* Project Image Box */}
                <div className="relative overflow-hidden aspect-[16/10] bg-muted">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${project.image})` }}
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 bg-background/85 backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-full border border-border/80 shadow-md">
                    {project.category}
                  </div>

                  {/* Corner action preview */}
                  <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-primary/90 text-white flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-primary/30">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>

                {/* Project Meta Info */}
                <div className="p-7">
                  <h3 className="text-xl font-heading font-bold mb-2.5 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="px-7 pb-6 pt-0">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-bright transition-colors"
                >
                  <span>Explore Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
