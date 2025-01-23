import { type SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema";
import { useState } from 'react'
import { DndProvider } from 'react-dnd-multi-backend'
import { DraggableSection } from '@/web/components/draggable-section'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { MouseTransition, TouchTransition } from 'react-dnd-multi-backend'

import PersonalInfo from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/preview/personal-info";
import Summary from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/preview/summary";
import Experience from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/preview/experience";
import Education from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/preview/education";
import Skills from "@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/preview/skills";



type ResumeSection = 'personalInfo' | 'summary' | 'experience' | 'education' | 'skills'

type ResumeSectionConfig = {
  id: ResumeSection
  title: string
  order: number
}

type ResumePreviewProps = {
  document: SelectDocumentWithRelationsSchema
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

export default function ResumePreview({ document }: ResumePreviewProps) {
  const [sections, setSections] = useState<ResumeSectionConfig[]>([
    { id: 'experience', title: 'Experience', order: 0 },
    { id: 'education', title: 'Education', order: 1 },
    { id: 'skills', title: 'Skills', order: 2 },
  ])

  const sectionComponents = {
    experience: <Experience document={document} />,
    education: <Education document={document} />,
    skills: <Skills document={document} />,
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

    setSections(newSections)
  }

  const getSectionComponent = (sectionId: string) => {
    return sectionComponents[sectionId as keyof typeof sectionComponents] || null
  }

  return (
    <DndProvider options={customHTML5toTouch}>
      <div>
        {/* Fixed top sections */}
        <PersonalInfo document={document} />
        <Summary document={document} />


        {/* Draggable sections */}
        {sections.map((section, index) => (
          <DraggableSection
            key={section.id}
            type={"RESUME_SECTION"}
            index={index}
            onMove={handleMove}
          >
            {getSectionComponent(section.id)}
          </DraggableSection>
        ))}
      </div>
    </DndProvider>
  )
}
