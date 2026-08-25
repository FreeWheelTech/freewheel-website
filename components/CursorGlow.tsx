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
      {/* Subtle ambient luxury highlight */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-30 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] dark:bg-primary/[0.05] blur-[100px]"
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
    </>
  );
};
