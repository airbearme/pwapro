import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-6xl animate-bounce">🐻</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
          404 - Page Not Found
        </h1>
        <p className="text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild className="bg-gradient-to-r from-orange-500 to-orange-600">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}

