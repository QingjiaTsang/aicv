import { useMemo } from "react"
import { Skeleton } from "@/web/components/shadcn-ui/skeleton"
import { SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema"
import { DraggableSection } from '@/web/components/draggable-section'
import { format } from "date-fns"
import { useSortableItems } from '@/web/hooks/use-sortable-items'

type ExperienceProps = {
  document: SelectDocumentWithRelationsSchema
  isDraggable?: boolean
}

export default function Experience({ document, isDraggable = false }: ExperienceProps) {
  const { handleMove } = useSortableItems(document.id, 'experience')

  const sortedExperience = useMemo(() => {
    return document.experience.sort((a, b) => (a?.displayOrder || 0) - (b?.displayOrder || 0))
  }, [document.experience])

  return (
    <div className="flex flex-col items-center my-8">
      <div className="text-lg font-bold" style={{ color: document.themeColor }}>
        Professional Experience
      </div>
      <div className="w-full my-2 border-b-[3px]" style={{ borderColor: document.themeColor }} />

      <div className="w-full flex flex-col gap-4">
        {sortedExperience?.map((exp, index) => (
          isDraggable ? (
            <DraggableSection
              key={exp?.id}
              type="EXPERIENCE_ITEM"
              index={index}
              onMove={handleMove}
            >
              <ExperienceItem
                key={exp?.id}
                experience={exp}
                themeColor={document.themeColor}
              />
            </DraggableSection>
          ) : (
            <ExperienceItem
              key={exp?.id}
              experience={exp}
              themeColor={document.themeColor}
            />
          )
        ))}
      </div>
    </div>
  )
}

export function ExperienceItem({ experience, themeColor }: {
  experience: SelectDocumentWithRelationsSchema['experience'][0],
  themeColor: string
}) {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <div className="max-w-[368px] text-base font-bold" style={{ color: themeColor }}>
            {experience?.title || "Position Title"}
          </div>

          <div className="text-sm">
            {experience?.startDate ?? "Start Date"}
            {" - "}
            {experience?.isCurrentlyEmployed ? "Present" : experience?.endDate ?? "End Date"}
          </div>
        </div>

        <div className="text-sm">
          {experience?.companyName}, {experience?.city}, {experience?.state}
        </div>
      </div>

      {experience?.workSummary && (
        <div
          dangerouslySetInnerHTML={{ __html: experience.workSummary }}
          className="ql-content"
        />
      )}
    </div>
  )
}

export function ExperienceSkeleton() {
  return (
    <div className="flex flex-col items-center my-8">
      <Skeleton className="h-7 w-48 mb-2" />

      <div className="flex flex-col gap-6 w-full">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="w-full">
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-24" />
            </div>

            <div className="space-y-2 mt-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[95%]" />
              <Skeleton className="h-4 w-[90%]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
