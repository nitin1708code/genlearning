import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function TextEffect({
  children,
  className = "",
  delay = 0,
  per = "char",
}) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  const text = String(children);

  const items =
    per === "word"
      ? text.split(" ")
      : Array.from(text);

  return (
    <motion.span
      className={`text-effect ${className}`}
      initial={{ opacity: 0 }}
      animate={{
        opacity: started ? 1 : 0,
      }}
    >
      {items.map((item, index) => (
        <motion.span
          key={`${item}-${index}`}
          className="text-effect-item"
          initial={{
            opacity: 0,
            rotateX: 90,
            y: 10,
          }}
          animate={{
            opacity: started ? 1 : 0,
            rotateX: started ? 0 : 90,
            y: started ? 0 : 10,
          }}
          transition={{
            duration: 0.35,
            delay: index * (per === "word" ? 0.08 : 0.045),
            ease: "easeOut",
          }}
        >
          {item}
          {per === "word" && index < items.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </motion.span>
  );
}