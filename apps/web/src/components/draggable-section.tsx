import { useDrag, useDrop } from 'react-dnd'
import { cn } from '@/web/lib/utils'

export type ResumeSection = 'personalInfo' | 'summary' | 'experience' | 'education' | 'skills'

export type ResumeSectionConfig = {
  id: ResumeSection
  title: string
  order: number
}

type DraggableSectionProps = {
  index: number
  children: React.ReactNode
  onMove: (dragIndex: number, hoverIndex: number) => void
}

export function DraggableSection({ index, children, onMove }: DraggableSectionProps) {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'RESUME_SECTION',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ isOver }, dropRef] = useDrop({
    accept: 'RESUME_SECTION',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index)
        item.index = index
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  return (
    <div
      ref={(node) => {
        dragRef(dropRef(node))
      }}
      className={cn(
        'transition-all duration-200',
        isDragging && 'opacity-50',
        isOver && 'border-2 border-dashed border-primary'
      )}
    >
      {children}
    </div>
  )
} 