import { motion } from "framer-motion"
import { Button } from "@/web/components/shadcn-ui/button"
import { Check, Sparkles } from "lucide-react"
import { useTranslation } from 'react-i18next'
import { useNavigate } from "@tanstack/react-router"
import { cn } from "@/web/lib/utils"

const useFeatures = () => {
  const { t } = useTranslation()
  return [
    t('aiShowcase.features.recommendations'),
    t('aiShowcase.features.keywords'),
    t('aiShowcase.features.tone'),
    t('aiShowcase.features.skills'),
  ]
}

export function AIShowcaseSection() {
  const { t } = useTranslation()

  const navigate = useNavigate()

  const features = useFeatures()
  
  return (
    <section className="relative overflow-hidden bg-background py-10 sm:py-20 px-5">
      <div className="container mx-auto">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-40 gap-y-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:pr-8"
          >
            <div className="lg:max-w-lg">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t('aiShowcase.title')}
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                {t('aiShowcase.description')}
              </p>
              <div className="mt-8">
                <ul className="space-y-4">
                  {features.map((feature) => (
                    <AICard key={feature} text={feature} />
                  ))}
                </ul>
                <div className="mt-10">
                  <Button
                    size="lg"
                    onClick={() => navigate({ to: '/dashboard', search: { search: '', status: undefined } })}
                    className={cn(
                      "group rounded-full px-8 text-lg font-semibold",
                      "bg-gradient-to-r from-primary to-purple-600",
                      "shadow-lg transition-all hover:shadow-primary/30"
                    )}
                  >
                    <span className="bg-gradient-to-r from-white/90 to-white bg-clip-text text-transparent">
                      {t('aiShowcase.button')}
                    </span>
                    <Sparkles className="ml-2 size-5 transition-transform group-hover:rotate-180" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ rotate: 2, scale: 1.02 }}
            className="lg:pl-8 flex justify-center items-center"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-purple-600/20 blur-md sm:blur-3xl transform-gpu" />
                <div className="relative">
                  <img
                    src="/images/mobile-screenshot.png"
                    alt="Resume Builder Interface"
                    className="h-[600px]"
                  />
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const AICard = ({ text }: { text: string }) => (
  <motion.li
    className="flex items-center gap-4 rounded-xl border border-border/50 p-6 backdrop-blur-lg transition-all hover:border-primary/30"
  >
    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-all group-hover:bg-primary/20">
      <Check className="size-6 text-primary transition-transform group-hover:scale-110" />
    </div>
    <span className="text-lg font-medium text-foreground/90">{text}</span>
  </motion.li>
)