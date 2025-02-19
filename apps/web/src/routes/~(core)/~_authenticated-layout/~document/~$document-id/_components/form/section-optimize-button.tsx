import { Sparkles } from 'lucide-react'
import { Button } from '@/web/components/shadcn-ui/button'
import { cn } from '@/web/lib/utils'
import { OptimizeResumeChat } from '../page-header/actions/resume-optimizer-chatbox/optimize-resume-chat'
import { SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema"
import { useState } from 'react'

type SectionOptimizeButtonProps = {
  document: SelectDocumentWithRelationsSchema
  section: 'summary' | 'experience'
  className?: string
}

export function SectionOptimizeButton({ document, section, className }: SectionOptimizeButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        type="button"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={cn(
          // Gradient background
          "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-500",
          "dark:from-violet-600 dark:via-fuchsia-600 dark:to-purple-600",
          "hover:from-violet-600 hover:via-fuchsia-600 hover:to-purple-600",
          "dark:hover:from-violet-500 dark:hover:via-fuchsia-500 dark:hover:to-purple-500",
          
          // Text style
          "text-white font-medium",
          
          // Glow effect
          "shadow-lg shadow-violet-500/25",
          "hover:shadow-violet-500/50",
          "dark:shadow-violet-800/20",
          "dark:hover:shadow-violet-800/40",
          
          // Animation effects
          "transition-all duration-300",
          "hover:scale-105",
          "active:scale-95",
          
          // Border radius and border
          "rounded-full",
          "border border-violet-400/30",
          
          // Internal layout
          "flex items-center gap-1.5",
          "px-3",
          
          className
        )}
      >
        <Sparkles className={cn(
          "size-4",
          "animate-pulse",
          "text-white/90"
        )} />
        <span className="relative">
          Ask AI
          {/* Add shine effect */}
          <span className={cn(
            "absolute inset-0",
            "bg-gradient-to-r from-transparent via-white/25 to-transparent",
            "animate-[shine_2s_linear_infinite]",
          )} />
        </span>
      </Button>

      <OptimizeResumeChat
        key={`optimize-${section}`}
        document={{
          ...document,
          // Keep only the corresponding section content as resume context to AI
          summary: section === 'summary' ? document.summary : '',
          experience: section === 'experience' ? document.experience : [],
          education: [],
          skills: []
        }}
        section={section}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
} 