"use client";

import React, { useRef, useState } from "react";
import { motion, useAnimation, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
}

export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ children, className, variant = "primary", ...props }, ref) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    const controls = useAnimation();
    const [isHovered, setIsHovered] = useState(false);

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
        x: x * 0.2,
        y: y * 0.2,
        transition: { type: "spring", stiffness: 150, damping: 15, mass: 0.1 },
      });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      controls.start({
        x: 0,
        y: 0,
        transition: { type: "spring", stiffness: 150, damping: 15, mass: 0.1 },
      });
    };

    const variantStyles = {
      primary: "bg-primary text-primary-foreground hover:bg-primary-bright hover:shadow-[0_0_20px_rgba(8,124,255,0.4)]",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-primary text-primary hover:bg-primary/10",
    };

    return (
      <motion.button
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={controls}
        className={cn(
          "relative px-6 py-3 rounded-md font-medium transition-colors duration-300",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);
MagneticButton.displayName = "MagneticButton";
