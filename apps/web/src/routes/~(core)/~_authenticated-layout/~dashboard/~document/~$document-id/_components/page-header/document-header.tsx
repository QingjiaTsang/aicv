import { SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema"
import { DocumentHeaderTitle } from '@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/page-header/document-header-title'
import { DocumentHeaderActions } from '@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/page-header/document-header-actions'
import { cn } from "@/web/lib/utils"

type DocumentHeaderProps = {
  document: SelectDocumentWithRelationsSchema
}

export function DocumentHeader({ document }: DocumentHeaderProps) {
  return (
    <div
      className={cn(
        "h-16 flex items-center justify-between px-4",
        "border-b border-gray-200 dark:border-gray-800",
        "bg-white dark:bg-gray-900"
      )}
    >
      <DocumentHeaderTitle document={document} />
      <DocumentHeaderActions document={document} />
    </div>
  )
}