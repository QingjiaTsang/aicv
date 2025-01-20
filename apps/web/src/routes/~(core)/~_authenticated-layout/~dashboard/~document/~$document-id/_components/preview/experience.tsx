import { Skeleton } from "@/web/components/shadcn-ui/skeleton"
import { SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema"
import { format } from "date-fns"

type ExperienceProps = {
  document: SelectDocumentWithRelationsSchema
}

export default function Experience({ document }: ExperienceProps) {
  return (
    <div className="flex flex-col items-center my-8">
      <div className="text-lg font-bold" style={{ color: document.themeColor }}>
        Professional Experience
      </div>
      <div className="w-full my-2 border-b-[3px]" style={{ borderColor: document.themeColor }} />

      <div className="flex flex-col gap-4 w-full">
        {document.experience?.map((exp) => (
          <ExperienceItem
            key={exp?.id}
            experience={exp}
            themeColor={document.themeColor}
          />
        ))}
      </div>
    </div>
  )
}

function ExperienceItem({ experience, themeColor }: {
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
            {experience?.startDate ? format(experience.startDate, "MMM yyyy") : "Start Date"}
            {" - "}
            {experience?.isCurrentlyEmployed ? "Present" : experience?.endDate ? format(experience.endDate, "MMM yyyy") : "End Date"}
          </div>
        </div>

        <div className="text-sm">
          {experience?.companyName}, {experience?.city}, {experience?.state}
        </div>
      </div>

      {experience?.workSummary && (
        <div
          className="text-sm leading-[1.6] break-words"
          dangerouslySetInnerHTML={{ __html: experience.workSummary }}
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
