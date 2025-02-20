import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/web/components/shadcn-ui/popover"
import {
  Credenza,
  CredenzaContent,
  CredenzaTrigger,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaBody,
} from "@/web/components/shadcn-ui/credenza"
import { TooltipButton } from '@/web/components/tooltip-button'
import { useMediaQuery } from "@/web/hooks/use-media-query"
import { Share2, Globe } from "lucide-react"
import { DOCUMENT_STATUS, DocumentStatus } from "@aicv-app/api/schema"
import { Button } from "@/web/components/shadcn-ui/button"
import { Input } from "@/web/components/shadcn-ui/input"
import { Copy } from "lucide-react"
import { cn } from "@/web/lib/utils"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

type ShareLinkPopoverProps = {
  documentId: string
  documentStatus: DocumentStatus
  onDocumentStatusChange: (status: DocumentStatus) => void
  isLoading: boolean
  isModalOpen: boolean
  onModalChange: (open: boolean) => void
}

export default function ShareLinkPopover({ documentId, documentStatus, onDocumentStatusChange, isLoading, isModalOpen, onModalChange }: ShareLinkPopoverProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  
  const { t } = useTranslation();
  
  const shareLink = window.location.origin + "/preview/" + documentId

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareLink)
    toast.success(t('document.toast.linkCopied'))
  }

  const handleDocumentStatusToggle = () => {
    const status = documentStatus === DOCUMENT_STATUS.PUBLIC ? DOCUMENT_STATUS.PRIVATE : DOCUMENT_STATUS.PUBLIC
    onDocumentStatusChange(status)
  }

  const renderShareContent = () => {
    if (documentStatus === DOCUMENT_STATUS.PRIVATE) {
      return (
        <div className="space-y-2 text-center">
          <div className="mx-auto w-fit">
            <Globe className="size-11 text-primary dark:text-violet-300" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-medium text-primary dark:text-violet-100">
              {t('document.share.setPublic')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('document.share.makePublic')}
            </p>
          </div>
          <Button
            variant="default"
            onClick={handleDocumentStatusToggle}
            disabled={isLoading}
            className="w-full"
          >
            {t('document.share.setPublic')}
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <h3 className="text-sm font-normal text-primary dark:text-violet-100">
          {t('document.share.description')}
        </h3>

        <div className="flex items-center gap-2">
          <Input
            value={shareLink}
            readOnly
            className="text-sm bg-background dark:bg-violet-950/50 dark:border-violet-800/50"
          />
          <Button
            size="icon"
            variant="secondary"
            onClick={handleCopyLink}
            className={cn(
              "shrink-0",
              "text-foreground hover:text-violet-600",
              "dark:text-violet-100 dark:hover:text-violet-300",
              "dark:bg-violet-900/50 dark:hover:bg-violet-800/50"
            )}
          >
            <Copy className="size-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={handleDocumentStatusToggle}
          disabled={isLoading}
          className={cn(
            "w-full justify-center border-primary/50 dark:border-violet-700/50",
            "text-primary dark:text-violet-300 hover:text-primary",
            "hover:bg-primary/10 dark:hover:bg-violet-900/50",
            documentStatus === DOCUMENT_STATUS.PUBLIC && "bg-violet-50 dark:bg-violet-900/70"
          )}
        >
          {documentStatus === DOCUMENT_STATUS.PUBLIC ? t('document.share.setPrivate') : t('document.share.setPublic')}
        </Button>
      </div>
    )
  }

  if (isDesktop) {
    return (
      <Popover open={isModalOpen} onOpenChange={onModalChange}>
        <PopoverTrigger asChild>
          <TooltipButton
            tooltip={t('document.tooltips.share')}
            className="hover:text-violet-500 dark:hover:text-violet-400"
          >
            <Share2 className="size-4 sm:size-5" />
          </TooltipButton>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[360px]">
          {renderShareContent()}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Credenza open={isModalOpen} onOpenChange={onModalChange}>
      <CredenzaTrigger asChild>
        <TooltipButton
          tooltip={t('document.tooltips.share')}
          className="hover:text-violet-500 dark:hover:text-violet-400"
        >
          <Share2 className="size-4 sm:size-5" />
        </TooltipButton>
      </CredenzaTrigger>
      <CredenzaContent className="h-[40dvh]">
        <div className="p-6 mt-6">
          <CredenzaHeader>
            <CredenzaTitle>{t('document.share.title')}</CredenzaTitle>
          </CredenzaHeader>
          <CredenzaBody className="space-y-4">
            {renderShareContent()}
          </CredenzaBody>
        </div>
      </CredenzaContent>
    </Credenza>
  )
}
