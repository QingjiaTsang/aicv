import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";
import { useTranslation } from 'react-i18next';

export function LoadingOverlay() {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
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
        className="relative"
      >
        <FileText className="size-12 text-violet-600 dark:text-violet-400" />
        <Sparkles className="absolute -top-2 -right-2 size-4 text-violet-400 animate-pulse" />
      </motion.div>

      <p className="text-violet-600 dark:text-violet-400 animate-pulse">
        {t('loading.creatingResume')}
      </p>
    </div>
  );
}