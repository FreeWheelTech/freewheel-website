"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Logo: React.FC<LogoProps> = ({
  className,
  size = "md",
}) => {
  const sizeMap = {
    sm: { width: 155, height: 36 },
    md: { width: 195, height: 45 },
    lg: { width: 240, height: 55 },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={cn("inline-flex items-center select-none group relative transition-transform duration-300 hover:scale-[1.03]", className)}>
      <Image
        src="/logo-exact.png"
        alt="FreeWheel Technology Solutions"
        width={currentSize.width}
        height={currentSize.height}
        priority
        className="w-auto h-9 sm:h-11 object-contain drop-shadow-[0_0_12px_rgba(0,180,255,0.3)] filter"
      />
    </div>
  );
};
