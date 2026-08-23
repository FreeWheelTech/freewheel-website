"use client";

import { ServicesOverview } from "@/components/ServicesOverview";
import { CTA } from "@/components/CTA";
import { motion } from "framer-motion";
import { Sparkles, Code2, Cpu, Rocket, GitBranch } from "lucide-react";

export default function Services() {
  const steps = [
    {
      num: "01",
      title: "Discovery & Blueprint",
      desc: "We analyze your project goals, define tech stack requirements, and outline architecture milestones.",
      icon: GitBranch,
    },
    {
      num: "02",
      title: "UI/UX & Prototyping",
      desc: "We create interactive wireframes and design systems tailored for maximum user conversion and intuitive flow.",
      icon: Code2,
    },
    {
      num: "03",
      title: "Agile Development",
      desc: "Clean, performant, and scalable code built in transparent sprints with continuous staging previews.",
      icon: Cpu,
    },
    {
      num: "04",
      title: "Testing, Launch & Scale",
      desc: "Rigorous QA testing, automated CI/CD deployment, and ongoing post-launch scaling and maintenance.",
      icon: Rocket,
    },
  ];

  return (
    <>
      <section className="pt-36 pb-16 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[550px] h-[550px] bg-primary/10 rounded-full blur-[140px] -z-10 pointer-events-none" />
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Spectrum Solutions</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading mb-6 tracking-tight">
              Engineering <span className="text-gradient">Capabilities</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Comprehensive digital engineering tailored to your unique business needs. We specialize in modern web apps, mobile systems, automation, and AI workflows.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-2">
              Our 4-Step Delivery Process
            </h2>
            <p className="text-muted-foreground text-sm">
              From concept to deployment, we follow a transparent and structured engineering lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="glass-card p-6 rounded-2xl relative overflow-hidden group glass-card-hover"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold font-heading text-primary/40 group-hover:text-primary transition-colors">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-base font-bold font-heading mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ServicesOverview />
      <CTA />
    </>
  );
}
