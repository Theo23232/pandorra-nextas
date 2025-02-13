"use client"
import React, { useCallback, useState } from "react"
import Cropper, { Area, Point } from "react-easy-crop"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"

interface ImageCropperProps {
  image: string
  onCropComplete: (croppedAreaPixels: Area) => void
  onCancel: () => void
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  onCropComplete,
  onCancel,
}) => {
  const { t } = useTranslation()
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropChange = (crop: Point) => {
    setCrop(crop)
  }

  const onZoomChange = (zoom: number) => {
    setZoom(zoom)
  }

  const onCropCompleteHandler = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    [],
  )

  const handleCropComplete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (croppedAreaPixels) {
      onCropComplete(croppedAreaPixels)
    }
  }

  return (
    <>
      <div className="relative h-[400px] w-[400px] overflow-hidden rounded-lg">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropCompleteHandler}
        />
      </div>
      <div className="flex w-full gap-2">
        <Button className="w-full" onClick={onCancel} variant="outline">
          {t("Cancel")}
        </Button>
        <Button className="w-full" onClick={handleCropComplete}>
          {t("Crop")}
        </Button>
      </div>
    </>
  )
}
