"use client"

import type React from "react"

import { Loader2, RefreshCw, Upload } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { createImageToVideoGeneration } from "@/actions/kling.actions"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { useMediaUpload } from "@/hooks/use-media-upload"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  duration: z.string().default("5"),
  aspectRatio: z.string().default("16:9"),
  negativePrompt: z.string().optional(),
  cfgScale: z.number().min(0).max(1).default(0.5),
})

export function ImageToVideoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const { toast } = useToast()
  const { uploadFile, isUploading, uploadProgress, error } = useMediaUpload()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      imageUrl: "",
      duration: "5",
      aspectRatio: "16:9",
      negativePrompt: "blur, distort, and low quality",
      cfgScale: 0.5,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value.toString())
      }
    })

    try {
      const result = await createImageToVideoGeneration(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Video generation started successfully",
        })
        form.reset()
        setPreviewUrl(null)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to start video generation",
          variant: "error",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const imageUrl = await uploadFile(file)

      if (imageUrl) {
        setPreviewUrl(imageUrl)
        form.setValue("imageUrl", imageUrl)
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
            <div className="">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your creative ideas for the video..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe what you want to see in the video
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="negativePrompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Negative Prompt (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List the types of content you don't want to see in the video..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Specify what you do not want to see in the video
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Image</FormLabel>
                      <FormControl>
                        <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 dark:bg-gray-900">
                          {previewUrl ? (
                            <div className="relative h-full w-full">
                              <img
                                src={previewUrl || "/placeholder.svg"}
                                alt="Preview"
                                className="h-full w-full object-contain"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="absolute right-2 top-2"
                                onClick={() => {
                                  setPreviewUrl(null)
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
                                    onChange={handleImageUpload}
                                    id="image-upload"
                                    disabled={isUploading}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      document
                                        .getElementById("image-upload")
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

                <div className="grid grid-cols-2 gap-4">
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

                  <FormField
                    control={form.control}
                    name="aspectRatio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aspect Ratio</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select aspect ratio" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="16:9">16:9</SelectItem>
                            <SelectItem value="9:16">9:16</SelectItem>
                            <SelectItem value="1:1">1:1</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="cfgScale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Creativity Level: {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={1}
                          step={0.1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormDescription className="flex justify-between">
                        <span>Less creative</span>
                        <span>More creative</span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isUploading || !form.formState.isValid}
            >
              {isSubmitting ? "Generating..." : "Generate Video"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
