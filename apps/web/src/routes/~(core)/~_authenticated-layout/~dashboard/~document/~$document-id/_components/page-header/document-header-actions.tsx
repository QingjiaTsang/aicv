import { Palette, Eye, Download, Share2, MoreHorizontal, Trash2 } from 'lucide-react'
import { SelectDocumentWithRelationsSchema, type SelectDocumentSchema } from "@aicv-app/api/schema"
import { TooltipButton } from '@/web/components/tooltip-button'
import { Button } from "@/web/components/shadcn-ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/web/components/shadcn-ui/dropdown-menu"

type DocumentActionsProps = {
  document: SelectDocumentWithRelationsSchema
  onThemeChange: () => void
  onPreview: () => void
  onDelete: () => void
  onShare: () => void
  onDownload: () => void
}

export function DocumentHeaderActions({
  document,
  onThemeChange,
  onPreview,
  onDelete,
  onShare,
  onDownload
}: DocumentActionsProps) {
  return (
    <>
      <div className="hidden sm:flex items-center gap-2">
        <TooltipButton
          icon={<Palette className="h-4 w-4 sm:h-5 sm:w-5" />}
          label="Change Theme"
          onClick={onThemeChange}
          className="hover:text-violet-600 dark:hover:text-violet-400"
        />
        <TooltipButton
          icon={<Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
          label="Preview"
          onClick={onPreview}
          className="hover:text-blue-600 dark:hover:text-blue-400"
        />
        <TooltipButton
          icon={<Download className="h-4 w-4 sm:h-5 sm:w-5" />}
          label="Download"
          onClick={onDownload}
          className="hover:text-green-600 dark:hover:text-green-400"
        />
        <TooltipButton
          icon={<Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />}
          label="Delete"
          onClick={onDelete}
          className="hover:text-red-600 dark:hover:text-red-400"
        />
        <TooltipButton
          icon={<Share2 className="h-4 w-4 sm:h-5 sm:w-5" />}
          label="Share"
          onClick={onShare}
          className="hover:text-sky-500 dark:hover:text-sky-400"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden flex justify-center hover:bg-violet-100/50 dark:hover:bg-violet-900/50"
          >
            <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onThemeChange}>
            <Palette className="mr-2 h-4 w-4" />
            <span>Change Theme</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onPreview}>
            <Eye className="mr-2 h-4 w-4" />
            <span>Preview</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onShare}>
            <Share2 className="mr-2 h-4 w-4" />
            <span>Share</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            <span>Download</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}