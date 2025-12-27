import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, ShoppingBag, Leaf, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-transparent to-orange-50/50 pointer-events-none" />
      
      {/* Particle effects background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-green-400 rounded-full animate-particle opacity-60" style={{ animationDelay: "0s" }} />
        <div className="absolute top-40 right-20 w-3 h-3 bg-orange-400 rounded-full animate-particle opacity-50" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-green-300 rounded-full animate-particle opacity-70" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-orange-300 rounded-full animate-particle opacity-60" style={{ animationDelay: "3s" }} />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          {/* Logo with float animation */}
          <div className="mb-6 animate-float">
            <img
              src="/airbear-logo.png"
              alt="AirBear Logo"
              className="w-32 h-32 mx-auto object-contain drop-shadow-lg"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-balance">
              Welcome to <span className="text-primary bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent animate-pulse-glow">AirBear</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-pretty max-w-2xl">
              Solar-powered rideshare with onboard mobile bodegas. Sustainable transportation meets convenience.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button 
              asChild 
              size="lg" 
              className="text-lg hover-lift bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/map">
                <MapPin className="mr-2 h-5 w-5" />
                Book a Ride
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="text-lg hover-lift bg-white/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/products">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Bodega
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-4xl">
            <div className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-white/70 backdrop-blur-md border border-white/50 shadow-lg hover-lift hover:shadow-xl transition-all duration-300">
              <div className="p-3 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg animate-pulse-glow">
                <Leaf className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Eco-Friendly</h3>
              <p className="text-muted-foreground text-center">
                100% solar-powered vehicles for sustainable transportation
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-white/70 backdrop-blur-md border border-white/50 shadow-lg hover-lift hover:shadow-xl transition-all duration-300">
              <div className="p-3 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg animate-pulse-glow" style={{ animationDelay: "0.5s" }}>
                <Zap className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Real-Time Tracking</h3>
              <p className="text-muted-foreground text-center">
                Track your ride and nearby AirBears in real-time on the map
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-white/70 backdrop-blur-md border border-white/50 shadow-lg hover-lift hover:shadow-xl transition-all duration-300">
              <div className="p-3 rounded-full bg-gradient-to-br from-green-400 to-orange-500 shadow-lg animate-pulse-glow" style={{ animationDelay: "1s" }}>
                <ShoppingBag className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">Mobile Bodega</h3>
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