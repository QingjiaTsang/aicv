import { Sparkles } from 'lucide-react'
import { TooltipButton } from '@/web/components/tooltip-button'
import { OptimizeResumeChat } from './resume-optimizer-chatbox/optimize-resume-chat'
import { SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema"
import { cn } from '@/web/lib/utils'
import { useMediaQuery } from '@/web/hooks/use-media-query'
import { useTranslation } from 'react-i18next'

type OptimizeResumeActionProps = {
  document: SelectDocumentWithRelationsSchema
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function OptimizeResumeAction({ document, isOpen, onOpenChange }: OptimizeResumeActionProps) {
  const { t } = useTranslation()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (!isDesktop) {
    return (
      <OptimizeResumeChat
        document={document}
        section="all"
        isOpen={isOpen}
        onClose={() => onOpenChange(false)}
      />
    )
  }

  return (
    <>
      <TooltipButton
        tooltip={t('optimize.button.tooltip')}
        onClick={() => onOpenChange(true)}
        className={cn(
          "hover:text-violet-500 dark:hover:text-violet-400",
          "transition-colors duration-200"
        )}
      >
        <Sparkles className="size-4 sm:size-5" />
      </TooltipButton>

      <OptimizeResumeChat
        document={document}
        section="all"
        isOpen={isOpen}
        onClose={() => onOpenChange(false)}
      />
    </>
  )
} 