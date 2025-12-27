import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-green-50">
      <div className="text-center px-4">
        <div className="text-6xl mb-4">🐻</div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          The page you're looking for doesn't exist.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/map">View Map</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

