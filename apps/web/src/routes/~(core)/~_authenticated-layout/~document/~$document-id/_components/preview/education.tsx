import { useMemo } from "react"
import { Skeleton } from "@/web/components/shadcn-ui/skeleton"
import { SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema"
import { DraggableSection } from '@/web/components/draggable-section'
import { format } from "date-fns"
import { useSortableItems } from '@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/hooks/use-sortable-items'

type EducationProps = {
  document: SelectDocumentWithRelationsSchema
  isDraggable?: boolean
}

export default function Education({ document, isDraggable = false }: EducationProps) {
  const { handleMove } = useSortableItems(document.id, 'education')

  const sortedEducation = useMemo(() => {
    return document.education.sort((a, b) => (a?.displayOrder || 0) - (b?.displayOrder || 0))
  }, [document.education])

  return (
    <div className="flex flex-col items-center my-8">
      <div className="text-lg font-bold" style={{ color: document.themeColor }}>
        Education
      </div>
      <div className="w-full my-2 border-b-[3px]" style={{ borderColor: document.themeColor }} />

      <div className="w-full flex flex-col gap-4">
        {sortedEducation?.map((edu, index) => (
          isDraggable ? (
            <DraggableSection
              key={edu?.id}
              type="EDUCATION_ITEM"
              index={index}
              onMove={handleMove}
            >
              <EducationItem
                key={edu?.id}
                education={edu}
                themeColor={document.themeColor}
              />
            </DraggableSection>
          ) : (
            <EducationItem
              key={edu?.id}
              education={edu}
              themeColor={document.themeColor}
            />
          )
        ))}
      </div>
    </div>
  )
}

function EducationItem({ education, themeColor }: {
  education: SelectDocumentWithRelationsSchema['education'][0],
  themeColor: string
}) {
  return (

    <div className="w-full flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <div className="max-w-[368px] text-sm font-bold" style={{ color: themeColor }}>
            {education?.universityName || "University Name"}
          </div>

          <div className="text-sm">
            {education?.startDate ?? "Start Date"}
            {" - "}
            {education?.endDate ?? "End Date"}
          </div>
        </div>

        <div className="text-sm">
          {education?.degree || "Degree"}
        </div>
      </div>

      {education?.description && (
        <div
          dangerouslySetInnerHTML={{ __html: education.description }}
          className="ql-content"
        />
      )}
    </div>
  )
}

export function EducationSkeleton() {
  return (
    <div className="flex flex-col items-center my-8">
      <Skeleton className="h-7 w-32 mb-2" />

      <div className="flex flex-col gap-6 w-full">
        {Array.from({ length: 1 }).map((_, index) => (
          <div key={index} className="w-full">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-48" />

              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>

              <div className="space-y-2 mt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[95%]" />
                <Skeleton className="h-4 w-[90%]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
