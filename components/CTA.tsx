"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "./MagneticButton";
import Link from "next/link";

export const CTA = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-primary/5 border-y border-primary/20" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] -z-10" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, var(--color-foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--color-foreground) 1px, transparent 1px)',
          backgroundSize: '40px 40px' 
        }} 
      />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card max-w-4xl mx-auto rounded-3xl p-12 md:p-20"
        >
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
            Have an idea? <br />
            <span className="text-gradient">Let's build it.</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Ready to accelerate your digital growth? Partner with FreeWheel to create robust, scalable, and beautifully designed solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/contact">
              <MagneticButton className="text-lg px-10 py-5 w-full sm:w-auto">
                Start a Project
              </MagneticButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
