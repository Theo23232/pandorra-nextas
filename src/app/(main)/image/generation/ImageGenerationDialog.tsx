import { ImageGenerationSidebar } from "@/app/(main)/image/generation/sidebar"
import { Dialog, DialogContent } from "@/components/ui/dialog"

type ImageGenerationDialogProps = {
  isOpen: boolean
  onClose: () => void
  onModelChange: (model: any) => void
  onPresetStyleChange: (value: string) => void
  onContrastChange: (value: string) => void
  onCountChange: (value: number) => void
  onSizeChange: (width: number, height: number) => void
  defaultmodel: any
  defaultwidth: number
  defaultheight: number
  defaultpresetstyle: string
  defaultcontrast: string
  defaultcount: number
}

export function ImageGenerationDialog({
  isOpen,
  onClose,
  onModelChange,
  onPresetStyleChange,
  onContrastChange,
  onCountChange,
  onSizeChange,
  defaultmodel,
  defaultwidth,
  defaultheight,
  defaultpresetstyle,
  defaultcontrast,
  defaultcount,
}: ImageGenerationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full bg-transparent">
        <ImageGenerationSidebar
          onModelChange={onModelChange}
          onPresetStyleChange={onPresetStyleChange}
          onContrastChange={onContrastChange}
          onCountChange={onCountChange}
          onSizeChange={onSizeChange}
          defaultmodel={defaultmodel}
          defaultwidth={defaultwidth}
          defaultheight={defaultheight}
          defaultpresetstyle={defaultpresetstyle}
          defaultcontrast={defaultcontrast}
          defaultcount={defaultcount}
        />
      </DialogContent>
    </Dialog>
  )
}
