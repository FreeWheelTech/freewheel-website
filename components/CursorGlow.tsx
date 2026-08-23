"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const CursorGlow = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Outer ambient glow */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-40 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 dark:bg-primary/[0.08] blur-[90px]"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 28,
          mass: 0.3,
        }}
      />
      {/* Inner focused core */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-40 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-bright/15 dark:bg-primary-bright/10 blur-[45px]"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 24,
          mass: 0.15,
        }}
      />
    </>
  );
};
