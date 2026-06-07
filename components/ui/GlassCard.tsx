"use client";

import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type GlassCardProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
  hover?: boolean;
  glow?: boolean;
};

export function GlassCard({
  children,
  className,
  hover = true,
  glow = false,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={cn(
        "glass-panel relative overflow-hidden rounded-2xl p-6",
        glow && "neon-border",
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-pink-400/10 blur-3xl" />
      {children}
    </motion.div>
  );
}
