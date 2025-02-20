import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";
import { cn } from "@/web/lib/utils";
import { useTranslation } from 'react-i18next';

type GlobalPendingProps = {
  className?: string;
};

export function GlobalPending({ className }: GlobalPendingProps) {
  const { t } = useTranslation();

  return (
    <div className={cn(
      "h-[calc(100dvh-97px)] w-full flex items-center justify-center",
      className
    )}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-4"
      >
        <motion.div className="relative flex justify-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FileText className="size-16 text-violet-600 dark:text-violet-400" />
          </motion.div>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="size-6 text-violet-400" />
          </motion.div>
        </motion.div>

        <motion.p
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-violet-600 dark:text-violet-400 text-sm md:text-base"
        >
          {t('common.loading')}
        </motion.p>
      </motion.div>
    </div>
  );
} 