"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Clock, DollarSign, CreditCard, Smartphone, QrCode, Banknote } from "lucide-react";

interface RidePaymentProps {
  ride: {
    id: string;
    pickup_spot_id: string;
    dropoff_spot_id: string;
    fare: number;
    distance: number;
    status: string;
    created_at: string;
  };
  pickupSpot: { name: string; address?: string };
  destinationSpot: { name: string; address?: string };
  estimatedArrival: string;
  onPaymentComplete?: () => void;
}

export function RidePayment({
  ride,
  pickupSpot,
  destinationSpot,
  estimatedArrival,
  onPaymentComplete,
}: RidePaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "digital" | "cash">("card");
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleCardPayment = async () => {
    setProcessing(true);
    try {
      // Navigate to checkout with ride information
      const params = new URLSearchParams({
        rideId: ride.id,
        amount: ride.fare.toString(),
        pickupSpot: pickupSpot.name,
        destinationSpot: destinationSpot.name,
      });
      
      // This will be handled by redirecting to checkout page
      window.location.href = `/checkout?${params.toString()}`;
    } catch (error) {
      console.error("Payment navigation error:", error);
      toast({
        title: "Payment Error",
        description: "Failed to proceed to payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleCashPayment = async () => {
    setProcessing(true);
    try {
      // Update ride status to confirmed for cash payment
      const response = await fetch(`/api/rides/${ride.id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: 'cash' })
      });

      if (response.ok) {
        toast({
          title: "Cash Payment Confirmed",
          description: `Please pay $${ride.fare.toFixed(2)} to your AirBear driver when they arrive.`,
        });
        onPaymentComplete?.();
      } else {
        throw new Error("Failed to confirm ride");
      }
    } catch (error) {
      console.error("Cash payment error:", error);
      toast({
        title: "Payment Error",
        description: "Failed to confirm cash payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Ride Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Ride Summary</CardTitle>
            <Badge variant="outline">#{ride.id.slice(-8).toUpperCase()}</Badge>
          </div>
          <CardDescription>
            Complete payment to confirm your AirBear ride
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Route */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-sm">{pickupSpot.name}</p>
              </div>
            </div>
            
            <div className="border-l-2 border-dashed border-muted-foreground ml-1.5 h-4" />
            
            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 rounded-full bg-red-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-sm">{destinationSpot.name}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Fare Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Base Fare</span>
              <span>$4.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Distance ({ride.distance.toFixed(1)} km)</span>
              <span>Included</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-emerald-600">${ride.fare.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          {/* ETA */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Estimated Arrival</span>
            </div>
            <span className="font-medium">{estimatedArrival}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Choose Payment Method</CardTitle>
          <CardDescription>
            Select how you&apos;d like to pay for your ride
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {/* Credit/Debit Card */}
            <Button
              variant={paymentMethod === "card" ? "default" : "outline"}
              className="h-16 justify-start"
              onClick={() => setPaymentMethod("card")}
            >
              <CreditCard className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Credit/Debit Card</div>
                <div className="text-xs text-muted-foreground">Visa, Mastercard, etc.</div>
              </div>
            </Button>

            {/* Digital Wallets */}
            <Button
              variant={paymentMethod === "digital" ? "default" : "outline"}
              className="h-16 justify-start"
              onClick={() => setPaymentMethod("digital")}
            >
              <Smartphone className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Digital Wallet</div>
                <div className="text-xs text-muted-foreground">Apple Pay, Google Pay</div>
              </div>
            </Button>

            {/* Cash */}
            <Button
              variant={paymentMethod === "cash" ? "default" : "outline"}
              className="h-16 justify-start"
              onClick={() => setPaymentMethod("cash")}
            >
              <Banknote className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Pay Cash</div>
                <div className="text-xs text-muted-foreground">Pay driver directly</div>
              </div>
            </Button>
          </div>

          {/* Payment Action */}
          <div className="pt-4 border-t">
            {paymentMethod === "card" && (
              <Button 
                onClick={handleCardPayment} 
                disabled={processing}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 h-12 text-lg"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay with Card - ${ride.fare.toFixed(2)}
                  </>
                )}
              </Button>
            )}

            {paymentMethod === "digital" && (
              <Button 
                onClick={handleCardPayment} 
                disabled={processing}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 h-12 text-lg"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Smartphone className="mr-2 h-4 w-4" />
                    Pay with Digital Wallet - ${ride.fare.toFixed(2)}
                  </>
                )}
              </Button>
            )}

            {paymentMethod === "cash" && (
              <Button 
                onClick={handleCashPayment} 
                disabled={processing}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 h-12 text-lg"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <Banknote className="mr-2 h-4 w-4" />
                    Confirm Cash Payment - ${ride.fare.toFixed(2)}
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
