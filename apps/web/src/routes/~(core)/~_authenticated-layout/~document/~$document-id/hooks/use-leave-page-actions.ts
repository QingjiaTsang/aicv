import { generateThumbnail } from '@/web/lib/generateThumbnail'
import { useUploadFileMutation } from '@/web/services/file/mutations'
import { useUpdateDocumentByTypeMutation } from '@/web/services/documents/mutations'
import { useBlocker, useNavigate } from '@tanstack/react-router';
import { currentFormPositionAtom } from '@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/form/resume-form'
import { useAtom } from 'jotai'

export function useLeavePageActions(documentId: string) {
  const navigate = useNavigate()

  const [currentFormPosition] = useAtom(currentFormPositionAtom)

  const { mutateAsync: uploadFile } = useUploadFileMutation()
  const { mutate: updateDocumentByType } = useUpdateDocumentByTypeMutation({
    onError: () => {
      // If the document deleted, updateDocumentByType will throw an error
      // So we need to navigate to the dashboard
      navigate({ to: "/dashboard", search: { status: undefined, search: "" } })
    }
  })

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

    updateDocumentByType({
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