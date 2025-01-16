import { cn } from '@/web/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/web/components/shadcn-ui/tooltip"

type TooltipButtonProps = {
  icon: React.ReactNode
  label: string
  onClick: () => void
  className?: string
}

export function TooltipButton({ icon, label, onClick, className }: TooltipButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={cn(
              "group relative rounded-lg p-2 transition-colors hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-900/20 dark:hover:text-violet-400",
              className
            )}
            onClick={onClick}
          >
            {icon}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 