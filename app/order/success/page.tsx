"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

function OrderSuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [ride, setRide] = useState<any>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (sessionId) {
      // In a real app, you'd verify the session with Stripe
      // For now, we'll show a success message
      setLoading(false);

      // You could fetch ride details using the session metadata
      // const response = await fetch(`/api/rides/session/${sessionId}`);
      // const rideData = await response.json();
      // setRide(rideData);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-lime-950 to-amber-950">
        <div className="text-center">
          <div className="w-32 h-32 rounded-full border-4 border-emerald-400/50 dark:border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-lime-500/20 backdrop-blur-sm shadow-2xl hover-lift animate-float overflow-hidden">
            <img
              src="/airbear-mascot.png"
              alt="AirBear Mascot"
              className="w-full h-full object-cover rounded-full animate-pulse-glow"
            />
          </div>
          <p className="text-xl text-muted-foreground animate-pulse">
            Processing your payment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-lime-950 to-amber-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-emerald-400/50 dark:border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-lime-500/20 backdrop-blur-sm shadow-2xl hover-lift animate-float overflow-hidden">
              <img
                src="/airbear-mascot.png"
                alt="AirBear Mascot"
                className="w-full h-full object-cover rounded-full animate-pulse-glow"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-600 via-lime-500 to-amber-500 bg-clip-text text-transparent animate-pulse-glow">
            Payment Successful!
          </h1>
          <p className="text-lg text-muted-foreground">
            Your AirBear ride has been booked and paid for.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              Ride Booking Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-2 border-emerald-200 dark:border-emerald-800">
              <div>
                <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                  🎉 Congratulations!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your $4.00 ride payment has been processed successfully.
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">What&apos;s Next?</h3>
              <p className="text-muted-foreground">
                Your AirBear driver will arrive at your pickup location. You can
                track your ride in real-time on the map.
              </p>
              <div className="flex gap-4 mt-4">
                <Button asChild className="flex-1">
                  <Link href="/map">Track Your Ride</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/" className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Book Another Ride
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          Loading success page...
        </div>
      }
    >
      <OrderSuccessPageContent />
    </Suspense>
  );
}
