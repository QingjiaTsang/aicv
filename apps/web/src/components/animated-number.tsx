import { motion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

type AnimatedNumberProps = {
  value: number;
  className?: string;
  duration?: number;
  bounce?: number;
  formatValue?: (value: number) => string | number;
};

export function AnimatedNumber({
  value,
  className,
  duration = 1000,
  bounce = 0,
  formatValue = (val) => val,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  const springValue = useSpring(0, {
    bounce,
    duration,
  });

  springValue.on("change", (latest) => {
    setDisplayValue(Math.round(latest));
  });

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {formatValue(displayValue)}
    </motion.span>
  );
} 