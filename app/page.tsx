import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, ShoppingBag, Leaf, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          {/* Logo */}
          <div className="mb-6">
            <img
              src="/airbear-logo.png"
              alt="AirBear Logo"
              className="w-32 h-32 mx-auto object-contain"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-balance">
              Welcome to <span className="text-primary">AirBear</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-pretty max-w-2xl">
              Solar-powered rideshare with onboard mobile bodegas. Sustainable transportation meets convenience.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button asChild size="lg" className="text-lg">
              <Link href="/map">
                <MapPin className="mr-2 h-5 w-5" />
                Book a Ride
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg bg-transparent">
              <Link href="/products">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Bodega
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-4xl">
            <div className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-card border">
              <Leaf className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold">Eco-Friendly</h3>
              <p className="text-muted-foreground text-center">
                100% solar-powered vehicles for sustainable transportation
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-card border">
              <Zap className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold">Real-Time Tracking</h3>
              <p className="text-muted-foreground text-center">
                Track your ride and nearby AirBears in real-time on the map
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-card border">
              <ShoppingBag className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold">Mobile Bodega</h3>
              <p className="text-muted-foreground text-center">
                Shop essentials onboard during your ride with secure payments
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}