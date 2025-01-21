import { Skeleton } from "@/web/components/shadcn-ui/skeleton"
import { QUILL_CONTENT_CLASSES } from "@/web/lib/constants"
import { cn } from "@/web/lib/utils"
import { SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema"

type SummaryProps = {
  document: SelectDocumentWithRelationsSchema
}

export default function Summary({ document }: SummaryProps) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: document.summary || "Enter a brief introduction of your professional background" }}
      className={cn(
        ...QUILL_CONTENT_CLASSES,
        "text-sm leading-[1.6] break-all"
      )}
    />
  )
}


export function SummarySkeleton() {
  return (
    <div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[80%]" />
      </div>

      <Skeleton className="my-2 h-[2px] w-full" />
    </div>
  )
}