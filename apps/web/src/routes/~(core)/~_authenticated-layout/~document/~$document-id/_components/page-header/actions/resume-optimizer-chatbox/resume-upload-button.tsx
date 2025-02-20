import { Dropzone, DropzoneMessage, DropzoneTrigger, useDropzone } from "@/web/components/shadcn-ui/dropzone"
import { Upload } from 'lucide-react'
import { cn } from "@/web/lib/utils"
import { toast } from "sonner"
import { extractFileText } from '@/web/lib/extract-file-text'
import { useTranslation } from 'react-i18next'

type UploadResumeButtonProps = {
  onUploadSuccess: (fileTextContent: string) => Promise<void>
  disabled?: boolean
}

export function UploadResumeButton({ onUploadSuccess, disabled }: UploadResumeButtonProps) {
  const { t } = useTranslation()
  
  const dropzone = useDropzone({
    validation: {
      accept: {
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      },
      maxFiles: 1,
      maxSize: 10 * 1024 * 1024, // 10MB
    },
    onDropFile: async (file) => {
      try {
        const textContent = await extractFileText(file)
        return { status: 'success', result: textContent }
      } catch (error) {
        return { 
          status: 'error', 
          error: error instanceof Error ? error.message : t('resume.optimization.error.uploadFailed')
        }
      }
    },
    onFileUploaded: (textContent) => {
      onUploadSuccess(textContent)
    },
    onFileUploadError(error) {
      console.error(error)
      toast.error(t('resume.optimization.error.uploadFailed'))
    },
    shapeUploadError: (error) => t('resume.optimization.error.uploadFailed') + `: ${error}`,
  })

  return (
    <Dropzone {...dropzone}>
      <DropzoneTrigger 
        className={cn(
          "w-full h-10 flex items-center justify-center gap-2",
          "px-4 py-2 rounded-md",
          "bg-blue-500 hover:bg-blue-600 text-white text-sm",
          "transition-colors duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <Upload className="size-4" />
        <span>{t('document.actions.uploadResume')}</span>
      </DropzoneTrigger>
      <DropzoneMessage />
    </Dropzone>
  )
}