import { Skeleton } from "@/web/components/shadcn-ui/skeleton"
import { SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema"

type SummaryProps = {
  document: SelectDocumentWithRelationsSchema
}

export default function Summary({ document }: SummaryProps) {
  return (
    <div className="text-sm break-words">
      {document.summary || "Enter a brief introduction of your professional background"}
    </div>
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