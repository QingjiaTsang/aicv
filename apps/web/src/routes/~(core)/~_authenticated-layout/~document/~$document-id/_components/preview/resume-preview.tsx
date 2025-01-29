import { type SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema";
import { useMemo } from 'react'
import { DndProvider } from 'react-dnd-multi-backend'
import { DraggableSection } from '@/web/components/draggable-section'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { MouseTransition, TouchTransition } from 'react-dnd-multi-backend'

import PersonalInfo from "@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/preview/personal-info";
import Summary from "@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/preview/summary";
import Experience from "@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/preview/experience";
import Education from "@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/preview/education";
import Skills from "@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/preview/skills";
import { useUpdateDocumentByTypeMutation } from "@/web/services/documents/mutations";



type SortableResumeSection = 'experience' | 'education' | 'skills'

type ResumePreviewProps = {
  document: SelectDocumentWithRelationsSchema
  isDraggable?: boolean
}

const customHTML5toTouch = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      transition: MouseTransition,
      preview: true
    },
    {
      id: 'touch',
      backend: TouchBackend,
      options: {
        // Prevent mis-clicks on mobile devices
        delayTouchStart: 150,
        enableMouseEvents: true
      },
      preview: true,
      transition: TouchTransition
    }
  ]
}

export default function ResumePreview({ document, isDraggable = false }: ResumePreviewProps) {
  const { mutate: updateDocumentByTypeMutation } = useUpdateDocumentByTypeMutation()

  const sections = useMemo(() => {
    const sectionOrder = document.sectionOrder
    const sections = sectionOrder.split(',')

    return sections.map((section, index) => ({
      id: section as SortableResumeSection,
      order: index,
    }))
  }, [document.sectionOrder])

  const sectionComponents = {
    experience: <Experience document={document} isDraggable={isDraggable} />,
    education: <Education document={document} isDraggable={isDraggable} />,
    skills: <Skills document={document} isDraggable={isDraggable} />,
  }

  const handleMove = (dragIndex: number, hoverIndex: number) => {
    const newSections = [...sections]
    const draggedSection = newSections[dragIndex]
    newSections.splice(dragIndex, 1)
    newSections.splice(hoverIndex, 0, draggedSection)

    // Update order
    newSections.forEach((section, index) => {
      section.order = index
    })

    updateDocumentByTypeMutation({
      id: document.id,
      document: {
        type: "document",
        data: {
          sectionOrder: newSections.map(section => section.id).join(","),
        },
      }
    })
  }

  const getSectionComponent = (sectionId: keyof typeof sectionComponents) => {
    return sectionComponents[sectionId] || null
  }

  return (
    <DndProvider options={customHTML5toTouch}>
      <div>
        {/* Fixed top sections */}
        <PersonalInfo document={document} />
        <Summary document={document} />


        {/* Sortable sections */}
        {isDraggable ? sections.map((section, index) => (
          <DraggableSection
            key={section.id}
            type={"RESUME_SECTION"}
            index={index}
            onMove={handleMove}
          >
            {getSectionComponent(section.id)}
          </DraggableSection>
        )) : sections.map((section) => (
          <div key={section.id}>
            {getSectionComponent(section.id)}
          </div>
        ))}
      </div>
    </DndProvider>
  )
}
