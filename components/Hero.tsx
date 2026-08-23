"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "./MagneticButton";
import { Logo3D } from "./Logo3D";
import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/6 w-[450px] h-[450px] bg-primary/15 rounded-full blur-[140px] -z-10 animate-pulse-subtle" />
      <div className="absolute bottom-1/4 right-1/6 w-[550px] h-[550px] bg-primary-bright/10 rounded-full blur-[160px] -z-10 animate-pulse-subtle" />

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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-primary/10 text-primary border border-primary/20 mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span>Custom Web, Mobile & Automation Engineering</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-heading leading-[1.08] tracking-tight mb-6">
            We build software. <br />
            <span className="text-gradient">You scale business.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
            FreeWheel Technology Solutions partners with founders and businesses to engineer custom web applications, cross-platform mobile apps, and workflow automations from idea to deployment.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/contact">
              <MagneticButton className="text-base px-8 py-4 rounded-xl shadow-lg shadow-primary/25">
                <span>Start a Project</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
            </Link>
            <Link href="/projects">
              <MagneticButton variant="outline" className="text-base px-8 py-4 rounded-xl">
                <Code2 className="w-4 h-4 text-primary" />
                <span>View Recent Work</span>
              </MagneticButton>
            </Link>
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
