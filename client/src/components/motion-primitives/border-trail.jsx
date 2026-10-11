import { motion } from "motion/react";

export function BorderTrail({
  size = 120,
  duration = 4,
  className = "",
}) {
  return (
    <motion.div
      className={`border-trail ${className}`}
      style={{
        width: `${size}px`,
        height: "2px",
      }}
      animate={{
        x: ["0%", "calc(100% - 120px)", "0%"],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}