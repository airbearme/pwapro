"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CheckoutButton } from "@/components/checkout-button";
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
    // This will be handled by the CheckoutButton component
    setTimeout(() => {
      setProcessing(false);
      onPaymentComplete?.();
    }, 2000);
  };

  const handleCashPayment = () => {
    toast({
      title: "Cash Payment Selected",
      description: "Please pay $4.00 to your AirBear driver when they arrive.",
    });
    onPaymentComplete?.();
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
            Select how you'd like to pay for your ride
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
              <CheckoutButton
                items={[
                  {
                    name: "AirBear Ride",
                    price: ride.fare,
                    quantity: 1,
                  },
                ]}
                onSuccess={handleCardPayment}
              />
            )}

            {paymentMethod === "digital" && (
              <CheckoutButton
                items={[
                  {
                    name: "AirBear Ride",
                    price: ride.fare,
                    quantity: 1,
                  },
                ]}
                onSuccess={handleCardPayment}
              />
            )}

            {paymentMethod === "cash" && (
              <Button onClick={handleCashPayment} className="w-full" size="lg">
                <Banknote className="mr-2 h-4 w-4" />
                Confirm Cash Payment
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
