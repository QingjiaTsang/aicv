import { useDrag, useDrop } from 'react-dnd'
import { cn } from '@/web/lib/utils'

type DraggableSectionProps = {
  type: string
  index: number
  children: React.ReactNode
  onMove: (dragIndex: number, hoverIndex: number) => void
}

export function DraggableSection({ type, index, children, onMove }: DraggableSectionProps) {
  const [{ isDragging }, dragRef] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    // end: (item: { index: number }) => {
    //   console.log('end', item.index, index)
    // },
  })

  const [{ isOver }, dropRef] = useDrop({
    accept: type,
    // hover: (item: { index: number }) => {
    //   console.log('hover', item.index, index)
    // },
    drop: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index)
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