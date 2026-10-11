import { cn } from "../../lib/utils";
import { AnimatePresence, motion } from "motion/react";
import {
  Children,
  cloneElement,
  useEffect,
  useId,
  useState,
} from "react";

export function AnimatedBackground({
  children,
  defaultValue,
  onValueChange,
  className,
  transition,
  enableHover = false,
}) {
  const [activeId, setActiveId] = useState(null);
  const uniqueId = useId();

  const handleSetActiveId = (id) => {
    setActiveId(id);

    if (onValueChange) {
      onValueChange(id);
    }
  };

  useEffect(() => {
    if (defaultValue !== undefined) {
      setActiveId(defaultValue);
    }
  }, [defaultValue]);

  return Children.map(children, (child) => {
    const id = child.props["data-id"];

    const interactionProps = enableHover
      ? {
          onMouseEnter: () => handleSetActiveId(id),
          onMouseLeave: () => handleSetActiveId(null),
        }
      : {};

    return cloneElement(
      child,
      {className: cn(
  "animated-background-item",
  child.props.className
),
        "data-checked": activeId === id ? "true" : "false",
        ...interactionProps,
      },
      <>
        <AnimatePresence initial={false}>
          {activeId === id && (
            <motion.div
              layoutId={`background-${uniqueId}`}
               className={cn("animated-background-layer", className)}
              transition={transition || { duration: 0.10, ease: "easeOut" }}
              initial={{
                opacity: defaultValue ? 1 : 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            />
          )}
        </AnimatePresence>
<div className="animated-background-content">
  {child.props.children}
</div>
      </>
    );
  });
}