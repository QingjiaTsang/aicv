import { cn } from '@/web/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/web/components/shadcn-ui/tooltip"
import { ButtonHTMLAttributes, forwardRef } from 'react'

type TooltipButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tooltip: string
  children: React.ReactNode
}

export const TooltipButton = forwardRef<HTMLButtonElement, TooltipButtonProps>(
  ({ tooltip, children, className, ...props }, ref) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              ref={ref}
              className={cn(
                "group relative rounded-lg p-2 transition-colors hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-900/20 dark:hover:text-violet-400",
                className
              )}
              {...props}
            >
              {children}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
)

TooltipButton.displayName = 'TooltipButton' 