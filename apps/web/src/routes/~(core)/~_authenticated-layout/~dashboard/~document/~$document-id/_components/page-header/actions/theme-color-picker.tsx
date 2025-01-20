import { cn } from '@/web/lib/utils'
import { THEME_COLORS } from '@/web/lib/constants'
import { useMediaQuery } from "@/web/hooks/use-media-query"
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
import { Palette } from 'lucide-react'
import CustomColorPicker from '@/web/routes/~(core)/~_authenticated-layout/~dashboard/~document/~$document-id/_components/page-header/actions/custom-color-picker'
import queryClient from '@/web/lib/query-client'
import { SelectDocumentWithRelationsSchema } from '@aicv-app/api/schema'
import { documentKeys } from '@/web/services/documents/queries'

type ThemeColorPickerProps = {
  documentId: string
  selectedColor: string
  onColorSelect: (color: string) => void
  isLoading?: boolean
  isModalOpen: boolean
  onModalChange: (open: boolean) => void
}

export function ThemeColorPicker({
  documentId,
  selectedColor,
  onColorSelect,
  isLoading,
  isModalOpen,
  onModalChange,
}: ThemeColorPickerProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleCustomColorChange = (color: string) => {
    queryClient.setQueryData(documentKeys.LIST_DOCUMENT(documentId), (oldData: SelectDocumentWithRelationsSchema) => {
      return {
        ...oldData,
        themeColor: color
      }
    })
  }

  const handleThemeColorSelect = (color: string) => {
    onColorSelect(color)
  }

  const ColorGrid = () => (
    <div className="flex flex-wrap gap-2">
      {THEME_COLORS.map((color) => (
        <div key={color} className="w-[16.66%] min-w-[2rem] flex justify-center">
          <button
            onClick={() => handleThemeColorSelect(color)}
            className={cn(
              "size-6 rounded-md border-2 transition-all hover:scale-110",
              "focus-visible:outline-none",
              selectedColor === color
                ? "border-4 border-violet-600 shadow-[0_0_0_2px_rgba(124,58,237,0.3)]"
                : "border-transparent"
            )}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
            disabled={isLoading}
          />
        </div>
      ))}
    </div>
  )

  if (isDesktop) {
    return (
      <Popover open={isModalOpen} onOpenChange={onModalChange}>
        <PopoverTrigger asChild>
          <TooltipButton tooltip="Change Theme Color" disabled={isLoading}>
            <Palette className="size-4 sm:size-5" />
          </TooltipButton>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">Select Theme Color</h3>
          </div>
          <ColorGrid />

          <div className="flex items-center justify-between border-t mt-3 pt-3">
            <span className="text-sm font-medium">Custom Color</span>
            <CustomColorPicker
              color={selectedColor}
              onChange={handleCustomColorChange}
              onThemeColorSelect={handleThemeColorSelect}
            />
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Credenza open={isModalOpen} onOpenChange={onModalChange}>
      <CredenzaTrigger asChild>
        <TooltipButton tooltip="Change Theme Color" disabled={isLoading}>
          <Palette className="size-4 sm:size-5" />
        </TooltipButton>
      </CredenzaTrigger>
      <CredenzaContent>
        <div className="p-6 mt-6">
          <CredenzaHeader>
            <CredenzaTitle>Select Theme Color</CredenzaTitle>
          </CredenzaHeader>
          <CredenzaBody className="py-4">
            <div className='ml-7'>
              <ColorGrid />
            </div>
            <div className="flex items-center justify-between border-t mt-4 pt-3">
              <span className="text-sm font-medium">Custom Color</span>
              <CustomColorPicker
                color={selectedColor}
                onChange={handleCustomColorChange}
                onThemeColorSelect={handleThemeColorSelect}
              />
            </div>
          </CredenzaBody>
        </div>
      </CredenzaContent>
    </Credenza>
  )
}