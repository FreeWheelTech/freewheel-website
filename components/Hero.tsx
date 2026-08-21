"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "./MagneticButton";
import { Logo3D } from "./Logo3D";
import { companyInfo } from "@/data/company";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-primary-bright/10 rounded-full blur-[150px] -z-10" />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10"
        >
          <h1 className="text-5xl md:text-7xl font-bold font-heading leading-tight mb-6">
            We build. <br />
            <span className="text-gradient">You grow.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
            {companyInfo.description}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/contact">
              <MagneticButton className="text-lg px-8 py-4">Start a Project</MagneticButton>
            </Link>
            <Link href="/services">
              <MagneticButton variant="outline" className="text-lg px-8 py-4 bg-transparent">
                Explore Services
              </MagneticButton>
            </Link>
          </div>
        </motion.div>

        {/* Right Side: 3D Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative h-[500px] lg:h-[700px] w-full flex items-center justify-center z-0"
        >
          <Logo3D />
        </motion.div>
      </div>
    </section>
  );
};
