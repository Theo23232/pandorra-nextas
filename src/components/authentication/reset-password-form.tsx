"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("The password does not match")
      return
    }

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      router.push("/login?message=password-updated")
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="mx-auto mt-8 max-w-md rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold">Reset your password</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block">New password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block">Confirm password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded border p-2"
            required
          />
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}

        <button
          type="submit"
          className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
        >
          Reset your password
        </button>
      </form>
    </div>
  )
}
