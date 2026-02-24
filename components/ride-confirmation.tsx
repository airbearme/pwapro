"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CheckoutButton } from "@/components/checkout-button";
import {
  MapPin,
  Clock,
  DollarSign,
  User,
  CreditCard,
  Smartphone,
  QrCode,
} from "lucide-react";

interface RideConfirmationProps {
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
  onRideComplete?: () => void;
}

export function RideConfirmation({
  ride,
  pickupSpot,
  destinationSpot,
  estimatedArrival,
  onPaymentComplete,
  onRideComplete,
}: RideConfirmationProps) {
  const [paymentStep, setPaymentStep] = useState<
    "pending" | "processing" | "complete"
  >("pending");
  const [rideStep, setRideStep] = useState<
    "waiting" | "arriving" | "in_progress" | "completed"
  >("waiting");
  const { toast } = useToast();

  const handlePaymentSuccess = () => {
    setPaymentStep("complete");
    setRideStep("arriving");
    toast({
      title: "Payment Successful!",
      description: "Your ride is confirmed. AirBear is on the way!",
    });
    onPaymentComplete?.();

    // Simulate ride progression
    setTimeout(() => {
      setRideStep("in_progress");
      toast({
        title: "AirBear Arrived!",
        description: "Your ride has arrived. Please meet your driver.",
      });
    }, 5000);

    setTimeout(() => {
      setRideStep("completed");
      toast({
        title: "Ride Completed!",
        description: "Thank you for riding with AirBear!",
      });
      onRideComplete?.();
    }, 15000);
  };

  const getRideStatusColor = () => {
    switch (rideStep) {
      case "waiting":
        return "bg-yellow-500";
      case "arriving":
        return "bg-blue-500";
      case "in_progress":
        return "bg-green-500";
      case "completed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRideStatusText = () => {
    switch (rideStep) {
      case "waiting":
        return "Waiting for Payment";
      case "arriving":
        return "AirBear on the Way";
      case "in_progress":
        return "Ride in Progress";
      case "completed":
        return "Ride Completed";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Ride Status Card */}
      <Card className="relative overflow-hidden">
        <div
          className={`absolute top-0 left-0 w-full h-1 ${getRideStatusColor()}`}
        />
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-lime-500 flex items-center justify-center mb-4">
            <span className="text-2xl">🐻</span>
          </div>
          <CardTitle className="text-xl">Your AirBear Ride</CardTitle>
          <CardDescription>
            Ride ID: #{ride.id.slice(-8).toUpperCase()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={getRideStatusColor()}>
              {getRideStatusText()}
            </Badge>
            <div className="text-sm text-muted-foreground">
              ETA: {estimatedArrival}
            </div>
          </div>

          <Separator />

          {/* Route Details */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">{pickupSpot.name}</p>
                {pickupSpot.address && (
                  <p className="text-sm text-muted-foreground">
                    {pickupSpot.address}
                  </p>
                )}
              </div>
            </div>

            <div className="border-l-2 border-dashed border-muted-foreground ml-1.5 h-4" />

            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 rounded-full bg-red-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">{destinationSpot.name}</p>
                {destinationSpot.address && (
                  <p className="text-sm text-muted-foreground">
                    {destinationSpot.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Fare Details */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Base Fare</span>
              <span>$4.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Distance ({ride.distance.toFixed(1)} km)
              </span>
              <span>$0.00</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-lg">${ride.fare.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Section */}
      {paymentStep === "pending" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Payment Required
            </CardTitle>
            <CardDescription>
              Complete payment to confirm your ride
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CheckoutButton
              items={[
                {
                  name: "AirBear Ride",
                  price: ride.fare,
                  quantity: 1,
                },
              ]}
              onSuccess={handlePaymentSuccess}
            />
          </CardContent>
        </Card>
      )}

      {/* Ride Progress */}
      {paymentStep === "complete" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Ride Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div
                className={`flex items-center space-x-3 ${
                  rideStep === "waiting" ||
                  rideStep === "arriving" ||
                  rideStep === "in_progress" ||
                  rideStep === "completed"
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full ${
                    rideStep === "waiting" ||
                    rideStep === "arriving" ||
                    rideStep === "in_progress" ||
                    rideStep === "completed"
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
                <span>Payment Confirmed</span>
              </div>

              <div
                className={`flex items-center space-x-3 ${
                  rideStep === "arriving" ||
                  rideStep === "in_progress" ||
                  rideStep === "completed"
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full ${
                    rideStep === "arriving" ||
                    rideStep === "in_progress" ||
                    rideStep === "completed"
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
                <span>AirBear Dispatched</span>
              </div>

              <div
                className={`flex items-center space-x-3 ${
                  rideStep === "in_progress" || rideStep === "completed"
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full ${
                    rideStep === "in_progress" || rideStep === "completed"
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
                <span>Ride in Progress</span>
              </div>

              <div
                className={`flex items-center space-x-3 ${
                  rideStep === "completed"
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full ${
                    rideStep === "completed" ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <span>Ride Completed</span>
              </div>
            </div>

            {rideStep === "completed" && (
              <div className="text-center pt-4">
                <Button onClick={onRideComplete} className="w-full">
                  Book Another Ride
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
