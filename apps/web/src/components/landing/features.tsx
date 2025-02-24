import { cn } from "@/web/lib/utils"
import { motion } from "framer-motion"
import {
  Brain,
  FileText,
  Layout,
  LucideIcon,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react"
import { useTranslation } from 'react-i18next'

type Feature = {
  name: string
  description: string
  icon: LucideIcon
}

const useFeatures = () => {
  const { t } = useTranslation()
  
  return [
    {
      name: t('features.items.aiSuggestions.title'),
      description: t('features.items.aiSuggestions.description'),
      icon: Brain,
    },
    {
      name: t('features.items.atsTemplates.title'),
      description: t('features.items.atsTemplates.description'),
      icon: FileText,
    },
    {
      name: t('features.items.smartFormatting.title'),
      description: t('features.items.smartFormatting.description'),
      icon: Layout,
    },
    {
      name: t('features.items.keywordOptimization.title'),
      description: t('features.items.keywordOptimization.description'),
      icon: Target,
    },
    {
      name: t('features.items.realTimePreview.title'),
      description: t('features.items.realTimePreview.description'),
      icon: Sparkles,
    },
    {
      name: t('features.items.oneStyling.title'),
      description: t('features.items.oneStyling.description'),
      icon: Wand2,
    },
  ] as const
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const FeatureCard = ({ feature }: { feature: Feature }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
    viewport={{ once: true }}
    className="group relative h-full"
  >
    <div className="relative h-full transform-gpu transition-transform duration-300 group-hover:-translate-y-2">
      <div 
        className={cn(
          "absolute -inset-0.5 rounded-2xl blur-xl",
          "bg-gradient-to-br from-primary/30 via-purple-500/30 to-blue-500/30",
          "opacity-0 transition-opacity duration-300 group-hover:opacity-70",
          "dark:from-primary/20 dark:via-purple-500/20 dark:to-blue-500/20"
        )} 
      />
      
      <div 
        className={cn(
          "relative h-full rounded-xl p-8 shadow-2xl backdrop-blur-lg transition-all",
          "border border-border/50 hover:border-primary/30 dark:border-border/70 dark:hover:border-primary",
          "bg-card/80 hover:bg-card/90"
        )}
      >
        <div className="flex items-start justify-between">
          <feature.icon className="size-10 text-primary transition-all duration-500 group-hover:rotate-12 group-hover:scale-125" />
          <div className="size-2 rounded-full bg-emerald-400/50 group-hover:animate-pulse" />
        </div>
        
        <h3 className="mt-6 text-xl font-semibold tracking-tight">
          {feature.name}
        </h3>
        <p className="mt-3 text-muted-foreground/90">
          {feature.description}
        </p>
      </div>
    </div>
  </motion.div>
);

export function FeaturesSection() {
  const { t } = useTranslation()
  const features = useFeatures()
  
  return (
    <section className="bg-background py-10 sm:py-20 px-5">
      <div className="container mx-auto max-w-2xl md:max-w-7xl text-center">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {t('features.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg leading-8 text-muted-foreground"
          >
            {t('features.description')}
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-7xl"
        >
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.name} feature={feature} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}