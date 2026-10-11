import React, { useEffect, useState } from "react";

export function AnimatedNumber({
  value,
  className = "",
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const duration = 800;

    const update = (time) => {
      if (startTime === null) {
        startTime = time;
      }

      const progress = Math.min(
        (time - startTime) / duration,
        1
      );

      const eased =
        1 - Math.pow(1 - progress, 3);

      setDisplayValue(
        Math.round(value * eased)
      );

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(update);
      }
    };

    animationFrame =
      requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [value]);

  return (
    <span className={className}>
      {displayValue}
    </span>
  );
}