import React, {
  createContext,
  useContext,
  useRef,
  useState,
} from "react";
import { motion } from "motion/react";

const DockContext = createContext(null);

export function Dock({
  children,
  className = "",
}) {
  const dockRef = useRef(null);
  const [mouseX, setMouseX] = useState(null);

  const handleMouseMove = (event) => {
    if (!dockRef.current) return;

    const rect = dockRef.current.getBoundingClientRect();

    setMouseX(event.clientX - rect.left);
  };

  const handleMouseLeave = () => {
    setMouseX(null);
  };

  return (
    <DockContext.Provider value={{ mouseX }}>
      <div
        ref={dockRef}
        className={`dock ${className}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </DockContext.Provider>
  );
}

export function DockItem({
  children,
  href = "#",
  title,
}) {
  const itemRef = useRef(null);
  const { mouseX } = useContext(DockContext);

  let distance = 999;

  if (mouseX !== null && itemRef.current) {
    const rect = itemRef.current.getBoundingClientRect();
    const dockRect =
      itemRef.current.parentElement.getBoundingClientRect();

    const itemCenter =
      rect.left -
      dockRect.left +
      rect.width / 2;

    distance = Math.abs(mouseX - itemCenter);
  }

  const maxDistance = 110;

  const proximity = Math.max(
    0,
    1 - distance / maxDistance
  );

  const scale =
    1 + proximity * 0.8;

  const translateY =
    proximity * -10;

  return (
    <a
      ref={itemRef}
      href={href}
      className="dock-item"
      aria-label={title}
    >
      <motion.div
        className="dock-item-inner"
        animate={{
          scale,
          y: translateY,
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 22,
          mass: 0.35,
        }}
      >
        {children}
      </motion.div>

      <motion.span
        className="dock-label"
        animate={{
          opacity:
            proximity > 0.75 ? 1 : 0,
          y:
            proximity > 0.75 ? 0 : 5,
          scale:
            proximity > 0.75 ? 1 : 0.95,
        }}
        transition={{
          duration: 0.15,
          ease: "easeOut",
        }}
      >
        {title}
      </motion.span>
    </a>
  );
}