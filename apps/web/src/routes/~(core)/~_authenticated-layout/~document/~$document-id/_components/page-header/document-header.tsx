import { SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema"
import { DocumentHeaderTitle } from '@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/page-header/document-header-title'
import { DocumentHeaderActions } from '@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/page-header/document-header-actions'
import { cn } from "@/web/lib/utils"
import { useRouter } from "@tanstack/react-router"
import { Button } from "@/web/components/shadcn-ui/button"
import { ArrowLeft } from "lucide-react"

type DocumentHeaderProps = {
  id?: string
  document: SelectDocumentWithRelationsSchema
}

export function DocumentHeader({ id, document }: DocumentHeaderProps) {
  const router = useRouter()

  return (
    <div
      id={id}
      className={cn(
        "h-16 flex items-center justify-between",
        "border-b border-gray-200 dark:border-gray-800",
        "bg-white dark:bg-gray-900"
      )}
    >
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.history.back()}
          className={cn(
            "hover:bg-violet-100/50 dark:hover:bg-violet-900/50",
            "text-violet-600 dark:text-violet-400",
            "transition-colors duration-200"
          )}
        >
          <ArrowLeft />
        </Button>
        <DocumentHeaderTitle document={document} />
      </div>
      <DocumentHeaderActions document={document} />
    </div>
  )
}