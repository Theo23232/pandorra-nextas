"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { editUser } from "@/actions/user.ations"
import { Input } from "@/components/tremor/inputs/input"
import { Textarea } from "@/components/tremor/inputs/textarea"
import { Button } from "@/components/tremor/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/tremor/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/hooks/use-user"
import { zodResolver } from "@hookform/resolvers/zod"

/**
 * Schema for validating personal information form fields.
 *
 * - `firstName`: A string that must be at least 2 characters long.
 * - `lastName`: A string that must be at least 2 characters long.
 * - `username`: A string that must be at least 2 characters long.
 * - `description`: A string that can be up to 128 characters long.
 */
const personalInfoSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters long.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters long.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters long.",
  }),
  description: z.string().max(128, {
    message: "Description must be at most 128 characters long.",
  }),
})

export function PersonalInfoForm() {
  const { user, isLoading: isUserLoading } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: user?.firstname ?? "",
      lastName: user?.lastname ?? "",
      username: user?.username ?? "",
      description: user?.description ?? "",
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstname ?? "",
        lastName: user.lastname ?? "",
        username: user.username ?? "",
        description: user.description ?? "",
      })
    }
  }, [isUserLoading, form])

  async function onSubmit(values: z.infer<typeof personalInfoSchema>) {
    setIsLoading(true)
    await editUser(
      values.firstName,
      values.lastName,
      values.username,
      values.description,
    )
      .then(() => {
        toast({
          title: "Success",
          description:
            "Your personal information has been updated successfully.",
          variant: "success",
          duration: 3000,
        })
      })
      .catch((e) => {
        toast({
          title: "Error",
          description: e.message,
          variant: "error",
          duration: 3000,
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Card>
      <CardTitle>Personal Information</CardTitle>
      <CardDescription>Update your personal information here.</CardDescription>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Something about you" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" isLoading={isLoading}>
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
