import { ArrowDown, ArrowUp } from "lucide-react"
import { Button } from "@/web/components/shadcn-ui/button"
import { cn } from "@/web/lib/utils"
import { useLenis } from "lenis/react"

type NavigationButtonsProps = {
  className?: string
}

export function NavigationButtons({ className }: NavigationButtonsProps) {
  const lenis = useLenis()

  const scrollToForm = () => {
    lenis?.scrollTo('#resume-form', {
      offset: -70,
      duration: 1.5,
    })
  }

  const scrollToPreview = () => {
    lenis?.scrollTo('#resume-preview', {
      offset: -70,
      duration: 1.5,
    })
  }

  return (
    <div className={cn(
      "fixed bottom-4 right-4 flex flex-col gap-2 md:hidden",
      className
    )}>
      <Button
        size="icon"
        variant="secondary"
        onClick={scrollToForm}
        className={cn(
          "rounded-full shadow-lg",
          "bg-violet-100 hover:bg-violet-200",
          "dark:bg-violet-900/50 dark:hover:bg-violet-800/50",
          "text-violet-600 dark:text-violet-300"
        )}
      >
        <ArrowUp className="size-4" />
      </Button>

      <Button
        size="icon"
        variant="secondary"
        onClick={scrollToPreview}
        className={cn(
          "rounded-full shadow-lg",
          "bg-violet-100 hover:bg-violet-200",
          "dark:bg-violet-900/50 dark:hover:bg-violet-800/50",
          "text-violet-600 dark:text-violet-300"
        )}
      >
        <ArrowDown className="size-4" />
      </Button>
    </div>
  )
} 