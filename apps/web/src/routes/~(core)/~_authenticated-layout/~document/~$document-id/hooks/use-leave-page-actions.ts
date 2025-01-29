import { generateThumbnail } from '@/web/lib/generateThumbnail'
import { useUploadFileMutation } from '@/web/services/file/mutations'
import { useUpdateDocumentByTypeMutation } from '@/web/services/documents/mutations'
import { useBlocker } from '@tanstack/react-router'
import { useEffect } from 'react'

export function useLeavePageActions(documentId: string) {
  const { mutateAsync: uploadFile } = useUploadFileMutation()
  const { mutateAsync: updateDocumentByType } = useUpdateDocumentByTypeMutation()

  // Try to generate a snapshot to save as a thumbnail before leaving the page
  const handleThumbnailSave = async () => {
    try {
      const file = await generateThumbnail(documentId)
      if (!file) {
        return
      }

      const { url } = await uploadFile(file)
      if (!url) {
        return
      }

      await updateDocumentByType({
        id: documentId,
        document: {
          data: {
            thumbnail: url,
          },
          type: "document",
        },
      })
    } catch (error) {
      console.error('Failed to save thumbnail:', error)
    }
  }

  const handleLeavePageActions = async () => {
    await handleThumbnailSave()
    // TODO: save the current position of the form
  }

  useBlocker({
    shouldBlockFn: async () => {
      await handleLeavePageActions()
      return false
    },
    enableBeforeUnload: false
  })

  useEffect(() => {
    return () => {
      handleLeavePageActions()
    }
  }, [])
}