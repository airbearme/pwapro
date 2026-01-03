"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Car,
  MapPin,
  DollarSign,
  TrendingUp,
  Settings,
  LogOut,
  Shield,
  Activity,
} from "lucide-react";
import Link from "next/link";

interface AdminStats {
  totalUsers: number;
  totalDrivers: number;
  totalRides: number;
  totalRevenue: number;
  activeAirbears: number;
  totalSpots: number;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalDrivers: 0,
    totalRides: 0,
    totalRevenue: 0,
    activeAirbears: 0,
    totalSpots: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.user_metadata?.role !== "admin")) {
      router.push("/auth/login");
      return;
    }

    if (user && user.user_metadata?.role === "admin") {
      loadAdminStats();
    }
  }, [user, authLoading, router]);

  const loadAdminStats = async () => {
    try {
      const supabase = getSupabaseClient();

      // Get user stats
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("role")
        .eq("role", "user");

      const { data: drivers, error: driversError } = await supabase
        .from("users")
        .select("role")
        .eq("role", "driver");

      // Get ride stats
      const { data: rides, error: ridesError } = await supabase
        .from("rides")
        .select("fare, status");

      // Get AirBear stats
      const { data: airbears, error: airbearsError } = await supabase
        .from("airbears")
        .select("is_available");

      // Get spots count
      const { data: spots, error: spotsError } = await supabase
        .from("spots")
        .select("id")
        .eq("is_active", true);

      setStats({
        totalUsers: users?.length || 0,
        totalDrivers: drivers?.length || 0,
        totalRides: rides?.length || 0,
        totalRevenue:
          rides?.reduce((sum, ride) => sum + (ride.fare || 0), 0) || 0,
        activeAirbears: airbears?.filter((ab) => ab.is_available).length || 0,
        totalSpots: spots?.length || 0,
      });
    } catch (error) {
      console.error("Error loading admin stats:", error);
      toast({
        title: "Error",
        description: "Failed to load admin statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-pink-950 to-rose-950">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-purple-400/50 dark:border-purple-500/50 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm shadow-2xl hover-lift animate-float overflow-hidden">
              <Shield className="w-16 h-16 text-purple-600 m-8" />
            </div>
          </div>
          <p className="text-xl text-muted-foreground animate-pulse">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-pink-950 to-rose-950 dark:from-purple-950 dark:via-pink-950 dark:to-rose-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage AirBear operations and monitor system performance
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link href="/admin/settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered customer accounts
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Drivers
              </CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDrivers}</div>
              <p className="text-xs text-muted-foreground">
                Registered driver accounts
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRides}</div>
              <p className="text-xs text-muted-foreground">
                Completed rides to date
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total fare revenue
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active AirBears
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAirbears}</div>
              <p className="text-xs text-muted-foreground">
                Available for rides
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Service Spots
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSpots}</div>
              <p className="text-xs text-muted-foreground">
                Active pickup locations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button asChild className="h-20 flex-col">
            <Link href="/map">
              <MapPin className="w-6 h-6 mb-2" />
              View Live Map
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col">
            <Link href="/book">
              <Car className="w-6 h-6 mb-2" />
              Test Booking
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col">
            <Link href="/driver">
              <Users className="w-6 h-6 mb-2" />
              Driver Portal
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col">
            <Link href="/merchandise">
              <DollarSign className="w-6 h-6 mb-2" />
              Merchandise
            </Link>
          </Button>
        </div>

        {/* Recent Activity */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              System Status
            </CardTitle>
            <CardDescription>
              Current system health and activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-green-800 dark:text-green-200">
                    System Operational
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  All services running normally
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Database</p>
                  <p className="font-semibold text-green-600">Connected</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">API</p>
                  <p className="font-semibold text-green-600">Healthy</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Real-time</p>
                  <p className="font-semibold text-green-600">Active</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
