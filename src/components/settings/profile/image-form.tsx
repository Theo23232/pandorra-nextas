"use client"

import { Trash2, Upload } from "lucide-react"
import { ChangeEvent, MouseEvent, useState } from "react"
import { Area } from "react-easy-crop"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { DeleteImage, EditImage as Edit } from "@/actions/profile.actions"
import { uploadMultipleFile } from "@/actions/upload.actions"
import { ImageCropper } from "@/components/settings/profile/image-cropper"
import { Button } from "@/components/tremor/ui/button"
import { Profile } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useLoadingStore } from "@/hooks/use-loading-store"
import { useUser } from "@/hooks/use-user"

export type EditImageProps = {
  image: string
  email: string
  name: string
}

export const EditImage = (props: EditImageProps) => {
  const { t } = useTranslation()
  const { mutate } = useUser()
  const { startLoading, stopLoading, isLoading } = useLoadingStore()
  const [image, setImage] = useState<string>(props.image)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [isCropping, setIsCropping] = useState(false)
  const [open, setOpen] = useState(false)

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener("load", () => resolve(image))
      image.addEventListener("error", (error) => reject(error))
      image.setAttribute("crossOrigin", "anonymous")
      image.src = url
    })

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
  ): Promise<Blob> => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      throw new Error("No 2d context")
    }

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    )

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error("Canvas is empty")
        }
        resolve(blob)
      }, "image/jpeg")
    })
  }

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!croppedImage) {
      toast.error(t("No image selected for upload"), {
        position: "top-center",
      })
      return
    }

    startLoading()
    const formData = new FormData()
    formData.append(
      "files",
      await (await fetch(croppedImage)).blob(),
      `${Date.now()}profile.jpg`,
    )

    const newImageUrls = await uploadMultipleFile(formData)
    setImage(newImageUrls[0])
    await Edit(newImageUrls[0])

    stopLoading()
    mutate()
    setCroppedImage(null)
    setOpen(false)
    toast.success(t("Your profile picture is up to date now!"), {
      position: "top-center",
    })
  }

  const remove = async () => {
    await DeleteImage(
      `https://api.dicebear.com/9.x/bottts/svg?seed=${props.email}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf,transparent`,
    )
    setImage(
      `https://api.dicebear.com/9.x/bottts/svg?seed=${props.email}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf,transparent`,
    )

    mutate()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setOriginalFile(file)
      setImage(URL.createObjectURL(file))
      setIsCropping(true)
    }
  }

  const handleCropComplete = async (croppedAreaPixels: Area) => {
    if (originalFile) {
      const croppedImageBlob = await getCroppedImg(
        URL.createObjectURL(originalFile),
        croppedAreaPixels,
      )
      setCroppedImage(URL.createObjectURL(croppedImageBlob))
      setIsCropping(false)
    }
  }

  const handleCropCancel = () => {
    setIsCropping(false)
    setOriginalFile(null)
    setCroppedImage(null)
  }

  return (
    <Card className="flex items-center gap-8 p-4">
      <Profile
        className="size-32"
        email={props.email}
        image={image}
        name={props.name}
      />

      <div className="">
        <p className="ml-4 mt-2 list-disc text-sm text-zinc-500 dark:text-zinc-400">
          {t(
            `If you don't provide a profile picture, we'll generate a unique image for you.`,
          )}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Dialog>
            {image.length > 0 && (
              <DialogTrigger>
                <Button
                  variant={"ghost"}
                  className="gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 />{" "}
                  <span className="hidden sm:block">{t("Remove")}</span>
                </Button>
              </DialogTrigger>
            )}

            <DialogContent className="w-full max-w-lg rounded-lg">
              <DialogTitle className="text-center">
                {t("Remove profile picture")}
              </DialogTitle>
              <DialogDescription className="flex flex-col items-center gap-4">
                <Profile
                  className="size-32"
                  email={props.email}
                  image={`https://api.dicebear.com/9.x/bottts/svg?seed=${props.email}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf,transparent`}
                  name={props.name}
                />
                <p className="text-red-500">
                  {t("Your profile picture will be set to this one")}
                </p>
                <div className="flex gap-2">
                  <DialogClose className="w-full">
                    <Button className="w-full" variant={"outline"}>
                      {t("Cancel")}
                    </Button>
                  </DialogClose>
                  <DialogClose className="w-full">
                    <Button
                      variant={"destructive"}
                      className="w-full gap-2"
                      onClick={remove}
                    >
                      {t("Remove")}
                    </Button>
                  </DialogClose>
                </div>
              </DialogDescription>
            </DialogContent>
          </Dialog>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <Button className="gap-2">
                <Upload />
                {t("Change")}
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-lg rounded-lg">
              <form>
                <DialogTitle className="text-center">
                  {t("Update your profile picture")}
                </DialogTitle>
                <DialogDescription className="mt-4 flex flex-col items-center gap-2">
                  {isCropping && originalFile ? (
                    <ImageCropper
                      image={URL.createObjectURL(originalFile)}
                      onCropComplete={handleCropComplete}
                      onCancel={handleCropCancel}
                    />
                  ) : croppedImage ? (
                    <>
                      <Profile
                        className="size-[400px] rounded-md border-none"
                        email={props.email}
                        image={croppedImage}
                        name={props.name}
                      />
                      <label
                        htmlFor="image"
                        className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-gray-100 p-2 text-sm dark:bg-gray-900"
                      >
                        {t("Select another image")}
                      </label>
                    </>
                  ) : (
                    <>
                      <label
                        htmlFor="image"
                        className="flex size-[400px] cursor-pointer items-center justify-center rounded-lg border-dashed bg-gray-100 p-2 text-center text-sm dark:bg-gray-900"
                      >
                        {t("Click to select")}
                      </label>
                      <label
                        htmlFor="image"
                        className="transparent w-full cursor-pointer p-2 text-sm text-transparent"
                      >
                        {t("Select another image")}
                      </label>
                    </>
                  )}

                  <input
                    type="file"
                    id="image"
                    className="hidden max-w-[500px]"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  {!isCropping && (
                    <div className="flex w-full gap-2">
                      <DialogClose className="w-full">
                        <Button className="w-full" variant={"outline"}>
                          {t("Cancel")}
                        </Button>
                      </DialogClose>
                      <DialogClose className="w-full">
                        <Button
                          className="w-full gap-2"
                          onClick={(e) => handleSubmit(e)}
                          disabled={!croppedImage}
                          isLoading={isLoading}
                        >
                          {t("Save")}
                        </Button>
                      </DialogClose>
                    </div>
                  )}
                </DialogDescription>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  )
}
