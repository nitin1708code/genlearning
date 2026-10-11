import { motion, useInView } from "motion/react";
import { useRef } from "react";

export function InView({
  children,
  variants,
  transition,
  viewOptions,
  className = "",
}) {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    once: true,
    ...viewOptions,
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}