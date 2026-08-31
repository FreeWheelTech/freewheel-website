"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "./MagneticButton";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Code2 } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-28 pb-16 overflow-hidden">
      {/* Ambient Warm Atmosphere */}
      <div className="absolute top-1/4 left-1/6 w-[450px] h-[450px] bg-primary/[0.06] rounded-full blur-[160px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/6 w-[550px] h-[550px] bg-primary-bright/[0.04] rounded-full blur-[180px] -z-10 pointer-events-none" />

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
            We build. <br />
            <span className="text-gradient">You grow.</span>
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

        {/* Right Side: Photo Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 relative w-full flex items-center justify-center z-0"
        >
          <div className="relative group rounded-3xl p-2 sm:p-2.5 bg-gradient-to-b from-border/90 via-border/50 to-border/20 border border-primary/20 shadow-2xl shadow-black/25 dark:shadow-primary/5 transition-all duration-500 hover:border-primary/40 hover:shadow-primary/10">
            <div className="relative overflow-hidden rounded-2xl aspect-[3/2] w-full max-w-[540px]">
              <Image
                src="/hero-showcase.jpg"
                alt="FreeWheel Technology Solutions"
                width={1000}
                height={667}
                priority
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Subtle glass rim overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
