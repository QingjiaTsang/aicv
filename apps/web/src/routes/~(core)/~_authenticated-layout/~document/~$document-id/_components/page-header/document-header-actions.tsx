import { Palette, Eye, Download, Share2, MoreHorizontal, Trash2, Sparkles } from 'lucide-react'
import { DocumentStatus, SelectDocumentWithRelationsSchema } from "@aicv-app/api/schema"
import { TooltipButton } from '@/web/components/tooltip-button'
import { Button } from "@/web/components/shadcn-ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/web/components/shadcn-ui/dropdown-menu"
import { ThemeColorPicker } from './actions/theme-color-picker'
import { DEFAULT_THEME_COLOR } from '@/web/lib/constants'
import { useState } from 'react'
import { PreviewModal } from '@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/page-header/actions/preview-modal'
import { useDeleteDocumentMutation, useUpdateDocumentByTypeMutation } from '@/web/services/documents/mutations'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import useConfirm from '@/web/hooks/use-confirm'
import { useTranslation } from 'react-i18next'

import html2PDF from 'jspdf-html2canvas';
import { format } from 'date-fns'
import ShareLinkPopover from '@/web/routes/~(core)/~_authenticated-layout/~document/~$document-id/_components/page-header/actions/share-link-popover'
import { OptimizeResumeAction } from './actions/optimize-resume-action'

type DocumentActionsProps = {
  document: SelectDocumentWithRelationsSchema
}

export function DocumentHeaderActions({ document, }: DocumentActionsProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [isShareLinkModalOpen, setIsShareLinkModalOpen] = useState(false)
  const [isOptimizeOpen, setIsOptimizeOpen] = useState(false)

  const { mutateAsync: deleteDocument } = useDeleteDocumentMutation({
    onSuccess: async () => {
      await navigate({
        to: "/dashboard",
        search: {
          status: undefined,
          search: ""
        },
        replace: true
      })
      toast.success(t('document.toast.deleteSuccess'))
    },
    onError: () => {
      toast.error(t('document.toast.deleteError'))
    }
  })
  const { mutate: updateDocumentByType, isPending: isUpdatingDocumentByType } = useUpdateDocumentByTypeMutation()

  const [DeleteResumeConfirmDialog, confirmDeleteResume] = useConfirm({
    title: t('document.deleteConfirm.title'),
    message: t('document.deleteConfirm.message'),
  }) as [() => JSX.Element, () => Promise<boolean>];

  const handleThemeChange = async (color: string) => {
    updateDocumentByType({
      id: document.id,
      document: {
        data: {
          themeColor: color
        },
        type: 'document'
      }
    }, {
      onSuccess: () => {
        toast.success(t('document.toast.themeUpdateSuccess'))
      },
      onError: () => {
        toast.error(t('document.toast.themeUpdateError'))
      }
    })
  }

  const handleDelete = async () => {
    const confirmed = await confirmDeleteResume();
    if (!confirmed) {
      return;
    }

    try {
      await deleteDocument(document.id)
    } catch (error) {
      console.error('删除文档失败:', error)
    }
  }

  const handleDownload = async () => {
    const resumeElement = window.document.getElementById('resume-preview')
    if (!resumeElement) {
      return
    }

    // Save current theme
    const root = window.document.documentElement
    const originalTheme = root.classList.contains('dark') ? 'dark' : 'light'

    try {
      // Temporarily switch to light theme so that the PDF is not affected by the current theme
      root.classList.remove('dark')

      // Get actual size of element
      const { width, height } = resumeElement.getBoundingClientRect()

      // Set fixed width (A4 paper width is approximately 21cm)
      const targetWidth = 21
      // Calculate corresponding height based on width ratio
      const targetHeight = (height * targetWidth) / width

      const fileName = `${document.title || 'resume'}_${format(new Date(), 'yyyy_MM_dd_HH:mm:ss')}.pdf`;

      await html2PDF(resumeElement, {
        jsPDF: {
          format: [targetWidth, targetHeight],
          unit: 'cm',
          orientation: 'portrait',
          compress: false
        },
        imageType: 'image/png',
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        html2canvas: {
          scale: 2,
        },
        success: function (pdf) {
          pdf.save(fileName);
        },
      });
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error(t('document.toast.pdfError'));
    } finally {
      // Restore original theme
      if (originalTheme === 'dark') {
        root.classList.add('dark')
      }
    }
  }

  const handleDocumentStatusChange = (status: DocumentStatus) => {
    updateDocumentByType({
      id: document.id,
      document: {
        data: {
          status
        },
        type: 'document'
      }
    }, {
      onSuccess: () => {
        toast.success(t('document.toast.statusUpdateSuccess'))
      },
      onError: () => {
        toast.error(t('document.toast.statusUpdateError'))
      }
    })
  }

  return (
    <>
      <DeleteResumeConfirmDialog />

      <div className="hidden sm:flex items-center gap-2">
        <OptimizeResumeAction
          document={document}
          isOpen={isOptimizeOpen}
          onOpenChange={setIsOptimizeOpen}
        />
        <ThemeColorPicker
          documentId={document.id}
          selectedColor={document.themeColor ?? DEFAULT_THEME_COLOR}
          onColorSelect={handleThemeChange}
          isLoading={isUpdatingDocumentByType}
          isModalOpen={isThemePickerOpen}
          onModalChange={setIsThemePickerOpen}
        />

        <PreviewModal
          document={document}
          onModalChange={setIsPreviewModalOpen}
          isModalOpen={isPreviewModalOpen}
        >
          <Eye className="size-4 sm:size-5" />
        </PreviewModal>

        <TooltipButton
          tooltip={t('document.tooltips.download')}
          onClick={handleDownload}
          className="hover:text-green-600 dark:hover:text-green-400"
        >
          <Download className="size-4 sm:size-5" />
        </TooltipButton>

        <TooltipButton
          tooltip={t('document.tooltips.delete')}
          onClick={handleDelete}
          className="hover:text-red-600 dark:hover:text-red-400"
        >
          <Trash2 className="size-4 sm:size-5" />
        </TooltipButton>

        <ShareLinkPopover
          documentId={document.id}
          documentStatus={document.status}
          onDocumentStatusChange={handleDocumentStatusChange}
          isLoading={isUpdatingDocumentByType}
          isModalOpen={isShareLinkModalOpen}
          onModalChange={setIsShareLinkModalOpen}
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden flex justify-center hover:bg-violet-100/50 dark:hover:bg-violet-900/50"
          >
            <MoreHorizontal className="size-4 sm:size-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsOptimizeOpen(true)}>
            <Sparkles className="mr-2 size-4" />
            <span>{t('document.actions.aiOptimization')}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setIsThemePickerOpen(true)}
            disabled={document.status === 'archived'}
          >
            <Palette className="mr-2 size-4" />
            <span>{t('document.actions.changeTheme')}</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setIsPreviewModalOpen(true)}>
            <Eye className="mr-2 size-4" />
            <span>{t('document.actions.preview')}</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setIsShareLinkModalOpen(true)}>
            <Share2 className="mr-2 size-4" />
            <span>{t('document.actions.share')}</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleDownload}>
            <Download className="mr-2 size-4" />
            <span>{t('document.actions.download')}</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleDelete}>
            <Trash2 className="mr-2 size-4" />
            <span>{t('document.actions.delete')}</span>
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}