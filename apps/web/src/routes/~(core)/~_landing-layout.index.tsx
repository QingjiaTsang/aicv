import { AIShowcaseSection } from '@/web/components/landing/ai-showcase';
import { FeaturesSection } from '@/web/components/landing/features';
import { HeroSection } from '@/web/components/landing/hero';
import { HowItWorksSection } from '@/web/components/landing/how-it-works';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(core)/_landing-layout/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="relative min-h-dvh bg-background">
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AIShowcaseSection />
      </main>

      <footer className="border-t pt-8">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © 2025 AICV. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
