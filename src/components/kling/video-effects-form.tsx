"use client"

import type React from "react"

import { Loader2, RefreshCw, Upload } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { createVideoEffectsGeneration } from "@/actions/kling.actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMediaUpload } from "@/hooks/use-media-upload"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  effectScene: z.enum([
    "hug",
    "kiss",
    "heart_gesture",
    "squish",
    "expansion",
  ] as const),
  duration: z.string().default("5"),
  image1: z.string().optional(),
  image2: z.string().optional(),
  imageUrl: z.string().optional(),
})

export type VideoEFfectsFormProps = {
  genType: "hug" | "kiss" | "heart_gesture" | "squish" | "expansion" | undefined
}

export function VideoEffectsForm(props: VideoEFfectsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl1, setPreviewUrl1] = useState<string | null>(null)
  const [previewUrl2, setPreviewUrl2] = useState<string | null>(null)
  const [previewUrlSingle, setPreviewUrlSingle] = useState<string | null>(null)
  const { toast } = useToast()
  const { uploadFile, isUploading, uploadProgress, error } = useMediaUpload()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      effectScene: props.genType ?? "hug",
      duration: "5",
    },
  })

  const effectScene = form.watch("effectScene")
  const needsTwoImages = ["hug", "kiss", "heart_gesture"].includes(effectScene)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Validate based on effect type
    if (needsTwoImages) {
      if (!values.image1 || !values.image2) {
        toast({
          title: "Error",
          description: "Two images are required for this effect",
          variant: "error",
        })
        return
      }
    } else {
      if (!values.imageUrl) {
        toast({
          title: "Error",
          description: "An image is required for this effect",
          variant: "error",
        })
        return
      }
    }

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("effectScene", values.effectScene)
    formData.append("duration", values.duration)

    if (needsTwoImages) {
      formData.append("image1", values.image1 || "")
      formData.append("image2", values.image2 || "")
    } else {
      formData.append("imageUrl", values.imageUrl || "")
    }

    try {
      const result = await createVideoEffectsGeneration(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Video effect generation started successfully",
        })
        form.reset()
        setPreviewUrl1(null)
        setPreviewUrl2(null)
        setPreviewUrlSingle(null)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to start video generation",
          variant: "error",
        })
      }
    } catch (error) {
      console.error("Form submission error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    imageField: "image1" | "image2" | "imageUrl",
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const imageUrl = await uploadFile(file)

      if (imageUrl) {
        if (imageField === "image1") {
          setPreviewUrl1(imageUrl)
          form.setValue("image1", imageUrl)
        } else if (imageField === "image2") {
          setPreviewUrl2(imageUrl)
          form.setValue("image2", imageUrl)
        } else {
          setPreviewUrlSingle(imageUrl)
          form.setValue("imageUrl", imageUrl)
        }
      } else if (error) {
        toast({
          title: "Upload Error",
          description: error,
          variant: "error",
        })
      }
    } catch (err) {
      toast({
        title: "Upload Error",
        description: "Failed to upload image",
        variant: "error",
      })
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="effectScene"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Effect Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="hug" />
                        </FormControl>
                        <FormLabel className="font-normal">Hug</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="kiss" />
                        </FormControl>
                        <FormLabel className="font-normal">Kiss</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="heart_gesture" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Heart Gesture
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="squish" />
                        </FormControl>
                        <FormLabel className="font-normal">Squish</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="expansion" />
                        </FormControl>
                        <FormLabel className="font-normal">Expansion</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Select the type of effect you want to apply
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="5">5 seconds</SelectItem>
                      <SelectItem value="10">10 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {needsTwoImages ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="image1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Image</FormLabel>
                      <FormControl>
                        <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 dark:bg-gray-900">
                          {previewUrl1 ? (
                            <div className="relative h-full w-full">
                              <img
                                src={previewUrl1 || "/placeholder.svg"}
                                alt="First Image"
                                className="h-full w-full object-contain"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="absolute right-2 top-2"
                                onClick={() => {
                                  setPreviewUrl1(null)
                                  form.setValue("image1", "")
                                }}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center space-y-2">
                              {isUploading ? (
                                <div className="w-full space-y-2">
                                  <Loader2 className="mx-auto h-10 w-10 animate-spin text-gray-400" />
                                  <Progress
                                    value={uploadProgress}
                                    className="w-full"
                                  />
                                  <p className="text-center text-xs text-gray-400">
                                    Uploading... {uploadProgress}%
                                  </p>
                                </div>
                              ) : (
                                <>
                                  <Upload className="h-10 w-10 text-gray-400" />
                                  <p className="text-sm text-gray-500">
                                    Upload first image
                                  </p>
                                  <Input
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleImageUpload(e, "image1")
                                    }
                                    id="image-upload-1"
                                    disabled={isUploading}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      document
                                        .getElementById("image-upload-1")
                                        ?.click()
                                    }}
                                    disabled={isUploading}
                                  >
                                    Select File
                                  </Button>
                                </>
                              )}
                            </div>
                          )}
                          <Input type="hidden" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Second Image</FormLabel>
                      <FormControl>
                        <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 dark:bg-gray-900">
                          {previewUrl2 ? (
                            <div className="relative h-full w-full">
                              <img
                                src={previewUrl2 || "/placeholder.svg"}
                                alt="Second Image"
                                className="h-full w-full object-contain"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="absolute right-2 top-2"
                                onClick={() => {
                                  setPreviewUrl2(null)
                                  form.setValue("image2", "")
                                }}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center space-y-2">
                              {isUploading ? (
                                <div className="w-full space-y-2">
                                  <Loader2 className="mx-auto h-10 w-10 animate-spin text-gray-400" />
                                  <Progress
                                    value={uploadProgress}
                                    className="w-full"
                                  />
                                  <p className="text-center text-xs text-gray-400">
                                    Uploading... {uploadProgress}%
                                  </p>
                                </div>
                              ) : (
                                <>
                                  <Upload className="h-10 w-10 text-gray-400" />
                                  <p className="text-sm text-gray-500">
                                    Upload second image
                                  </p>
                                  <Input
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleImageUpload(e, "image2")
                                    }
                                    id="image-upload-2"
                                    disabled={isUploading}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      document
                                        .getElementById("image-upload-2")
                                        ?.click()
                                    }}
                                    disabled={isUploading}
                                  >
                                    Select File
                                  </Button>
                                </>
                              )}
                            </div>
                          )}
                          <Input type="hidden" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Image</FormLabel>
                    <FormControl>
                      <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 dark:bg-gray-900">
                        {previewUrlSingle ? (
                          <div className="relative h-full w-full">
                            <img
                              src={previewUrlSingle || "/placeholder.svg"}
                              alt="Preview"
                              className="h-full w-full object-contain"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="absolute right-2 top-2"
                              onClick={() => {
                                setPreviewUrlSingle(null)
                                form.setValue("imageUrl", "")
                              }}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center space-y-2">
                            {isUploading ? (
                              <div className="w-full space-y-2">
                                <Loader2 className="mx-auto h-10 w-10 animate-spin text-gray-400" />
                                <Progress
                                  value={uploadProgress}
                                  className="w-full"
                                />
                                <p className="text-center text-xs text-gray-400">
                                  Uploading... {uploadProgress}%
                                </p>
                              </div>
                            ) : (
                              <>
                                <Upload className="h-10 w-10 text-gray-400" />
                                <p className="text-sm text-gray-500">
                                  Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-gray-400">
                                  JPG, PNG files up to 10MB
                                </p>
                                <Input
                                  type="file"
                                  accept="image/jpeg,image/png"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleImageUpload(e, "imageUrl")
                                  }
                                  id="image-upload-single"
                                  disabled={isUploading}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    document
                                      .getElementById("image-upload-single")
                                      ?.click()
                                  }}
                                  disabled={isUploading}
                                >
                                  Select File
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                        <Input type="hidden" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? "Generating..." : "Generate Effect Video"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
