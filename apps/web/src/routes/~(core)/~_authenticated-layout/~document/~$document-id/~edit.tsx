import queryClient from '@/web/lib/query-client'
import { documentQueryOptionsFn } from '@/web/services/documents/queries'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { DocumentHeader } from '@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/page-header/document-header'

import ResumeForm from '@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/form/resume-form'
import ResumePreview from '@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/preview/resume-preview'
import { cn } from '@/web/lib/utils'
import { NavigationButtons } from '@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/navigation-buttons'
import { useLeavePageActions } from '@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/hooks/use-leave-page-actions'

export const Route = createFileRoute(
  '/(core)/_authenticated-layout/document/$document-id/edit',
)({
  component: RouteComponent,
  loader: ({ params }) =>
    queryClient.ensureQueryData(documentQueryOptionsFn(params['document-id'])),
})

function RouteComponent() {
  const params = useParams({ from: Route.id })
  const { data: document } = useSuspenseQuery(
    documentQueryOptionsFn(params['document-id']),
  )

  useLeavePageActions(params['document-id'])


  // TODO: (lowest priority) add user customizable section with editor that can output formatted text
  return (
    <div className="h-full w-full flex flex-col container mx-auto max-w-6xl">
      <DocumentHeader id="resume-form" document={document} />

      <div className="flex-1">
        <div className="p-4 flex md:flex-row flex-col gap-4">
          {/* edit form */}
          <div
            className={cn(
              'flex-1 border-t-4 shadow-md rounded-md',
              'border-t-primary',
              'dark:bg-card dark:border',
              'dark:border-gray-800',
            )}
            style={{ borderTopLeftRadius: `12px solid ${document.themeColor}` }}
          >
            <ResumeForm document={document} />
          </div>

          {/* preview */}
          <div
            id="resume-preview"
            className={`flex-1 w-full p-10 shadow-lg border-t-[12px] dark:border`}
            style={{ borderTop: `12px solid ${document.themeColor}` }}
          >
            <ResumePreview document={document} isDraggable={true} />
          </div>
        </div>
      </div>

      <NavigationButtons />
    </div>
  )
}
