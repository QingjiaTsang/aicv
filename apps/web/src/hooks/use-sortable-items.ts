import { documentKeys } from '@/web/services/documents/queries'
import { SelectDocumentWithRelationsSchema } from '@aicv-app/api/schema'
import { useQueryClient } from '@tanstack/react-query'
import { atom, useAtom } from 'jotai'

type Field = 'experience' | 'education'

const didSortFlagAtom = atom(0)

export function useSortableItems<T extends Field>(documentId: string, field: T) {
  const queryClient = useQueryClient()

  const [didSortFlag, setDidSortFlag] = useAtom(didSortFlagAtom)

  // dragIndex: the original index of the item being dragged
  // dropIndex: the index where the item is being dropped, the position where the item will be placed
  const handleMove = (dragIndex: number, dropIndex: number) => {
    queryClient.setQueryData(
      documentKeys.LIST_DOCUMENT(documentId),
      (oldData: SelectDocumentWithRelationsSchema) => {
        const fieldData = oldData[field]
        const newItems = [...fieldData]
        const draggedItem = newItems[dragIndex]
        newItems.splice(dragIndex, 1)
        newItems.splice(dropIndex, 0, draggedItem)

        setDidSortFlag(prev => prev + 1)

        return {
          ...oldData,
          [field]: newItems
        }
      }
    )
  }

  return {
    didSortFlag,
    handleMove,
  }
} 