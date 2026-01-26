"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
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
import { useRouter, useSearchParams } from "next/navigation";
import { Apple, Phone, Mail, Eye, EyeOff, Loader2, UserCircle, Truck, Shield } from "lucide-react";
import Link from "next/link";

type AuthMode = "email" | "phone";
type UserRole = "user" | "driver" | "admin";

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<AuthMode>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = getSupabaseClient();

  // Get role from URL params or default to user
  const roleParam = searchParams.get("role") as UserRole | null;
  const [selectedRole, setSelectedRole] = useState<UserRole>(roleParam || "user");

  // Particle effects for background
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => (
      <div
        key={i}
        className="absolute rounded-full animate-particle opacity-50"
        style={{
          left: `${(i * 5) % 100}%`,
          top: `${(i * 7) % 100}%`,
          animationDelay: `${i * 0.3}s`,
          animationDuration: `${4 + (i % 3)}s`,
          width: `${3 + (i % 4)}px`,
          height: `${3 + (i % 4)}px`,
          backgroundColor:
            i % 3 === 0
              ? "rgb(34, 197, 94)"
              : i % 3 === 1
                ? "rgb(251, 191, 36)"
                : "rgb(56, 189, 248)",
        }}
      />
    ));
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?role=${selectedRole}`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        setError(error.message || "Failed to sign in with Google");
        setLoading(false);
      } else if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?role=${selectedRole}`,
        },
      });

      if (error) {
        setError(error.message || "Failed to sign in with Apple");
        setLoading(false);
      } else if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Redirect based on role
      const redirectPath = selectedRole === "driver" ? "/driver" : selectedRole === "admin" ? "/admin" : "/dashboard";
      router.push(redirectPath);
    }
  };

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setError(null);

    // Format phone number
    const formattedPhone = phone.startsWith("+") ? phone : `+1${phone.replace(/\D/g, "")}`;

    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
      options: {
        data: {
          role: selectedRole,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setOtpSent(true);
      setSuccess("Verification code sent to your phone!");
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError(null);

    const formattedPhone = phone.startsWith("+") ? phone : `+1${phone.replace(/\D/g, "")}`;

    const { error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otp,
      type: "sms",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      const redirectPath = selectedRole === "driver" ? "/driver" : selectedRole === "admin" ? "/admin" : "/dashboard";
      router.push(redirectPath);
    }
  };

  const roleInfo = {
    user: { icon: UserCircle, label: "Rider", color: "from-emerald-500 to-lime-500", description: "Book rides and shop the bodega" },
    driver: { icon: Truck, label: "Driver", color: "from-amber-500 to-orange-500", description: "Accept rides and earn money" },
    admin: { icon: Shield, label: "Admin", color: "from-sky-500 to-blue-600", description: "Manage fleet and operations" },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-lime-950 to-amber-950 p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl animate-float" />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 glass-morphism relative z-10 overflow-hidden">
        {/* Card glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-amber-500/5 pointer-events-none" />
        
        <CardHeader className="space-y-1 text-center relative">
          {/* AirBear Mascot */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-emerald-400/50 bg-gradient-to-br from-emerald-500/20 to-lime-500/20 backdrop-blur-sm shadow-2xl hover-lift animate-float overflow-hidden">
              <img
                src="/airbear-mascot.png"
                alt="AirBear Mascot"
                className="w-full h-full object-cover rounded-full animate-pulse-glow"
              />
            </div>
          </div>
          
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-lime-400 to-amber-400 bg-clip-text text-transparent">
            Welcome to AirBear
          </CardTitle>
          <CardDescription className="text-base text-foreground/70">
            Sign in to your account
          </CardDescription>

          {/* Role Selector */}
          <div className="flex gap-2 mt-4 p-1 bg-black/20 rounded-xl">
            {(Object.keys(roleInfo) as UserRole[]).map((role) => {
              const { icon: Icon, label, color } = roleInfo[role];
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all duration-300 ${
                    isSelected
                      ? `bg-gradient-to-r ${color} text-white shadow-lg`
                      : "text-foreground/60 hover:text-foreground hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {roleInfo[selectedRole].description}
          </p>
        </CardHeader>

        <CardContent className="space-y-4 relative">
          {error && (
            <div className="p-3 text-sm text-red-100 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm animate-pulse">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-emerald-100 bg-emerald-500/20 border border-emerald-500/30 rounded-lg backdrop-blur-sm">
              {success}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-base font-medium bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-base font-medium bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300"
              onClick={handleAppleSignIn}
              disabled={loading}
            >
              <Apple className="mr-3 h-5 w-5" />
              Continue with Apple
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card/80 backdrop-blur-sm px-3 text-muted-foreground rounded-full">
                Or continue with
              </span>
            </div>
          </div>

          {/* Auth Mode Tabs */}
          <div className="flex gap-2 p-1 bg-black/20 rounded-lg">
            <button
              onClick={() => { setAuthMode("email"); setError(null); setOtpSent(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all duration-300 ${
                authMode === "email"
                  ? "bg-white/20 text-foreground shadow-sm"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              <Mail className="h-4 w-4" />
              <span className="text-sm font-medium">Email</span>
            </button>
            <button
              onClick={() => { setAuthMode("phone"); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all duration-300 ${
                authMode === "phone"
                  ? "bg-white/20 text-foreground shadow-sm"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              <Phone className="h-4 w-4" />
              <span className="text-sm font-medium">Phone</span>
            </button>
          </div>

          {/* Email Login Form */}
          {authMode === "email" && (
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground/80">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 bg-white/5 border-white/20 focus:border-emerald-400/50 focus:ring-emerald-400/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground/80">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 bg-white/5 border-white/20 focus:border-emerald-400/50 focus:ring-emerald-400/20 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className={`w-full h-12 text-base font-semibold bg-gradient-to-r ${roleInfo[selectedRole].color} hover:opacity-90 transition-all duration-300 shadow-lg hover-lift`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          )}

          {/* Phone Login Form */}
          {authMode === "phone" && !otpSent && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground/80">Phone Number</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50 text-sm">+1</span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                    className="h-12 bg-white/5 border-white/20 focus:border-emerald-400/50 focus:ring-emerald-400/20 pl-10"
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={handleSendOTP}
                className={`w-full h-12 text-base font-semibold bg-gradient-to-r ${roleInfo[selectedRole].color} hover:opacity-90 transition-all duration-300 shadow-lg hover-lift`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending code...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            </div>
          )}

          {/* OTP Verification Form */}
          {authMode === "phone" && otpSent && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-foreground/80">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  disabled={loading}
                  className="h-12 bg-white/5 border-white/20 focus:border-emerald-400/50 focus:ring-emerald-400/20 text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </div>

              <Button
                type="submit"
                className={`w-full h-12 text-base font-semibold bg-gradient-to-r ${roleInfo[selectedRole].color} hover:opacity-90 transition-all duration-300 shadow-lg hover-lift`}
                disabled={loading || otp.length < 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Sign In"
                )}
              </Button>

              <button
                type="button"
                onClick={() => { setOtpSent(false); setOtp(""); setSuccess(null); }}
                className="w-full text-sm text-foreground/60 hover:text-foreground transition-colors"
              >
                Change phone number
              </button>
            </form>
          )}

          {/* Footer Links */}
          <div className="space-y-3 pt-4 text-center text-sm">
            <p className="text-foreground/60">
              {"Don't have an account? "}
              <Link
                href={`/auth/signup?role=${selectedRole}`}
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
            <p className="text-foreground/60">
              <Link
                href="/auth/forgot-password"
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                Forgot your password?
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
