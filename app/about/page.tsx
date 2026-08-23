"use client";

import { useState } from "react";
import { Team } from "@/components/Team";
import { CTA } from "@/components/CTA";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  DollarSign,
  GraduationCap,
  Users,
  Eye,
  Layers,
  Sparkles,
  Target,
  Compass,
  Zap,
} from "lucide-react";

export default function About() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const differentiators = [
    {
      title: "Idea-to-Impact",
      description:
        "We don't just execute projects; we help turn raw ideas into real, practical, and scalable software solutions.",
      icon: Lightbulb,
    },
    {
      title: "Affordable Innovation",
      description:
        "We make professional technology accessible to students, ambitious startups, and growing small businesses.",
      icon: DollarSign,
    },
    {
      title: "Learn While Building",
      description:
        "Every project is an opportunity for our young talent to gain real-world engineering experience while creating impact.",
      icon: GraduationCap,
    },
    {
      title: "Long-Term Partnership",
      description:
        "Our relationship doesn't end after delivery; we help improve, maintain, and scale the solution as your needs grow.",
      icon: Users,
    },
    {
      title: "Transparent Development",
      description:
        "Clients can see live progress, understand architectural decisions, and stay actively involved throughout the sprint cycle.",
      icon: Eye,
    },
    {
      title: "One Place for Everything",
      description:
        "From idea validation and UI/UX design to full-stack development, cloud deployment, and digital growth, we bring everything together.",
      icon: Layers,
    },
  ];

  return (
    <>
      <section className="pt-36 pb-24 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-primary/10 rounded-full blur-[160px] -z-10 pointer-events-none" />

        <div className="container mx-auto px-6 max-w-5xl text-center">
          {/* Header Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Who We Are</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading mb-6 tracking-tight">
              We turn ideas into <span className="text-gradient">digital reality.</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              FreeWheel Technology Solutions is a premier digital engineering agency. We partner with founders, businesses, and innovators to build robust, scalable, and beautifully designed digital products.
            </p>
          </motion.div>

          {/* Vision & Mission Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card p-8 sm:p-10 rounded-3xl relative overflow-hidden group glass-card-hover"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-3 text-foreground group-hover:text-primary transition-colors">
                Our Vision
              </h3>
              <p className="text-muted-foreground leading-relaxed text-base">
                To make starting and scaling something great accessible and possible for everyone through high-caliber technology.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="glass-card p-8 sm:p-10 rounded-3xl relative overflow-hidden group glass-card-hover"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary-bright/10 border border-primary-bright/20 flex items-center justify-center mb-6 text-primary-bright group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-3 text-foreground group-hover:text-primary transition-colors">
                Our Mission
              </h3>
              <p className="text-muted-foreground leading-relaxed text-base">
                FreeWheel discovers potential where others see limitations, connects talent where others see gaps, and builds solutions where others see problems.
              </p>
            </motion.div>
          </div>

          {/* Differentiators Grid */}
          <div className="mt-24 text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-3">
                <Zap className="w-3.5 h-3.5" />
                <span>Our Core Advantage</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight">
                What Makes FreeWheel Different?
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {differentiators.map((reason, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="glass-card p-6 sm:p-7 rounded-2xl group transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20 cursor-pointer flex flex-col justify-start min-h-[140px]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                        <reason.icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold font-heading px-2.5 py-1 rounded-full bg-secondary text-muted-foreground border border-border/60">
                        0{i + 1}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold font-heading group-hover:text-primary transition-colors">
                      {reason.title}
                    </h3>

                    <AnimatePresence>
                      {hoveredIndex === i && (
                        <motion.p
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.28, ease: "easeOut" }}
                          className="text-sm leading-relaxed text-muted-foreground overflow-hidden"
                        >
                          {reason.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
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
