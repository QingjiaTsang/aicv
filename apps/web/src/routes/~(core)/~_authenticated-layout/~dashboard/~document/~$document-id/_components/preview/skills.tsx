import { SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema"
import { Skeleton } from "@/web/components/shadcn-ui/skeleton"

type SkillsProps = {
  document: SelectDocumentWithRelationsSchema
  isLoading: boolean
}

export default function Skills({ document, isLoading }: SkillsProps) {
  if (isLoading) {
    return <SkillsSkeleton />
  }

  return (
    <div className="flex flex-col items-center my-8">
      <div className="text-lg font-bold" style={{ color: document.themeColor }}>
        Skills
      </div>

      <hr className="w-full my-2 border-b-2" style={{ borderColor: document.themeColor }} />

      <div className="w-full flex flex-wrap gap-4">
        {document.skills?.map((skill, index) => (
          <div key={index} className="w-[calc(50%-8px)]">
            <SkillItem skill={skill} themeColor={document.themeColor} />
          </div>
        ))}
      </div>
    </div>
  )
}

function SkillItem({ skill, themeColor }: {
  skill: SelectDocumentWithRelationsSchema['skills'][0],
  themeColor: string
}) {
  return (
    <div className="w-full group">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium truncate max-w-[70%]">
          {skill.name || "Skill Name"}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
          {skill.rating}/5
        </span>
      </div>

      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-300 group-hover:opacity-90 rounded-full"
          style={{
            width: `${(skill.rating / 5) * 100}%`,
            backgroundColor: themeColor,
            boxShadow: `0 1px 2px ${themeColor}40`
          }}
        />
      </div>
    </div>
  )
}

export function SkillsSkeleton() {
  return (
    <div className="flex flex-col items-center my-8">
      <Skeleton className="h-7 w-24 mb-2" />

      <div className="w-full flex flex-wrap gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="w-[calc(50%-8px)]">
            <div className="w-full">
              <div className="flex justify-between items-center mb-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}