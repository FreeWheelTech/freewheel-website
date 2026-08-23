"use client";

import React, { useRef, useState } from "react";
import { motion, useAnimation, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ children, className, variant = "primary", ...props }, ref) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    const controls = useAnimation();
    const [, setIsHovered] = useState(false);

    // Combine refs
    const buttonRef = (node: HTMLButtonElement) => {
      internalRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLButtonElement>).current = node;
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!internalRef.current) return;
      const { clientX, clientY } = e;
      const { height, width, left, top } = internalRef.current.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      controls.start({
        x: x * 0.25,
        y: y * 0.25,
        transition: { type: "spring", stiffness: 200, damping: 15, mass: 0.1 },
      });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      controls.start({
        x: 0,
        y: 0,
        transition: { type: "spring", stiffness: 200, damping: 15, mass: 0.1 },
      });
    };

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-primary to-primary-bright text-primary-foreground font-semibold shadow-[0_4px_20px_rgba(8,124,255,0.35)] hover:shadow-[0_6px_25px_rgba(0,195,255,0.5)] hover:brightness-105 active:scale-[0.98]",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/80 shadow-sm active:scale-[0.98]",
      outline:
        "border border-primary/40 bg-background/50 backdrop-blur-sm text-primary hover:border-primary hover:bg-primary/10 shadow-[0_0_15px_rgba(8,124,255,0.08)] active:scale-[0.98]",
      ghost:
        "text-foreground hover:text-primary hover:bg-primary/5 active:scale-[0.98]",
    };

    return (
      <motion.button
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={controls}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer select-none",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </motion.button>
    );
  }
);
MagneticButton.displayName = "MagneticButton";
