"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RealtimeDemo from "@/components/realtime-demo";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-lime-950 to-amber-950 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-lime-500 to-amber-500 bg-clip-text text-transparent animate-pulse-glow">
            🚗 AirBear Real-Time System Demo
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Experience the live tracking system that powers AirBear's
            solar-powered rideshare service
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Demo Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>🎮 How to Use This Demo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold mb-2">User Experience</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>Click "User Mode" to simulate booking a ride</li>
                <li>Watch real-time events appear in the feed</li>
                <li>See ride status updates and driver locations</li>
              </ol>

              <h3 className="font-semibold mb-2">Driver Experience</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>Click "Driver Mode" to simulate location updates</li>
                <li>Share GPS coordinates with riders in real-time</li>
                <li>Monitor ride progress and completion</li>
              </ol>
            </CardContent>
          </Card>

          {/* Real-time Demo */}
          <Card>
            <CardHeader>
              <CardTitle>🔄 Live Real-Time Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <RealtimeDemo />
            </CardContent>
          </Card>

          {/* Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>🌐 Back to Live App</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/" className="flex items-center justify-center">
                  Return to Live AirBear App
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
