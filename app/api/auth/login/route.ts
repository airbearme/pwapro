import { NextResponse } from "next/server";

import { rateLimit } from "@/lib/rate-limit";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    // Security: Rate limiting to prevent brute-force attacks
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required",
        },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseServer();

    // Authenticate user
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      return NextResponse.json(
        {
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Check if user profile exists
    const { data: profile } = await supabase
      .from("users")
      .select("role, full_name, eco_points, total_rides")
      .eq("id", user?.id)
      .single();

    return NextResponse.json({
      success: true,
      user: {
        id: user?.id,
        email: user?.email,
        ...profile,
      },
    });
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      {
        error: error.message || "Login failed",
      },
      { status: 500 }
    );
  }
}
