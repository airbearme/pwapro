"use client";

import { useState, useEffect, Suspense } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  MapPin,
  Navigation,
  DollarSign,
  Clock,
  ArrowRight,
  Loader2,
  Map,
  Eye,
  EyeOff,
} from "lucide-react";

import { useAuthContext } from "@/components/auth-provider";
import MapComponent, { type Spot } from "@/components/map-view-beautiful";
import { RidePayment } from "@/components/ride-payment";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { AirbearLocation } from "@/lib/supabase/realtime";

function BookRidePageContent() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [airbears, setAirbears] = useState<AirbearLocation[]>([]);
  const [pickupSpot, setPickupSpot] = useState<Spot | null>(null);
  const [destinationSpot, setDestinationSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [confirmedRide, setConfirmedRide] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);
  const [selectingMode, setSelectingMode] = useState<
    "pickup" | "destination" | null
  >(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadSpots = async () => {
      try {
        // Use regular spots API for now (until numbered spots are set up)
        const response = await fetch("/api/spots");
        if (!response.ok) throw new Error("Failed to fetch spots");

        const { spots } = await response.json();
        setSpots(spots || []);

        // Load AirBears for map display
        const airbearsResponse = await fetch("/api/airbear/locations");
        if (airbearsResponse.ok) {
          const airbearsData = await airbearsResponse.json();
          setAirbears(airbearsData.data || []);

          // Show driver-specific message if applicable
          if (airbearsData.isDriverView) {
            console.log("Driver view: Showing only assigned AirBear");
          }
        }

        // Check for pickup spot from URL
        const pickupId = searchParams.get("pickup");
        if (pickupId && spots) {
          const spot = spots.find((s: any) => s.id === pickupId);
          if (spot) setPickupSpot(spot);
        }
      } catch (error) {
        console.error("Error loading spots:", error);
        toast({
          title: "Error",
          description: "Failed to load locations",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSpots();
  }, [searchParams, toast]);

  const calculateDistance = (spot1: Spot, spot2: Spot): number => {
    const R = 6371; // Earth's radius in km
    const lat1 = spot1.latitude * (Math.PI / 180);
    const lat2 = spot2.latitude * (Math.PI / 180);
    const deltaLat = (spot2.latitude - spot1.latitude) * (Math.PI / 180);
    const deltaLon = (spot2.longitude - spot1.longitude) * (Math.PI / 180);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const estimateFare = (distance: number): number => {
    // Flat rate $4.00 for all rides
    return 4.0;
  };

  const handleSpotSelect = (spot: Spot) => {
    if (selectingMode === "pickup") {
      setPickupSpot(spot);
      setSelectingMode(null);
      toast({
        title: "Pickup Selected",
        description: `Pickup location set to ${spot.name}`,
      });
    } else if (selectingMode === "destination") {
      setDestinationSpot(spot);
      setSelectingMode(null);
      toast({
        title: "Destination Selected",
        description: `Destination set to ${spot.name}`,
      });
    }
  };

  const startMapSelection = (mode: "pickup" | "destination") => {
    setSelectingMode(mode);
    setShowMap(true);
  };

  const handleBookRide = async () => {
    if (!pickupSpot || !destinationSpot || !user) {
      toast({
        title: "Missing Information",
        description: "Please select both pickup and destination locations",
        variant: "destructive",
      });
      return;
    }

    setBooking(true);

    try {
      const distance = calculateDistance(pickupSpot, destinationSpot);
      const fare = estimateFare(distance);

      // Create ride booking via API
      const response = await fetch("/api/rides/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup_spot_id: pickupSpot.id,
          dropoff_spot_id: destinationSpot.id,
          fare,
          distance,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create ride");
      }

      const { ride } = await response.json();

      setConfirmedRide(ride);
      setBookingSuccess(true);

      toast({
        title: "Ride Booked!",
        description: `Your ride from ${pickupSpot.name} to ${destinationSpot.name} has been booked.`,
      });
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setBooking(false);
    }
  };

  const handlePaymentComplete = () => {
    // Payment is complete, ride is confirmed
    console.log("Payment completed");
  };

  const handleRideComplete = () => {
    // Reset the booking flow for a new ride
    setConfirmedRide(null);
    setBookingSuccess(false);
    setPickupSpot(null);
    setDestinationSpot(null);
    toast({
      title: "Ready for Next Ride",
      description: "Book your next AirBear ride!",
    });
  };

  const distance =
    pickupSpot && destinationSpot
      ? calculateDistance(pickupSpot, destinationSpot)
      : 0;
  const fare = estimateFare(distance);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-lime-950 to-amber-950">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-emerald-400/50 dark:border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-lime-500/20 backdrop-blur-sm shadow-2xl hover-lift animate-float overflow-hidden">
              <img
                src="/airbear-mascot.png"
                alt="AirBear Mascot"
                className="w-full h-full object-cover rounded-full animate-pulse-glow"
              />
            </div>
          </div>
          <p className="text-xl text-muted-foreground animate-pulse">
            Loading booking...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-lime-950 to-amber-950 dark:from-emerald-950 dark:via-lime-950 dark:to-amber-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-emerald-400/50 dark:border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 to-lime-500/20 backdrop-blur-sm shadow-2xl hover-lift animate-float overflow-hidden">
              <img
                src="/airbear-mascot.png"
                alt="AirBear Mascot"
                className="w-full h-full object-cover rounded-full animate-pulse-glow"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-600 via-lime-500 to-amber-500 bg-clip-text text-transparent animate-pulse-glow">
            Book Your AirBear Ride
          </h1>
          <p className="text-lg text-muted-foreground">
            Select your pickup and destination locations
          </p>
        </div>

        {/* Map Selection Interface */}
        <Card className="mb-6 hover-lift">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5 text-blue-600" />
                  Visual Location Selection
                </CardTitle>
                <CardDescription>
                  Click on the map to select your pickup and destination
                  locations
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-2"
              >
                {showMap ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                {showMap ? "Hide Map" : "Show Map"}
              </Button>
            </div>
          </CardHeader>
          {showMap && (
            <CardContent>
              {selectingMode && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                  <p className="text-blue-800 dark:text-blue-200 font-medium">
                    📍 Click on a location on the map to set as your{" "}
                    <span className="font-bold">
                      {selectingMode === "pickup" ? "pickup" : "destination"}
                    </span>
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Button
                  onClick={() => startMapSelection("pickup")}
                  variant={selectingMode === "pickup" ? "default" : "outline"}
                  className="flex items-center gap-2"
                  disabled={selectingMode === "destination"}
                >
                  <MapPin className="w-4 h-4" />
                  {pickupSpot
                    ? `📍 ${pickupSpot.name}`
                    : "Select Pickup on Map"}
                </Button>
                <Button
                  onClick={() => startMapSelection("destination")}
                  variant={
                    selectingMode === "destination" ? "default" : "outline"
                  }
                  className="flex items-center gap-2"
                  disabled={selectingMode === "pickup"}
                >
                  <Navigation className="w-4 h-4" />
                  {destinationSpot
                    ? `📍 ${destinationSpot.name}`
                    : "Select Destination on Map"}
                </Button>
              </div>

              <div className="h-96 rounded-lg overflow-hidden border-2 border-muted">
                <MapComponent
                  spots={spots}
                  airbears={airbears}
                  onSpotSelect={handleSpotSelect}
                />
              </div>
            </CardContent>
          )}
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pickup Location */}
          <Card className="p-6 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                Pickup Location
              </CardTitle>
              <CardDescription>Where should we pick you up?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {pickupSpot ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-2 border-emerald-200 dark:border-emerald-800">
                  <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                    {pickupSpot.name}
                  </p>
                  {pickupSpot.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {pickupSpot.description}
                    </p>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setPickupSpot(null)}
                  >
                    Change
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 ml-2"
                    onClick={() => startMapSelection("pickup")}
                  >
                    🗺️ Select on Map
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {spots.map((spot) => (
                    <div
                      key={spot.id}
                      className="p-3 rounded-lg border hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => setPickupSpot(spot)}
                    >
                      <p className="font-medium">{spot.name}</p>
                      {spot.description && (
                        <p className="text-sm text-muted-foreground">
                          {spot.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Destination */}
          <Card className="p-6 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-amber-600" />
                Destination
              </CardTitle>
              <CardDescription>Where are you going?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {destinationSpot ? (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-2 border-amber-200 dark:border-amber-800">
                  <p className="font-semibold text-amber-900 dark:text-amber-100">
                    {destinationSpot.name}
                  </p>
                  {destinationSpot.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {destinationSpot.description}
                    </p>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setDestinationSpot(null)}
                  >
                    Change
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 ml-2"
                    onClick={() => startMapSelection("destination")}
                  >
                    🗺️ Select on Map
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {spots
                    .filter((s) => s.id !== pickupSpot?.id)
                    .map((spot) => (
                      <div
                        key={spot.id}
                        className="p-3 rounded-lg border hover:bg-muted cursor-pointer transition-colors"
                        onClick={() => setDestinationSpot(spot)}
                      >
                        <p className="font-medium">{spot.name}</p>
                        {spot.description && (
                          <p className="text-sm text-muted-foreground">
                            {spot.description}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ride Summary */}
        {pickupSpot && destinationSpot && (
          <Card className="mt-6 p-6 hover-lift">
            <CardHeader>
              <CardTitle>Ride Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-semibold">{pickupSpot.name}</p>
                    <p className="text-sm text-muted-foreground">Pickup</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="font-semibold">{destinationSpot.name}</p>
                    <p className="text-sm text-muted-foreground">Destination</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Navigation className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Distance</p>
                    <p className="font-semibold">{distance.toFixed(1)} km</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Est. Time</p>
                    <p className="font-semibold">
                      {Math.round(distance * 3)} min
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-amber-500/10 rounded-lg border-2 border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Fare
                      </p>
                      <p className="text-2xl font-bold text-emerald-600">
                        ${fare.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleBookRide}
                disabled={booking}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 h-12 text-lg"
              >
                {booking ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : (
                  "Book Ride & Continue to Payment"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Ride Payment Screen */}
        {bookingSuccess && confirmedRide && pickupSpot && destinationSpot && (
          <RidePayment
            ride={confirmedRide}
            pickupSpot={pickupSpot}
            destinationSpot={destinationSpot}
            estimatedArrival={`${Math.round(distance * 3)} min`}
            onPaymentComplete={handlePaymentComplete}
          />
        )}

        {/* Back to Map */}
        <div className="mt-6 text-center">
          <Button asChild variant="outline">
            <Link href="/map">Back to Map</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function BookRidePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading booking...</div>}>
      <BookRidePageContent />
    </Suspense>
  );
}
