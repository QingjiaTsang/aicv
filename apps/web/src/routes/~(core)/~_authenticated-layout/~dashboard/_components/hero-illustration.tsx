import { motion } from "framer-motion";

export function HeroIllustration() {
  return (
    <div className="relative w-full aspect-square md:aspect-[4/3] p-4 ml-8">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background decoration - gradient glow */}
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" className="text-violet-500/30 dark:text-violet-400/20" stopColor="currentColor" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <circle cx="200" cy="200" r="150" fill="url(#glow)" />
        </motion.g>

        {/* AI network lines */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-violet-500/20 dark:text-violet-400/10"
        >
          <NetworkLines />
        </motion.g>

        {/* Main document */}
        <motion.g
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <Document />
        </motion.g>

        {/* Decorative particles */}
        <motion.g>
          <Particles />
        </motion.g>
      </svg>
    </div>
  );
}

// Network lines component
function NetworkLines() {
  return (
    <motion.g
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Generate random connection lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.path
          key={i}
          d={generateRandomPath()}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
            delay: i * 0.2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </motion.g>
  );
}

// Document component
function Document() {
  return (
    <motion.g
      animate={{
        y: [-5, 5, -5],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="drop-shadow-2xl"
    >
      <rect
        x="120"
        y="100"
        width="160"
        height="200"
        rx="8"
        className="fill-white/90 dark:fill-gray-800/90"
      />
      {/* Document content lines */}
      <g className="text-violet-200 dark:text-violet-700/50" stroke="currentColor">
        <line x1="140" y1="130" x2="260" y2="130" strokeWidth="2" />
        <line x1="140" y1="150" x2="240" y2="150" strokeWidth="2" />
        <line x1="140" y1="170" x2="260" y2="170" strokeWidth="2" />
        <line x1="140" y1="190" x2="220" y2="190" strokeWidth="2" />
      </g>
    </motion.g>
  );
}

// Decorative particles component
function Particles() {
  return (
    <g>
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.circle
          key={i}
          cx={100 + Math.random() * 200}
          cy={100 + Math.random() * 200}
          r={1 + Math.random() * 2}
          className="fill-violet-500/30 dark:fill-violet-400/20"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </g>
  );
}

// Helper function: generate random path
function generateRandomPath() {
  const start = {
    x: 100 + Math.random() * 200,
    y: 100 + Math.random() * 200,
  };
  const end = {
    x: 100 + Math.random() * 200,
    y: 100 + Math.random() * 200,
  };
  const control1 = {
    x: start.x + (Math.random() - 0.5) * 100,
    y: start.y + (Math.random() - 0.5) * 100,
  };
  const control2 = {
    x: end.x + (Math.random() - 0.5) * 100,
    y: end.y + (Math.random() - 0.5) * 100,
  };

  return `M ${start.x} ${start.y} C ${control1.x} ${control1.y} ${control2.x} ${control2.y} ${end.x} ${end.y}`;
} 