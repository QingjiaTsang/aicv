import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";

import { Button } from "@/web/components/shadcn-ui/button";
import { Card } from "@/web/components/shadcn-ui/card";
import { HeroIllustration } from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/_components/hero-illustration";

export function DashboardHero() {
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-violet-50/50 via-fuchsia-50/50 to-purple-50/50 dark:from-violet-950/50 dark:via-fuchsia-950/50 dark:to-purple-950/50 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] dark:opacity-[0.05]" />
      <div className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-gradient-to-br from-violet-500/10 to-transparent dark:from-violet-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-6 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-purple-600 dark:from-violet-400 dark:via-fuchsia-400 dark:to-purple-400 bg-clip-text text-transparent">
                AI Resume Builder
              </h1>
              <p className="text-lg text-muted-foreground">
                Create a professional resume, let AI help you showcase your best career image
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-violet-500" />
                <span>AI-powered suggestions to optimize your content</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 dark:from-violet-500 dark:to-purple-500 text-white shadow-lg hover:shadow-violet-500/25 transition-all duration-300"
              >
                <FileText className="mr-2 h-5 w-5" />
                Create New Resume
              </Button>
              {/* TODO: reconsider wheter to add this button */}
              {/* <Button
                variant="outline"
                size="lg"
                className="border-violet-200 dark:border-violet-800 hover:border-violet-300 dark:hover:border-violet-700"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                AI Optimization Suggestions
              </Button> */}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden md:block flex-shrink-0"
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </div>
    </Card>
  );
}