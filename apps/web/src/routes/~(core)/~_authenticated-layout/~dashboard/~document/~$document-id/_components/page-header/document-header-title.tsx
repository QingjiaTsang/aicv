import { FileText } from 'lucide-react'
import { type SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema"
import { getStatusIcon } from '@/web/routes/~(core)/~_authenticated-layout/~dashboard/utils/getStatusIcon'

type DocumentTitleProps = {
  document: SelectDocumentWithRelationsSchema
}

export function DocumentHeaderTitle({ document }: DocumentTitleProps) {
  return (
    <div className="max-w-[70%] flex items-center gap-2 sm:gap-3">
      <FileText className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-violet-500 dark:text-violet-400" />
      <div className="w-full flex items-center gap-2">
        <h1 className="truncate text-base sm:text-lg font-medium text-gray-900 dark:text-gray-50">
          {document.title}
        </h1>
        {getStatusIcon(document.status)}
      </div>
    </div>
  )
} 