import queryClient from '@/web/lib/query-client'
import ResumePreview from '@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/preview/resume-preview'
import { publicDocumentQueryOptionsFn } from '@/web/services/documents/queries'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { cn } from '@/web/lib/utils'

export const Route = createFileRoute('/(core)/(public)/preview/$document-id')({
  component: RouteComponent,
  loader: ({ params }) =>
    queryClient.ensureQueryData(
      publicDocumentQueryOptionsFn(params['document-id']),
    ),
})

function RouteComponent() {
  const params = useParams({ from: Route.id })
  const { data: document } = useSuspenseQuery(
    publicDocumentQueryOptionsFn(params['document-id']),
  )

  return (
    <>
      <DocumentPreviewHeader
        title={`${document.title || 'Untitled Resume'}.pdf`}
        className="sticky top-0 z-10"
      />

      <div className="max-w-3xl mx-auto">
        <div className="px-4 pt-4">
          <div
            className={cn(
              'p-10 shadow-lg border-t-[12px] dark:border',
              'rounded-md bg-white dark:bg-gray-950',
            )}
            style={{ borderTop: `12px solid ${document.themeColor}` }}
          >
            <ResumePreview document={document} isDraggable={false} />
          </div>
        </div>
      </div>
    </>
  )
}

type DocumentPreviewHeaderProps = {
  title: string
  className?: string
}
export function DocumentPreviewHeader({
  title,
  className,
}: DocumentPreviewHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 p-4 bg-white dark:bg-gray-950 border-b dark:border-gray-800',
        className,
      )}
    >
      <img
        src="/images/pdf_icon.png"
        alt="PDF icon"
        width={20}
        height={20}
        className="object-contain ml-2 md:ml-4"
      />
      <span className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-200">
        {title}
      </span>
    </div>
  )
}
