"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Navigation,
  Battery,
  MapPin,
  Activity,
  Clock,
  CheckCircle,
  X,
  RefreshCw,
  User,
} from "lucide-react";
import Link from "next/link";
import { useAuthContext } from "@/components/auth-provider";
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Ride {
  id: string;
  user_id: string;
  pickup_spot_id: string;
  dropoff_spot_id: string;
  status: string;
  fare: number;
  distance: number;
  created_at: string;
  pickup_spot?: { name: string };
  dropoff_spot?: { name: string };
}

interface AirBear {
  id: string;
  current_spot_id?: string;
  latitude: number;
  longitude: number;
  battery_level: number;
  is_available: boolean;
  is_charging: boolean;
  heading: number;
  updated_at: string;
}

export default function DriverDashboardPage() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();
  const [pendingRides, setPendingRides] = useState<Ride[]>([]);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [spots, setSpots] = useState<Record<string, { name: string }>>({});
  const [driverAirbear, setDriverAirbear] = useState<AirBear | null>(null);
  const [updatingLocation, setUpdatingLocation] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const supabase = getSupabaseClient();

        // Load spots
        const { data: spotsData } = await supabase
          .from("spots")
          .select("id, name");

        if (spotsData) {
          const spotsMap: Record<string, { name: string }> = {};
          spotsData.forEach((spot: any) => {
            spotsMap[spot.id] = { name: spot.name };
          });
          setSpots(spotsMap);
        }

        // Load driver's profile to get assigned AirBear
        const { data: userProfile } = await supabase
          .from("users")
          .select("assigned_airbear_id")
          .eq("id", user.id)
          .single();

        // Load driver's assigned AirBear
        if (userProfile?.assigned_airbear_id) {
          const { data: airbearData } = await supabase
            .from("airbears")
            .select("*")
            .eq("id", userProfile.assigned_airbear_id)
            .single();

          setDriverAirbear(airbearData);
        }

        // Load pending rides
        const { data: ridesData, error } = await supabase
          .from("rides")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: true });

        if (error) throw error;
        setPendingRides(ridesData || []);

        // Load active ride for this driver
        const { data: activeRideData } = await supabase
          .from("rides")
          .select("*")
          .eq("driver_id", user.id)
          .in("status", ["accepted", "in_progress"])
          .single();

        setActiveRide(activeRideData || null);
      } catch (error) {
        console.error("Error loading driver data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Refresh every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const handleAcceptRide = async (rideId: string) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/rides/${rideId}/accept`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to accept ride");
      }

      toast({
        title: "Ride Accepted!",
        description: "You've accepted the ride. Navigate to pickup location.",
      });

      // Reload data
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to accept ride",
        variant: "destructive",
      });
    }
  };

  const handleStartRide = async (rideId: string) => {
    try {
      const supabase = getSupabaseClient();

      const { error } = await supabase
        .from("rides")
        .update({
          status: "in_progress",
          started_at: new Date().toISOString(),
        })
        .eq("id", rideId)
        .eq("driver_id", user?.id);

      if (error) throw error;

      toast({
        title: "Ride Started!",
        description: "Navigate to the destination.",
      });

      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start ride",
        variant: "destructive",
      });
    }
  };

  const handleCompleteRide = async (rideId: string) => {
    try {
      const response = await fetch(`/api/rides/${rideId}/complete`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to complete ride");
      }

      toast({
        title: "Ride Completed!",
        description: "Great job! The ride has been completed.",
      });

      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete ride",
        variant: "destructive",
      });
    }
  };

  const handleUpdateLocation = async () => {
    if (!driverAirbear) return;

    setUpdatingLocation(true);
    try {
      // Get current location
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        },
      );

      const response = await fetch("/api/airbear/update-location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          airbear_id: driverAirbear.id,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update location");
      }

      toast({
        title: "Location Updated!",
        description: "Your AirBear location has been updated.",
      });

      // Reload data to show updated location
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update location",
        variant: "destructive",
      });
    } finally {
      setUpdatingLocation(false);
    }
  };

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
            Loading driver dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-lime-950 to-amber-950 dark:from-emerald-950 dark:via-lime-950 dark:to-amber-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
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
            Driver Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Welcome, {user.email?.split("@")[0] || "Driver"}
          </p>
        </div>

        {/* AirBear Status */}
        {driverAirbear ? (
          <Card className="mb-6 p-6 border-2 border-blue-500 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Your Assigned AirBear: {driverAirbear.id.toUpperCase()}
              </CardTitle>
              <CardDescription>
                This is your personal vehicle for ride requests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Battery className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-muted-foreground">
                      Battery
                    </span>
                  </div>
                  <p className="text-lg font-bold text-blue-600">
                    {driverAirbear.battery_level}%
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                  </div>
                  <Badge
                    className={
                      driverAirbear.is_available
                        ? "bg-green-100 text-green-800"
                        : driverAirbear.is_charging
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {driverAirbear.is_charging
                      ? "Charging"
                      : driverAirbear.is_available
                        ? "Available"
                        : "In Use"}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Navigation className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-muted-foreground">
                      Heading
                    </span>
                  </div>
                  <p className="text-lg font-bold text-purple-600">
                    {driverAirbear.heading.toFixed(0)}°
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-muted-foreground">
                      Location
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {driverAirbear.latitude.toFixed(4)},{" "}
                    {driverAirbear.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleUpdateLocation}
                  disabled={updatingLocation}
                  className="bg-gradient-to-r from-blue-500 to-blue-600"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${
                      updatingLocation ? "animate-spin" : ""
                    }`}
                  />
                  {updatingLocation ? "Updating..." : "Update Location"}
                </Button>
                <Button asChild variant="outline">
                  <Link href="/map">View on Map</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 p-6 border-2 border-orange-500 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-orange-600" />
                No AirBear Assigned
              </CardTitle>
              <CardDescription>
                You need an assigned AirBear to accept ride requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  Please contact an administrator to get your AirBear vehicle
                  assignment.
                </p>
                <Button variant="outline" disabled>
                  Contact Admin
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Ride */}
        {activeRide && (
          <Card className="mb-6 p-6 border-2 border-emerald-500 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                Active Ride
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>
                    {spots[activeRide.pickup_spot_id]?.name || "Pickup"} →{" "}
                    {spots[activeRide.dropoff_spot_id]?.name || "Destination"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Requested: {new Date(activeRide.created_at).toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      activeRide.status === "accepted"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }
                  >
                    {activeRide.status.replace("_", " ").toUpperCase()}
                  </Badge>
                  <span className="text-lg font-bold text-emerald-600">
                    ${activeRide.fare?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {activeRide.status === "accepted" && (
                  <Button
                    onClick={() => handleStartRide(activeRide.id)}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600"
                  >
                    Start Ride
                  </Button>
                )}
                {activeRide.status === "in_progress" && (
                  <Button
                    onClick={() => handleCompleteRide(activeRide.id)}
                    className="bg-gradient-to-r from-green-500 to-green-600"
                  >
                    Complete Ride
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Rides */}
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Pending Ride Requests</CardTitle>
            <CardDescription>Accept rides to start earning</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingRides.length === 0 ? (
              <div className="text-center py-12">
                <Navigation className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-semibold mb-2">No pending rides</p>
                <p className="text-muted-foreground">
                  New ride requests will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRides.map((ride) => (
                  <div
                    key={ride.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            PENDING
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(ride.created_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-emerald-600" />
                            <span>
                              {spots[ride.pickup_spot_id]?.name || "Pickup"} →{" "}
                              {spots[ride.dropoff_spot_id]?.name ||
                                "Destination"}
                            </span>
                          </div>
                          {ride.distance && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Navigation className="w-4 h-4" />
                              {ride.distance.toFixed(1)} km
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-600 mb-2">
                          ${ride.fare?.toFixed(2) || "0.00"}
                        </p>
                        <Button
                          onClick={() => handleAcceptRide(ride.id)}
                          className="bg-gradient-to-r from-emerald-500 to-emerald-600"
                          size="sm"
                        >
                          Accept Ride
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 text-center">
          <Button asChild variant="outline">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
