import queryClient from '@/web/lib/query-client'
import { useUpdateDocumentByTypeMutation } from '@/web/services/documents/mutations'
import { documentKeys } from '@/web/services/documents/queries'
import { SelectDocumentWithRelationsSchema, UpdateEducationSchema, UpdateExperienceSchema } from '@aicv-app/api/schema'
import { atom, useAtom } from 'jotai'

type Field = 'experience' | 'education' | 'skills'

// type DataType = {
//   experience: UpdateExperienceSchema
//   education: UpdateEducationSchema
// }

export const didSortFlagAtom = atom(0)


export function useSortableItems<T extends Field>(documentId: string, field: T) {
  const [didSortFlag, setDidSortFlag] = useAtom(didSortFlagAtom)
  
  const { mutate: updateDocumentByTypeMutation } = useUpdateDocumentByTypeMutation()

  // dragIndex: the original index of the item being dragged
  // dropIndex: the index where the item is being dropped, the position where the item will be placed
  const handleMove = (dragIndex: number, dropIndex: number) => {
    queryClient.setQueryData(
      documentKeys.LIST_DOCUMENT(documentId),
      (oldData: SelectDocumentWithRelationsSchema) => {
        const fieldData = oldData[field]
        const newItems = [...fieldData]
        const draggedItem = newItems[dragIndex]
        const dropItem = newItems[dropIndex]

        // Swap displayOrder
        const draggedDisplayOrder = draggedItem!.displayOrder
        draggedItem!.displayOrder = dropItem!.displayOrder
        dropItem!.displayOrder = draggedDisplayOrder

        // Remove dragged item and insert it at the new position
        newItems.splice(dragIndex, 1)
        newItems.splice(dropIndex, 0, draggedItem)

        setDidSortFlag(prev => prev + 1)

        updateDocumentByTypeMutation({
          id: documentId,
          document: {
            data: newItems as any,
            type: field
          }
        })

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