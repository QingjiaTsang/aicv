import { motion } from "framer-motion"
import { Button } from "@/web/components/shadcn-ui/button"
import { ArrowRight } from "lucide-react"
import { FaGithub } from "react-icons/fa";
import { AnimatedShinyText } from "@/web/components/magicui/animated-shiny-text"
import { useTranslation } from 'react-i18next'
import { useNavigate } from "@tanstack/react-router"
import { cn } from "@/web/lib/utils";

export function HeroSection() {
  const { t } = useTranslation()

  const navigate = useNavigate()
  
  return (
    <section className="relative overflow-hidden bg-background py-6 sm:py-12 px-5">
      {/* bg light from left top */}
      <div className={cn(
        "absolute -left-1/4 -top-1/4 size-1/2",
        "bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10",
        "dark:from-violet-500/5 dark:to-fuchsia-500/5",
        "rounded-full blur-3xl"
      )} />
      {/* bg light from right bottom */}
      <div className={cn(
        "absolute -right-1/4 -bottom-1/4 size-1/2",
        "bg-gradient-to-br from-primary/10 to-purple-500/10",
        "dark:from-primary/5 dark:to-purple-500/5",
        "rounded-full blur-3xl"
      )} />

      <div className="container relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-block mb-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200/30 dark:border-blue-700/40 bg-blue-100/50 dark:bg-blue-900/20 backdrop-blur-sm"
            >
              <span className="flex size-2">
                <span className="animate-ping absolute size-2 rounded-full bg-blue-400 opacity-75" />
                <span className="relative size-2 rounded-full bg-blue-500" />
              </span>
              <div className="text-sm text-blue-700 dark:text-blue-300 flex items-center">
                <span className="mr-2">{t('hero.poweredBy')}</span>
                <img src="/images/deepseek.png" alt="DeepSeek" className="size-4" />
              </div>
            </motion.div>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <AnimatedShinyText>{t('hero.title')}</AnimatedShinyText>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 lg:whitespace-nowrap flex justify-center">
            {t('hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate({ to: '/dashboard', search: { search: '', status: undefined } })}
              className="group bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 dark:from-violet-500 dark:to-purple-500 text-white shadow-lg hover:shadow-primary/25 transition-all duration-300"
            >
              {t('hero.buttons.getStarted')}
              <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              asChild
              className="border-violet-200 dark:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/30"
            >
              <a
                href="https://github.com/QingjiaTsang/aicv" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                {t('hero.buttons.viewSource')}
                <FaGithub className="ml-2 size-4" />
              </a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mt-8 mx-auto max-w-4xl"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/20 to-blue-500/20 dark:from-violet-500/10 dark:to-purple-500/10 blur-3xl transform-gpu" />
          <div className="relative">
            <img
              src="/images/macbook-screenshot.png"
              alt="Resume Builder Interface"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}