"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-6xl animate-bounce">🐻</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
          Something went wrong!
        </h1>
        <p className="text-muted-foreground">
          We encountered an unexpected error. Don&apos;t worry, your data is safe.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} className="bg-gradient-to-r from-orange-500 to-orange-600">
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

