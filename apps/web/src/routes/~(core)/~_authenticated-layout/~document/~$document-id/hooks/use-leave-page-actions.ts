import { generateThumbnail } from '@/web/lib/generateThumbnail'
import { useUploadFileMutation } from '@/web/services/file/mutations'
import { useUpdateDocumentByTypeMutation } from '@/web/services/documents/mutations'
import { useBlocker } from '@tanstack/react-router'
import { currentFormPositionAtom } from '@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/form/resume-form'
import { useAtom } from 'jotai'

export function useLeavePageActions(documentId: string) {
  const [currentFormPosition] = useAtom(currentFormPositionAtom)

  const { mutateAsync: uploadFile } = useUploadFileMutation()
  const { mutateAsync: updateDocumentByType } = useUpdateDocumentByTypeMutation()

  // Try to generate a snapshot to save as a thumbnail before leaving the page
  const getThumbnailUrl = async () => {
    try {
      const file = await generateThumbnail(documentId)
      if (!file) {
        return
      }

      const { url } = await uploadFile(file)
      if (!url) {
        return
      }
      
      return url
    } catch (error) {
      console.error('Failed to save thumbnail:', error)
    }
  }

  const handleLeavePageActions = async () => {
    const thumbnailUrl = await getThumbnailUrl()

    await updateDocumentByType({
      id: documentId,
      document: {
        data: {
          ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
          currentPosition: currentFormPosition || 0,
        },
        type: "document",
      },
    })
  }

  useBlocker({
    shouldBlockFn: async () => {
      await handleLeavePageActions()
      return false
    },
    enableBeforeUnload: false
  })
}