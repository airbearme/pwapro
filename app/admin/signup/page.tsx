"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Lock, Shield, Key } from "lucide-react";
import Link from "next/link";

export default function AdminSignupPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    admin_code: "",
  });

  // If already logged in, redirect to dashboard
  if (user) {
    router.push("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = getSupabaseClient();

      // Verify admin code (simple validation for demo)
      if (formData.admin_code !== "AIRBEAR2024") {
        toast({
          title: "Invalid Admin Code",
          description: "Please enter a valid admin registration code",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // First, sign up the user with a temporary password
      const tempPassword = Math.random().toString(36).slice(-8);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: `${formData.username}@airbear.me`,
        password: tempPassword,
        options: {
          data: {
            username: formData.username,
            full_name: formData.full_name,
            role: "admin",
          },
        },
      });

      if (authError) {
        console.error("Auth error:", authError);
        toast({
          title: "Signup Error",
          description: authError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (authData.user) {
        // Create user profile with admin role
        const { error: profileError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: authData.user.email!,
          username: formData.username,
          full_name: formData.full_name,
          role: "admin",
          eco_points: 0,
          total_rides: 0,
          co2_saved: 0,
          has_ceo_tshirt: true, // Admins get CEO t-shirt by default
        });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          toast({
            title: "Profile Error",
            description: "Account created but profile setup failed",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Admin Account Created!",
            description: `Welcome ${formData.full_name}! Your admin account has been created.`,
          });

          // Redirect to admin dashboard
          setTimeout(() => {
            router.push("/admin");
          }, 2000);
        }
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create admin account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-pink-950 to-rose-950 dark:from-purple-950 dark:via-pink-950 dark:to-rose-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md hover-lift">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full border-4 border-purple-400/50 dark:border-purple-500/50 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm shadow-2xl hover-lift animate-float overflow-hidden">
              <Shield className="w-8 h-8 text-purple-600 m-4" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent">
            Admin Signup
          </CardTitle>
          <CardDescription>
            Create an admin account to manage AirBear operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="admin_username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
                className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="full_name"
                type="text"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                required
                className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin_code" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                Admin Registration Code
              </Label>
              <Input
                id="admin_code"
                type="password"
                placeholder="Enter admin code"
                value={formData.admin_code}
                onChange={(e) =>
                  setFormData({ ...formData, admin_code: e.target.value })
                }
                required
                className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
              />
              <p className="text-xs text-muted-foreground">
                Contact system administrator for registration code
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {loading ? "Creating Admin Account..." : "Create Admin Account"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Already have an admin account?{" "}
              <Link
                href="/auth/login"
                className="text-purple-600 hover:underline"
              >
                Sign in
              </Link>
            </p>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <Link href="/auth/signup" className="hover:text-purple-600">
                User Signup
              </Link>
              <Link href="/driver/signup" className="hover:text-purple-600">
                Driver Signup
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
