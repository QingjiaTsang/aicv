import { FileText } from 'lucide-react'
import { SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema"
import { cn } from "@/web/lib/utils"
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaBody,
  CredenzaTrigger,
} from "@/web/components/shadcn-ui/credenza"
import { TooltipButton } from '@/web/components/tooltip-button'
import ResumePreview from '@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/preview/resume-preview'
import { useTranslation } from 'react-i18next';
type PreviewModalProps = {
  document: SelectDocumentWithRelationsSchema
  children: React.ReactNode
  isModalOpen: boolean
  onModalChange: (open: boolean) => void
}

export function PreviewModal({ document, children, isModalOpen, onModalChange }: PreviewModalProps) {
  const { t } = useTranslation();

  const isArchived = document.status === 'archived'

  return (
    <Credenza open={isModalOpen} onOpenChange={onModalChange}>
      <CredenzaTrigger asChild>
        <TooltipButton
          tooltip={t('document.tooltips.preview')}
          onClick={() => onModalChange(true)}
          disabled={isArchived}
          className={cn(
            "hover:text-blue-600 dark:hover:text-blue-400",
            isArchived && "opacity-50 cursor-not-allowed"
          )}
        >
          {children}
        </TooltipButton>
      </CredenzaTrigger>

      <CredenzaContent className="p-0 w-full max-h-[90dvh] overflow-y-auto md:max-h-[95dvh] sm:max-w-4xl">
        <CredenzaHeader className="sticky top-0 backdrop-blur-sm bg-white/90 dark:bg-gray-950/90 z-10 m-0 pb-0">
          <CredenzaTitle className="flex items-center gap-2 pt-2 px-3 text-lg font-semibold">
            <FileText className="size-5 text-primary" />
            <span>{document.title}</span>
          </CredenzaTitle>
        </CredenzaHeader>

        <CredenzaBody className="overflow-y-auto">
          <div className="p-1 md:p-4">
            <div
              className={cn(
                "p-10 shadow-lg border-t-[12px] dark:border",
                "rounded-md bg-white dark:bg-gray-950"
              )}
              style={{ borderTop: `12px solid ${document.themeColor}` }}
            >
              <ResumePreview document={document} isDraggable={false} />
            </div>
          </div>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  )
}
