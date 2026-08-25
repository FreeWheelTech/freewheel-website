"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "./MagneticButton";
import Link from "next/link";
import { ArrowRight, Sparkles, Clock, ShieldCheck } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-primary/[0.02] border-y border-primary/15" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/[0.04] rounded-full blur-[160px] -z-10 pointer-events-none" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-card max-w-4xl mx-auto rounded-3xl p-10 md:p-16 border-primary/20 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle top glow bar */}
          <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-primary-bright to-transparent" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/25 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready to scale?</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-6 tracking-tight">
            Have an idea? <br />
            <span className="text-gradient">Let&apos;s build it together.</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Partner with FreeWheel Technology Solutions to engineer robust, scalable, and beautifully designed digital products that drive real business outcomes.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
            <Link href="/contact" className="w-full sm:w-auto">
              <MagneticButton className="text-base px-9 py-4 w-full sm:w-auto rounded-xl shadow-lg shadow-primary/30">
                <span>Start a Project</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
            </Link>
            <Link href="/services" className="w-full sm:w-auto">
              <MagneticButton variant="outline" className="text-base px-8 py-4 w-full sm:w-auto rounded-xl">
                <span>Explore All Services</span>
              </MagneticButton>
            </Link>
          </div>

          {/* Quick guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground font-medium pt-4 border-t border-border/60">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              <span>Fast 24-hour turnaround on inquiries</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Transparent milestones & direct communication</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
