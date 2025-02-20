import { SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema"
import { Skeleton } from "@/web/components/shadcn-ui/skeleton"
import { useMemo } from "react"
import { DraggableSection } from "@/web/components/draggable-section"
import { useSortableItems } from "@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/hooks/use-sortable-items"
import { useTranslation } from 'react-i18next'

type SkillsProps = {
  document: SelectDocumentWithRelationsSchema
  isDraggable?: boolean
}

export default function Skills({ document, isDraggable = false }: SkillsProps) {
  const { t } = useTranslation()
  const { handleMove } = useSortableItems(document.id, 'skills')

  const sortedSkills = useMemo(() => {
    return document.skills.sort((a, b) => (a?.displayOrder || 0) - (b?.displayOrder || 0))
  }, [document.skills])

  return (
    <div className="flex flex-col items-center my-8">
      <div className="text-lg font-bold" style={{ color: document.themeColor }}>
        {t('resume.editor.sections.skills')}
      </div>

      <div className="w-full my-2 border-b-[3px]" style={{ borderColor: document.themeColor }} />

      <div className="w-full flex flex-wrap gap-4">
        {sortedSkills?.map((skill, index) => (
          <div className="w-[calc(50%-8px)]" key={skill?.id}>
            {isDraggable ? (
              <DraggableSection
                key={skill?.id}
                type="SKILL_ITEM"
                index={index}
                onMove={handleMove}
              >
                <SkillItem
                  key={skill?.id}
                  skill={skill}
                  themeColor={document.themeColor}
                />
              </DraggableSection>
            ) : (
              <SkillItem
                key={skill?.id}
                skill={skill}
                themeColor={document.themeColor}
              />
            )}
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
  const { t } = useTranslation()
  
  const getProficiencyLabel = (rating: number) => {
    return t(`document.skills.proficiencyLevels.${rating}`)
  }

  return (
    <div className="w-full group">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium truncate max-w-[70%]">
          {skill?.name || t('document.skills.form.placeholders.skillName')}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {getProficiencyLabel(skill?.rating || 0)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
            {skill?.rating || 0}/5
          </span>
        </div>
      </div>

      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500 group-hover:opacity-90 rounded-full"
          style={{
            width: `${((skill?.rating || 0) / 5) * 100}%`,
            background: `linear-gradient(90deg, ${themeColor}80, ${themeColor})`,
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

