"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useAuthContext } from "@/components/auth-provider";
import { MapPin } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { CheckoutButton } from "@/components/checkout-button";
import errorLogger from "@/lib/error-logger";

interface OneClickBookingProps {
  pickupSpotId: string;
  destinationSpotId: string;
  fare: number;
  distance: number;
  onSuccess?: () => void;
}

export function OneClickBooking({
  pickupSpotId,
  destinationSpotId,
  fare,
  distance,
  onSuccess,
}: OneClickBookingProps) {
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthContext();

  const handleOneClickBook = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book a ride",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Create ride booking via API
      const response = await fetch("/api/rides/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup_spot_id: pickupSpotId,
          dropoff_spot_id: destinationSpotId,
          fare,
          distance,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create ride");
      }

      const { ride } = await response.json();

      // Show payment options
      setShowPayment(true);

      toast({
        title: "Ride Booked!",
        description: "Please complete payment to confirm your ride.",
      });
    } catch (error: any) {
      errorLogger.logError(error, {
        component: "OneClickBooking",
        action: "handleOneClickBook",
      });

      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    toast({
      title: "Payment Successful!",
      description: "Your ride is confirmed. An AirBear will arrive soon!",
    });
    setShowPayment(false);
    onSuccess?.();
  };

  if (showPayment) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Complete Payment</CardTitle>
          <CardDescription>Total: ${fare.toFixed(2)}</CardDescription>
        </CardHeader>
        <CardContent>
          <CheckoutButton
            items={[
              {
                name: "AirBear Ride",
                price: fare,
                quantity: 1,
              },
            ]}
            onSuccess={handlePaymentSuccess}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Button
      onClick={handleOneClickBook}
      disabled={loading}
      aria-disabled={loading}
      size="lg"
      className="w-full eco-gradient text-white hover-lift ripple-effect animate-neon-glow shadow-xl"
    >
      {loading ? (
        <>
          <Spinner className="mr-2 h-5 w-5" />
          <span role="status">Booking...</span>
        </>
      ) : (
        <>
          <MapPin className="mr-2 h-5 w-5" />
          Book Now - ${fare.toFixed(2)}
        </>
      )}
    </Button>
  );
}

