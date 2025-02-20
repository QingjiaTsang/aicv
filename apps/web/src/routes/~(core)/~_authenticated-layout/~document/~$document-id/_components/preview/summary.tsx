import { Skeleton } from "@/web/components/shadcn-ui/skeleton"
import { SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema"
import { useTranslation } from 'react-i18next'

type SummaryProps = {
  document: SelectDocumentWithRelationsSchema
}

export default function Summary({ document }: SummaryProps) {
  const { t } = useTranslation()

  return (
    <>
      {document.summary ? (
        <div
          dangerouslySetInnerHTML={{ __html: document.summary }}
          className="ql-content"
        />
      ) : (
        <div className="ql-content text-muted-foreground">
          {t('document.form.placeholders.summary')}
        </div>
      )}
    </>
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