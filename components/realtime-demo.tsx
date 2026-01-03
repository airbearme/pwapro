"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Navigation,
  Users,
  Battery,
  Wifi,
  Activity,
} from "lucide-react";

interface RealtimeEvent {
  type: "user_booking" | "driver_location" | "ride_status";
  timestamp: string;
  data: any;
}

export default function RealtimeDemo() {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [simulation, setSimulation] = useState<"user" | "driver">("user");

  // Simulate receiving real-time events
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        const mockEvent: RealtimeEvent = {
          type: Math.random() > 0.5 ? "driver_location" : "ride_status",
          timestamp: new Date().toISOString(),
          data:
            Math.random() > 0.5
              ? {
                  driver_id: "driver_456",
                  airbear_id: "airbear_001",
                  latitude: 42.099118 + (Math.random() - 0.5) * 0.01,
                  longitude: -75.917538 + (Math.random() - 0.5) * 0.01,
                  heading: 45.5 + (Math.random() - 0.5) * 5,
                  battery_level: 95 - Math.random() * 10,
                  status: "active",
                }
              : {
                  ride_id: "ride_789",
                  status: Math.random() > 0.7 ? "completed" : "in_progress",
                  current_location: {
                    latitude: 42.099118 + (Math.random() - 0.5) * 0.02,
                    longitude: -75.917538 + (Math.random() - 0.5) * 0.02,
                  },
                },
        };

        setEvents((prev) => [mockEvent, ...prev].slice(-4)); // Keep last 4 events
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const simulateEvent = async (type: string) => {
    try {
      const response = await fetch("/api/demo/realtime-simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: type }),
      });

      const event = await response.json();
      setEvents((prev) => [event, ...prev].slice(-4));
    } catch (error) {
      console.error("Simulation error:", error);
    }
  };

  const clearEvents = () => {
    setEvents([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-lime-950 to-amber-950 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-lime-500 to-amber-500 bg-clip-text text-transparent animate-pulse-glow">
            🚗 Real-Time AirBear System Demo
          </h1>
          <p className="text-lg text-muted-foreground">
            Experience live tracking, driver locations, and ride status updates
          </p>
        </div>

        {/* Simulation Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Simulation Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={() => setSimulation("user")}
                variant={simulation === "user" ? "default" : "outline"}
                className="flex-1"
              >
                <Users className="w-4 h-4" />
                User Mode
              </Button>
              <Button
                onClick={() => setSimulation("driver")}
                variant={simulation === "driver" ? "default" : "outline"}
                className="flex-1"
              >
                <Wifi className="w-4 h-4" />
                Driver Mode
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setIsConnected(!isConnected)}
                variant={isConnected ? "default" : "outline"}
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {isConnected ? "Disconnect" : "Connect"} Real-time
              </Button>
              <Button
                onClick={clearEvents}
                variant="outline"
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Clear Events
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Booking Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-emerald-600" />
                User Booking Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Last Action:
                  </span>
                  <Badge variant="secondary">
                    {events.find((e) => e.type === "user_booking")
                      ? "Booked Ride"
                      : "No recent bookings"}
                  </Badge>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold">
                    {simulation === "user"
                      ? "👤 User Perspective"
                      : "🚗 Driver Perspective"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {simulation === "user"
                      ? "Watch your booking status and ride tracking in real-time"
                      : "Monitor your location and share GPS coordinates with riders"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Driver Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                Driver Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge
                    variant={
                      events.find((e) => e.type === "driver_location")
                        ? "default"
                        : "secondary"
                    }
                  >
                    {events.find((e) => e.type === "driver_location")
                      ? "Active"
                      : "Inactive"}
                  </Badge>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold">
                    {simulation === "driver"
                      ? "🚗 Driver View"
                      : "👤 User View"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {simulation === "driver"
                      ? "Share your real-time location with riders"
                      : "See driver location updates on the map"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ride Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Battery className="w-5 h-5 text-emerald-600" />
                Ride Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Current Ride:
                  </span>
                  <Badge
                    variant={
                      events.find((e) => e.type === "ride_status")?.data
                        ?.status === "in_progress"
                        ? "default"
                        : events.find((e) => e.type === "ride_status")?.data
                            ?.status === "completed"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {events.find((e) => e.type === "ride_status")?.data
                      ?.status || "No active rides"}
                  </Badge>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold">
                    {events.find((e) => e.type === "ride_status")?.data
                      ?.status === "in_progress"
                      ? "🚗 Ride In Progress"
                      : events.find((e) => e.type === "ride_status")?.data
                          ?.status === "completed"
                      ? "✅ Ride Completed"
                      : "No Active Rides"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {events.find((e) => e.type === "ride_status")?.data
                      ?.status === "in_progress"
                      ? `Driver is en route to ${events
                          .find((e) => e.type === "ride_status")
                          ?.data?.current_location?.latitude?.toFixed(
                            4
                          )}, ${events
                          .find((e) => e.type === "ride_status")
                          ?.data?.current_location?.longitude?.toFixed(4)}`
                      : "Waiting for ride assignments"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Events Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-emerald-600" />
              Live Events Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {events.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p>
                    No events yet. Connect to real-time simulation to see
                    updates.
                  </p>
                </div>
              ) : (
                events.map((event, index) => (
                  <div key={index} className="border-l p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                      <Badge
                        variant={
                          event.type === "user_booking"
                            ? "default"
                            : event.type === "driver_location"
                            ? "secondary"
                            : event.type === "ride_status"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {event.type.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm">
                      {event.type === "user_booking" && (
                        <div>
                          <strong>User Booking:</strong>{" "}
                          {event.data.pickup_spot} →{" "}
                          {event.data.destination_spot}
                          <div className="text-xs text-muted-foreground mt-1">
                            Fare: ${event.data.fare} | Status:{" "}
                            {event.data.status}
                          </div>
                        </div>
                      )}
                      {event.type === "driver_location" && (
                        <div>
                          <strong>Driver Location:</strong> AirBear{" "}
                          {event.data.airbear_id}
                          <div className="text-xs text-muted-foreground mt-1">
                            GPS: {event.data.latitude.toFixed(4)},{" "}
                            {event.data.longitude.toFixed(4)} | Battery:{" "}
                            {event.data.battery_level}%
                          </div>
                        </div>
                      )}
                      {event.type === "ride_status" && (
                        <div>
                          <strong>Ride Status:</strong> {event.data.status}
                          {event.data.current_location
                            ? `Location: ${event.data.current_location.latitude.toFixed(
                                4
                              )}, ${event.data.current_location.longitude.toFixed(
                                4
                              )}`
                            : "No location data"}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
