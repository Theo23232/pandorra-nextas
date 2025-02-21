"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Input } from '@/components/tremor/inputs/input';
import { Label } from '@/components/tremor/inputs/label';
import { Button } from '@/components/tremor/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
})

const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(4, "Username must be at least 4 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>
type RegisterFormData = z.infer<typeof registerSchema>
type FormData = LoginFormData | RegisterFormData
export default function AuthForm() {
  const { t } = useTranslation()
  const [isLogin, setIsLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    mode: "onBlur",
  })

  const onSubmit = async (data: FormData) => {
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register"
    setIsLoading(true)
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.message || errorData.error,
          variant: "error",
          duration: 3000,
        })
        return
      }

      const responseData = await response.json()
      if (responseData.token) {
        const expirationDate = new Date()
        expirationDate.setDate(expirationDate.getDate() + 30)

        document.cookie = `auth-token=${responseData.token}; path=/; expires=${expirationDate.toUTCString()}`
        window.location.href = "/explore"
        router.refresh()
      }
    } catch (err: any) {
      toast({
        title: t(`Error`),
        description: t(err.message),
        variant: "error",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollArea className="flex h-fit max-h-screen max-w-[30rem] flex-col items-center justify-center overflow-x-visible rounded-lg bg-background px-6 shadow-md">
      <div className="p-4">
        <div className="flex w-full items-center justify-center">
          <Link href={"/"} prefetch>
            <Image
              src="/logo/logo-full-white.png"
              alt="logo"
              width={1000}
              height={500}
              className="hidden h-[40px] w-[176px] scale-[2] object-contain dark:block"
            />
          </Link>
        </div>

        <p className="text-md mb-4 mt-4 text-center text-white">
          {t(`Creativity unleashed`)}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          {!isLogin && (
            <div>
              <Label htmlFor="username">{t(`Username`)}</Label>
              <Input
                {...register("username")}
                className="w-full"
                type="text"
                id="username"
                placeholder="john.doe"
              />
              {/* {errors.username && (
              <p className="text-sm text-red-500">{errors.username?.message}</p>
            )} */}
            </div>
          )}

          <div>
            <Label htmlFor="email">{t(`Email`)}</Label>
            <Input
              {...register("email")}
              type="email"
              id="email"
              placeholder="john@company.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email?.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">{t(`Password`)}</Label>
            <Input
              {...register("password")}
              type="password"
              id="password"
              autoComplete="password"
              placeholder={t(`Password`)}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password?.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            {isLogin ? t(`Sign in`) : t(`Create account`)}
          </Button>
        </form>

        <Button
          variant="outline"
          onClick={() => {
            setIsLogin(!isLogin)
            reset()
          }}
          className="mt-4 w-full"
        >
          {isLogin ? t(`Create an account`) : t(`Already have an account?`)}
        </Button>
        {/* 
        <Divider>{t(`or with`)}</Divider>
        <GoogleAuth /> */}
        <p className="text-tremor-label text-tremor-content dark:text-dark-tremor-content mt-4 text-white">
          {t(`By signing in, you agree to our`)}
          <Link href="/terms" className="mx-1 underline underline-offset-4">
            {t(`terms of service`)}
          </Link>{" "}
          {t(`and`)}{" "}
          <Link href="/privacy" className="mx-1 underline underline-offset-4">
            {t(`privacy policy`)}
          </Link>
        </p>
      </div>
    </ScrollArea>
  )
}
