import React, { useState } from "react";
import { motion } from "motion/react";

interface LiquidButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  variant?: "emerald" | "blue" | "violet" | "amber" | "dark" | "black";
  fillColorHex?: string;
}

export default function LiquidButton({
  children,
  onClick,
  href,
  target,
  rel,
  type = "button",
  disabled = false,
  className = "",
  variant = "emerald",
  fillColorHex,
}: LiquidButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Variant themes matching the video green ("emerald") and brand accents
  const variantMap = {
    emerald: {
      bg: "bg-emerald-500 dark:bg-emerald-600",
      waveFill: "#10b981",
      shadow: "hover:shadow-[0_12px_30px_rgba(16,185,129,0.35)]",
    },
    blue: {
      bg: "bg-brand-blue",
      waveFill: "#0066ff",
      shadow: "hover:shadow-[0_12px_30px_rgba(0,102,255,0.35)]",
    },
    violet: {
      bg: "bg-violet-600",
      waveFill: "#7c3aed",
      shadow: "hover:shadow-[0_12px_30px_rgba(124,58,237,0.35)]",
    },
    amber: {
      bg: "bg-amber-500",
      waveFill: "#f59e0b",
      shadow: "hover:shadow-[0_12px_30px_rgba(245,158,11,0.35)]",
    },
    dark: {
      bg: "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950",
      waveFill: "#171717",
      shadow: "hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)]",
    },
    black: {
      bg: "bg-black text-white",
      waveFill: "#000000",
      shadow: "hover:shadow-[0_12px_30px_rgba(0,0,0,0.4)]",
    },
  };

  const currentTheme = variantMap[variant] || variantMap.emerald;
  const waveColor = fillColorHex || currentTheme.waveFill;

  const innerContent = (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full transition-all duration-300 group cursor-pointer select-none active:scale-95 ${currentTheme.shadow} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wave Liquid Fill Layer (Moves upward on hover/focus) */}
      <motion.div
        className={`absolute inset-0 w-full h-[180%] -bottom-[80%] pointer-events-none z-0 ${currentTheme.bg}`}
        initial={{ y: "100%" }}
        animate={{ y: isHovered ? "0%" : "100%" }}
        transition={{ type: "spring", stiffness: 70, damping: 14 }}
      >
        {/* Animated wave crest at the top of liquid layer */}
        <div className="absolute top-0 left-0 w-[200%] h-8 -translate-y-[85%] overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
            className="w-[200%] h-full flex"
          >
            <svg
              className="w-1/2 h-full shrink-0"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              style={{ fill: waveColor }}
            >
              <path d="M 0,50 C 100,15 200,15 300,50 C 400,85 500,85 600,50 C 700,15 800,15 900,50 C 1000,85 1100,85 1200,50 L 1200,120 L 0,120 Z" />
            </svg>
            <svg
              className="w-1/2 h-full shrink-0"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              style={{ fill: waveColor }}
            >
              <path d="M 0,50 C 100,15 200,15 300,50 C 400,85 500,85 600,50 C 700,15 800,15 900,50 C 1000,85 1100,85 1200,50 L 1200,120 L 0,120 Z" />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      {/* Button Content Text & Icons */}
      <span className="relative z-10 flex items-center justify-center gap-2 font-sans font-bold tracking-wide transition-colors duration-300">
        {children}
      </span>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className="inline-block text-none border-0 p-0"
      >
        {innerContent}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="inline-block bg-transparent border-0 p-0 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
    >
      {innerContent}
    </button>
  );
}
