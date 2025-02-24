import { motion } from "framer-motion"
import { FileText, Settings, Upload } from "lucide-react"
import { cn } from "@/web/lib/utils"
import { useTranslation } from 'react-i18next'

const useSteps = () => {
  const { t } = useTranslation()
  
  return [
    {
      name: t('howItWorks.steps.upload.title'),
      description: t('howItWorks.steps.upload.description'),
      icon: Upload,
    },
    {
      name: t('howItWorks.steps.customize.title'),
      description: t('howItWorks.steps.customize.description'),
      icon: Settings,
    },
    {
      name: t('howItWorks.steps.download.title'),
      description: t('howItWorks.steps.download.description'),
      icon: FileText,
    },
  ]
}

const StepConnector = () => (
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    className="absolute top-16 -z-10 hidden h-[2px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:block"
  />
);

const StepIndicator = ({ Icon }: { Icon: typeof Upload }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={cn(
      "flex size-16 items-center justify-center rounded-full",
      "bg-gradient-to-br from-primary to-purple-600 shadow-lg",
      "border-2 border-primary/20 backdrop-blur-sm",
      "transition-all duration-300 hover:shadow-primary/20"
    )}
  >
    <Icon className="size-7 text-primary-foreground" />
  </motion.div>
);

export function HowItWorksSection() {
  const { t } = useTranslation()
  const steps = useSteps()
  
  return (
    <section className="bg-muted/50 py-10 sm:py-20 px-5">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('howItWorks.title')}
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {t('howItWorks.description')}
          </p>
        </motion.div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="relative grid gap-16 lg:grid-cols-3 px-4">
            <StepConnector />
            {steps.map((step, index) => (
              <motion.div key={step.name} className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <StepIndicator Icon={step.icon} />
                <h3 className="mt-8 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                  {step.name}
                </h3>
                <p className="mt-4 text-muted-foreground/90">{step.description}</p>
                <div className="absolute right-0 top-0 text-3xl font-bold text-muted-foreground/20">
                  0{index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
