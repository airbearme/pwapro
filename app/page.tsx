/**
 * 🎨 CORE UI/UX FOUNDATION - PERMANENT & PROTECTED
 *
 * ⚠️ CRITICAL: This homepage showcases AirBear's visual identity.
 * MUST include: animate-float, animate-pulse-glow, hover-lift, particle effects
 *
 * See: CORE_UI_FOUNDATION.md for documentation
 */

"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, ShoppingBag, Leaf, Zap, Crown } from "lucide-react";
import AirbearWheel from "@/components/airbear-wheel";

export default function HomePage() {
  // ⚡ Bolt: Memoize particle effects to prevent re-calculation on every render.
  // These are static visual elements, so they only need to be computed once.
  const particleEffects = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => (
      <div
        key={i}
        className="absolute rounded-full animate-particle opacity-70"
        style={{
          left: `${(i * 8) % 100}%`,
          top: `${(i * 15) % 100}%`,
          animationDelay: `${i * 0.5}s`,
          width: `${2 + (i % 3)}px`,
          height: `${2 + (i % 3)}px`,
          backgroundColor:
            i % 3 === 0
              ? "rgb(34, 197, 94)"
              : i % 3 === 1
                ? "rgb(56, 189, 248)"
                : "rgb(251, 191, 36)",
        }}
      />
    ));
  }, []);

  const sparkleRings = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => (
      <div
        key={`ring-${i}`}
        className="absolute border border-emerald-400/20 rounded-full animate-pulse-glow"
        style={{
          left: `${10 + i * 8}%`,
          top: `${15 + ((i * 13) % 70)}%`,
          width: `${40 + (i % 4) * 16}px`,
          height: `${40 + (i % 4) * 16}px`,
          animationDelay: `${i * 0.4}s`,
        }}
      />
    ));
  }, []);

  const holographicOverlays = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full opacity-60 animate-pulse-glow"
        style={{
          left: `${20 + i * 10}%`,
          top: `${30 + Math.sin(i) * 20}%`,
          animationDelay: `${i * 0.3}s`,
        }}
      />
    ));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-950 via-lime-950 to-amber-950 dark:from-emerald-950 dark:via-lime-950 dark:to-amber-950 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(34,197,94,0.28),transparent_55%),radial-gradient(900px_circle_at_80%_20%,rgba(56,189,248,0.22),transparent_55%),radial-gradient(700px_circle_at_50%_90%,rgba(236,72,153,0.2),transparent_60%)] relative overflow-hidden">
      {/* DEBUG: Dark Mode & Beautiful UI - Version 2.0.5 - FORCED REDEPLOY */}
      <div className="fixed top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg z-50 glass-morphism">
        🌙 Dark Mode Active - v2.0.5
      </div>
      {/* Animated Background with Solar Rays & Spinning Wheels */}
      <div className="absolute inset-0 opacity-30 dark:opacity-40 pointer-events-none">
        <div className="absolute bottom-0 w-full h-64 bg-gradient-to-t from-emerald-900/30 dark:from-emerald-800/40 to-transparent"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-emerald-400/40 dark:bg-emerald-500/30 rounded-full blur-3xl animate-pulse-glow"></div>
        <div
          className="absolute top-1/3 right-1/4 w-40 h-40 bg-amber-400/30 dark:bg-amber-500/20 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Spinning AirBear Wheels in Background */}
        <div className="absolute top-1/4 left-1/6 animate-float">
          <AirbearWheel
            size="lg"
            glowing
            animated
            effectType="solar"
            className="opacity-30"
          />
        </div>
        <div
          className="absolute top-1/3 right-1/5 animate-float"
          style={{ animationDelay: "1.5s" }}
        >
          <AirbearWheel
            size="xl"
            glowing
            animated
            effectType="eco"
            className="opacity-20"
          />
        </div>
        <div
          className="absolute bottom-1/4 left-1/3 animate-float"
          style={{ animationDelay: "2.5s" }}
        >
          <AirbearWheel size="md" glowing animated className="opacity-25" />
        </div>
        <div
          className="absolute bottom-1/3 right-1/6 animate-float"
          style={{ animationDelay: "3s" }}
        >
          <AirbearWheel
            size="lg"
            glowing
            animated
            effectType="solar"
            className="opacity-20"
          />
        </div>
      </div>

      {/* Aurora bands + prismatic streaks */}
      <div className="absolute inset-0 pointer-events-none opacity-60 mix-blend-screen">
        <div className="absolute -top-28 left-1/2 h-64 w-[140%] -translate-x-1/2 rotate-6 bg-gradient-to-r from-cyan-400/10 via-fuchsia-400/25 to-amber-400/10 blur-2xl animate-float"></div>
        <div className="absolute top-1/3 -left-10 h-48 w-[120%] rotate-[-8deg] bg-gradient-to-r from-emerald-400/10 via-lime-300/20 to-sky-400/10 blur-2xl animate-float"></div>
        <div className="absolute bottom-10 left-1/2 h-40 w-[120%] -translate-x-1/2 rotate-3 bg-gradient-to-r from-amber-300/10 via-rose-400/20 to-purple-400/10 blur-2xl animate-float"></div>
      </div>

      {/* Enhanced Particle effects background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particleEffects}
      </div>

      {/* Sparkle rings */}
      <div className="absolute inset-0 pointer-events-none">
        {sparkleRings}
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          {/* Mascot with enhanced animations */}
          <div className="mb-8 animate-float relative">
            {/* ⚡ Bolt: Added width and height to prevent Cumulative Layout Shift (CLS) */}
            <img
              src="/airbear-mascot.png"
              alt="Friendly brown bear mascot with pilot goggles representing AirBear"
              width={128}
              height={128}
              className="mx-auto rounded-full w-32 h-32 object-cover border-4 border-emerald-400/30 hover-lift animate-pulse-glow shadow-2xl"
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-1/2 top-0 h-36 w-36 -translate-x-1/2 rounded-full border border-cyan-400/30 blur-sm animate-holographic"></div>
              <div className="absolute left-1/2 top-2 h-40 w-40 -translate-x-1/2 rounded-full border border-fuchsia-400/20 blur-md animate-plasma"></div>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-balance relative">
              <span className="bg-gradient-to-r from-emerald-600 via-lime-500 to-amber-500 bg-clip-text text-transparent animate-pulse-glow airbear-holographic text-outline-strong">
                AirBear Mobile Bodega
              </span>
              <br />
              <span className="text-foreground airbear-solar-rays text-4xl md:text-5xl lg:text-6xl">
                Solar Powered Rideshare
              </span>

              <div className="mt-4 mx-auto h-1 w-48 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 animate-shimmer"></div>

              {/* Holographic overlay effect */}
              <div className="absolute inset-0 pointer-events-none">
                {holographicOverlays}
              </div>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground text-pretty max-w-3xl mx-auto leading-relaxed airbear-eco-breeze">
              <span className="text-emerald-600 font-bold animate-shimmer">
                Experience the future of sustainable transportation!
              </span>
              <br />
              Solar-powered vehicles with onboard shopping experiences,
              <span className="text-emerald-500 font-semibold airbear-god-rays">
                {" "}
                zero emissions
              </span>
              , and
              <span className="text-amber-500 font-semibold">
                {" "}
                revolutionary eco-mobility!
              </span>
            </p>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              asChild
              size="lg"
              className="group relative eco-gradient text-white hover-lift ripple-effect px-8 py-4 text-lg font-semibold animate-neon-glow shadow-xl"
            >
              <Link href="/map" className="relative flex items-center">
                <span className="absolute -inset-3 rounded-full bg-gradient-to-r from-emerald-400/20 via-cyan-400/30 to-amber-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10 pointer-events-none"></span>
                <AirbearWheel size="sm" glowing animated className="mr-2" />
                <MapPin className="mr-2 h-5 w-5" />
                Book Your AirBear
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="group bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white hover-lift ripple-effect px-8 py-4 text-lg font-semibold animate-pulse-glow shadow-xl"
            >
              <Link href="/merchandise" className="relative flex items-center">
                <span className="absolute -inset-3 rounded-full bg-gradient-to-r from-amber-400/20 via-rose-400/30 to-emerald-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10 pointer-events-none"></span>
                <Crown className="mr-2 h-5 w-5" />
                CEO T-Shirt $100
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold hover-lift ripple-effect shadow-lg group"
            >
              <Link href="/merchandise" className="relative flex items-center">
                <span className="absolute -inset-3 rounded-full bg-gradient-to-r from-emerald-400/20 via-lime-400/30 to-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10 pointer-events-none"></span>
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Merchandise
              </Link>
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto mt-12">
            <div className="text-center hover-lift p-4 rounded-lg glass-morphism relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-cyan-400/10 to-transparent opacity-70"></div>
              <div className="text-3xl sm:text-4xl font-bold text-emerald-600 animate-pulse-glow relative z-10">
                5
              </div>
              <div className="text-sm text-muted-foreground relative z-10">
                Active AirBears
              </div>
            </div>
            <div className="text-center hover-lift p-4 rounded-lg glass-morphism relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-lime-400/10 via-sky-400/10 to-transparent opacity-70"></div>
              <div className="text-3xl sm:text-4xl font-bold text-lime-500 relative z-10">
                582kg
              </div>
              <div className="text-sm text-muted-foreground relative z-10">CO₂ Saved</div>
            </div>
            <div className="text-center hover-lift p-4 rounded-lg glass-morphism relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-rose-400/10 to-transparent opacity-70"></div>
              <div className="text-3xl sm:text-4xl font-bold text-amber-500 relative z-10">
                16
              </div>
              <div className="text-sm text-muted-foreground relative z-10">Active Spots</div>
            </div>
            <div className="text-center hover-lift p-4 rounded-lg glass-morphism relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-lime-400/10 to-transparent opacity-70"></div>
              <div className="text-3xl sm:text-4xl font-bold text-emerald-500 relative z-10">
                100%
              </div>
              <div className="text-sm text-muted-foreground relative z-10">Solar Powered</div>
            </div>
          </div>

          {/* Enhanced Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-5xl">
            <div className="flex flex-col items-center space-y-4 p-8 rounded-xl glass-morphism border border-white/50 shadow-2xl hover-lift hover:shadow-3xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-cyan-400/10 to-transparent opacity-70"></div>
              <div className="p-4 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl animate-pulse-glow relative z-10">
                <Leaf className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent relative z-10">
                100% Eco-Friendly
              </h3>
              <p className="text-muted-foreground text-center leading-relaxed relative z-10">
                Solar-powered rickshaws that produce zero emissions while
                reducing your carbon footprint
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4 p-8 rounded-xl glass-morphism border border-white/50 shadow-2xl hover-lift hover:shadow-3xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-rose-400/10 to-transparent opacity-70"></div>
              <div
                className="p-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl animate-pulse-glow relative z-10"
                style={{ animationDelay: "0.5s" }}
              >
                <ShoppingBag className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent relative z-10">
                Mobile Bodega
              </h3>
              <p className="text-muted-foreground text-center leading-relaxed relative z-10">
                Shop local products during your ride with our onboard
                convenience store
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4 p-8 rounded-xl glass-morphism border border-white/50 shadow-2xl hover-lift hover:shadow-3xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-orange-400/10 to-transparent opacity-70"></div>
              <div
                className="p-4 rounded-full bg-gradient-to-br from-emerald-400 to-orange-500 shadow-xl animate-pulse-glow relative z-10"
                style={{ animationDelay: "1s" }}
              >
                <Zap className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-orange-600 bg-clip-text text-transparent relative z-10">
                Smart Routing
              </h3>
              <p className="text-muted-foreground text-center leading-relaxed relative z-10">
                AI-powered AirBear routing across 16 Binghamton locations with
                real-time tracking
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 w-full max-w-4xl mx-auto">
            <div className="relative py-16 px-8 rounded-2xl bg-gradient-to-br from-emerald-500 via-lime-500 to-amber-500 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 opacity-60 mix-blend-screen pointer-events-none">
                <div className="absolute -top-8 right-10 h-32 w-32 rounded-full bg-cyan-400/30 blur-2xl animate-pulse-glow"></div>
                <div className="absolute bottom-6 left-10 h-28 w-28 rounded-full bg-rose-400/30 blur-2xl animate-pulse-glow"></div>
                <div className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 animate-solar-rays"></div>
              </div>
              <div className="relative z-10 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 animate-pulse-glow">
                  Ready to Start Your Eco Journey?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Join thousands of Binghamton residents who are making a
                  difference, one ride at a time
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="bg-white text-emerald-600 hover:bg-white/90 px-8 py-4 text-lg font-semibold hover-lift shadow-xl"
                  >
                    <Link href="/auth/login">Get Started Today</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold hover-lift shadow-xl"
                  >
                    <Link href="/map">
                      <MapPin className="mr-2 h-5 w-5" />
                      Explore Map
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
