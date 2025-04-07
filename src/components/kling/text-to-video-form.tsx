"use client"

import { X } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { createTextToVideoGeneration } from "@/actions/kling.actions"
import { Badge } from "@/components/ui/badge"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  duration: z.string().default("5"),
  aspectRatio: z.string().default("16:9"),
  negativePrompt: z.string().optional(),
  cfgScale: z.number().min(0).max(1).default(0.5),
})

const promptHints = ["Girl with Cat", "Neon Car", "Mouse on the Sea"]

export function TextToVideoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [promptTags, setPromptTags] = useState<string[]>([])
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
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
      formData.append(key, value.toString())
    })

    try {
      const result = await createTextToVideoGeneration(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Video generation started successfully",
        })
        form.reset()
        setPromptTags([])
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to start video generation",
          variant: "error",
          duration: 3000,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "error",
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addPromptTag = (tag: string) => {
    if (!promptTags.includes(tag)) {
      const newTags = [...promptTags, tag]
      setPromptTags(newTags)
      form.setValue("prompt", newTags.join(", "))
    }
  }

  const removePromptTag = (tag: string) => {
    const newTags = promptTags.filter((t) => t !== tag)
    setPromptTags(newTags)
    form.setValue("prompt", newTags.join(", "))
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A 20-year-old Europeanish gently strokes a fluffy Ragdoll cat..."
                      className="min-h-[120px] w-full"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        setPromptTags(
                          e.target.value
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean),
                        )
                      }}
                    />
                  </FormControl>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {promptTags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removePromptTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground">
                      Hints:
                    </span>
                    {promptHints.map((hint, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => addPromptTag(hint)}
                      >
                        {hint}
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="">
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
                      Specify what you don not want to see in the video
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-6">
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
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Generating..." : "Generate Video"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
