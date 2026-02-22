"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Car } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function DriverSignupPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    airbear_id: "",
  });

  // If already logged in, redirect to dashboard
  if (user) {
    router.push("/driver");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = getSupabaseClient();

      // First, sign up the user with a temporary password
      const tempPassword = Math.random().toString(36).slice(-8);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: `${formData.username}@airbear.me`,
        password: tempPassword,
        options: {
          data: {
            username: formData.username,
            full_name: formData.full_name,
            role: "driver",
          },
        },
      });

      if (authError) {
        // User might already exist, try to sign them in
        if (authError.message.includes("already registered")) {
          const { data: signInData, error: signInError } =
            await supabase.auth.signInWithPassword({
              email: `${formData.username}@airbear.me`,
              password: tempPassword,
            });

          if (signInError) {
            throw new Error(
              "Account exists but sign-in failed. Please contact support."
            );
          }
        } else {
          throw authError;
        }
      }

      // Create user profile
      const userId = (authData as any)?.user?.id || (user as any)?.id || '';
      const { error: profileError } = await supabase.from("users").upsert({
        id: userId,
        email: `${formData.username}@airbear.me`,
        username: formData.username,
        full_name: formData.full_name,
        role: "driver",
        assigned_airbear_id: formData.airbear_id,
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Don't throw error, user might already have profile
      }

      toast({
        title: "Driver Account Created!",
        description: `Your driver account has been created. Email: ${formData.username}@airbear.me`,
      });

      // Redirect to driver dashboard
      router.push("/driver");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create driver account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-lime-950 to-amber-950">
      <div className="w-full max-w-md px-4">
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
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-600 via-lime-500 to-amber-500 bg-clip-text text-transparent animate-pulse-glow">
            Driver Sign Up
          </h1>
          <p className="text-muted-foreground">Join the AirBear driver team</p>
        </div>

        <Card className="p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5 text-emerald-600" />
              Create Driver Account
            </CardTitle>
            <CardDescription>Enter your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="driver1"
                    value={formData.username}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  This will be your email: username@airbear.me
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="Alex Driver"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="airbear_id">AirBear ID</Label>
                <div className="relative">
                  <Car className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="airbear_id"
                    name="airbear_id"
                    type="text"
                    placeholder="airbear-001"
                    value={formData.airbear_id}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Available IDs: airbear-001, airbear-002, airbear-005,
                  airbear-006, airbear-007
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Driver Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-emerald-600 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
