import { cn } from "@/web/lib/utils"

type ResumePreviewTooltipProps = {
  imageUrl: string | null
  isHovered: boolean
}

export function ResumePreviewTooltip({ imageUrl, isHovered }: ResumePreviewTooltipProps) {
  if (!imageUrl) {
    return null
  }

  return (
    <div className={cn(
      "hidden md:block",
      "absolute bottom-[68px] left-1/2 -translate-x-1/2 ",
      "w-64 rounded-lg overflow-hidden",
      "shadow-xl dark:shadow-violet-500/5",
      "border border-violet-200/50 dark:border-violet-700/30",
      "bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm",
      "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
      "z-50 pointer-events-none",
      "scale-[0.6]",
      isHovered ? "opacity-100" : "opacity-0"
    )}>
      <img
        src={imageUrl}
        alt="Resume preview"
        className="w-full aspect-[1/1.5] object-fill"
      />
    </div>
  )
} 