import { motion } from "framer-motion";

export function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-indigo-50 dark:from-violet-950 dark:via-purple-950 dark:to-indigo-950" />

      {/* Adding a soft noise texture */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] dark:opacity-[0.05]" />

      {/* Adding a glow effect for dark mode */}
      <div className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-gradient-to-br from-violet-500/10 to-transparent dark:from-violet-500/5 rounded-full blur-3xl" />
      <div className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-gradient-to-br from-fuchsia-500/10 to-transparent dark:from-fuchsia-500/5 rounded-full blur-3xl" />

      {/* Dynamic Decorative Elements */}
      <div className="absolute inset-0">
        {/* Resume Icon Animation */}
        <motion.div
          className="absolute bottom-40 right-[15%] h-24 w-20 opacity-20 dark:opacity-10"
          animate={{
            y: [0, 20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 24 24" className="h-full w-full text-fuchsia-500">
            <path
              fill="currentColor"
              d="M21,6V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H19A2,2 0 0,1 21,4V6M19,6H17V4H19V6M7,4H5V6H7V4M7,8H5V10H7V8M7,12H5V14H7V12M7,16H5V18H7V16M7,20H5V22H7V20M11,4H9V6H11V4M11,8H9V10H11V8M11,12H9V14H11V12M11,16H9V18H11V16M11,20H9V22H11V20M15,4H13V6H15V4M15,8H13V10H15V8M15,12H13V14H15V12M15,16H13V18H15V16M15,20H13V22H15V20Z"
            />
          </svg>
        </motion.div>

        {/* Resume Content Animation */}
        <motion.div
          className="absolute top-20 left-[20%] h-20 w-16 opacity-20 dark:opacity-10"
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 24 24" className="h-full w-full text-fuchsia-400">
            <path
              fill="currentColor"
              d="M14,17H7V15H14V17M17,13H7V11H17V13M17,9H7V7H17V9M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19Z"
            />
            <motion.path
              fill="currentColor"
              d="M15,15H7V13H15V15M19,11H7V9H19V11M19,7H7V5H19V7"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          </svg>
        </motion.div>

        {/* Edit Cursor Animation */}
        <motion.div
          className="absolute bottom-[30%] right-[35%] h-16 w-16 opacity-20 dark:opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 24 24" className="h-full w-full text-violet-400">
            <path
              fill="currentColor"
              d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
            />
          </svg>
        </motion.div>

        {/* AI Brain Icon */}
        <motion.div
          className="absolute top-1/3 right-[25%] h-20 w-20 opacity-20 dark:opacity-10"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 24 24" className="h-full w-full text-violet-500">
            <path
              fill="currentColor"
              d="M13 3C9.23 3 6.19 5.95 6 9.66L4.08 12.19C3.84 12.5 4.06 13 4.5 13H6V16C6 17.11 6.89 18 8 18H9V21H16V16.31C18.37 15.19 20 12.8 20 10C20 6.14 16.88 3 13 3M14 14H12V12H14V14M15.75 8.81C15.46 9.21 15.09 9.5 14.64 9.74C14.39 9.9 14.22 10.07 14.13 10.26C14.04 10.45 14 10.69 14 11H12C12 10.45 12.11 10 12.33 9.63C12.55 9.25 12.92 8.91 13.45 8.59C13.85 8.35 14.15 8.1 14.34 7.82C14.53 7.55 14.62 7.25 14.62 6.92C14.62 6.56 14.5 6.28 14.26 6.07C14 5.86 13.65 5.76 13.19 5.76C12.76 5.76 12.41 5.86 12.14 6.05C11.87 6.25 11.72 6.54 11.7 6.93H9.66C9.69 6.04 10.01 5.37 10.61 4.91C11.21 4.44 12.05 4.21 13.11 4.21C14.15 4.21 14.97 4.45 15.56 4.95C16.15 5.44 16.45 6.09 16.45 6.89C16.45 7.5 16.22 8.1 15.75 8.81Z"
            />
          </svg>
        </motion.div>

        {/* Career Icon */}
        <motion.div
          className="absolute bottom-[20%] left-[30%] h-16 w-16 opacity-20 dark:opacity-10"
          animate={{
            x: [0, 15, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 24 24" className="h-full w-full text-indigo-500">
            <path
              fill="currentColor"
              d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V8A2,2 0 0,1 4,6H8V4A2,2 0 0,1 10,2M14,6V4H10V6H14Z"
            />
          </svg>
        </motion.div>

        {/* Decorative Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `linear-gradient(135deg, ${i % 2 ? "rgb(139, 92, 246)" : "rgb(192, 132, 252)"
                  }, transparent)`,
              }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Connection Line Effect */}
        <svg className="absolute inset-0 h-full w-full opacity-20 dark:opacity-10">
          <motion.path
            d="M100,100 Q200,150 300,100 T500,100"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}