"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "./MagneticButton";
import { Logo3D } from "./Logo3D";
import { companyInfo } from "@/data/company";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, Zap, ShieldCheck } from "lucide-react";

export const Hero = () => {
  const stats = [
    { value: "50+", label: "Projects Delivered", icon: Zap },
    { value: "99.9%", label: "System Uptime", icon: ShieldCheck },
    { value: "100%", label: "Client Satisfaction", icon: CheckCircle2 },
  ];

  return (
    <section className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/6 w-[450px] h-[450px] bg-primary/20 rounded-full blur-[140px] -z-10 animate-pulse-subtle" />
      <div className="absolute bottom-1/4 right-1/6 w-[550px] h-[550px] bg-primary-bright/15 rounded-full blur-[160px] -z-10 animate-pulse-subtle" />

      {/* Subtle Mesh Grid */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Side: Copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 z-10"
        >
          {/* Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span>Next-Generation Digital Engineering</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-heading leading-[1.08] tracking-tight mb-6">
            We build. <br />
            <span className="text-gradient">You grow.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
            {companyInfo.description}
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <Link href="/contact">
              <MagneticButton className="text-base px-8 py-4 rounded-xl shadow-lg shadow-primary/25">
                <span>Start a Project</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
            </Link>
            <Link href="/services">
              <MagneticButton variant="outline" className="text-base px-8 py-4 rounded-xl">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Explore Services</span>
              </MagneticButton>
            </Link>
          </div>

          {/* Live Trust Metrics Strip */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/80 max-w-xl">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <div className="flex items-center gap-1.5 text-xl sm:text-2xl font-bold font-heading text-foreground">
                  <stat.icon className="w-4 h-4 text-primary" />
                  <span>{stat.value}</span>
                </div>
                <span className="text-xs text-muted-foreground font-medium mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: 3D Centerpiece */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:col-span-5 relative h-[420px] sm:h-[500px] lg:h-[620px] w-full flex items-center justify-center z-0"
        >
          <Logo3D />
        </motion.div>
      </div>
    </section>
  );
};
