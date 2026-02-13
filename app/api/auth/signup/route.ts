import { getSupabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password, full_name } = await request.json();

    if (!email || !password || !full_name) {
      return NextResponse.json(
        {
          error: "Email, password, and full name are required",
        },
        { status: 400 },
      );
    }

    const supabase = await getSupabaseServer();

    // Create user account
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
      },
    });

    if (error) {
      console.error("Signup error:", error);
      return NextResponse.json(
        {
          error: error.message || "Registration failed",
        },
        { status: 400 },
      );
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from("users")
      .insert({
        id: user?.id,
        email,
        full_name,
        role: "rider",
        eco_points: 0,
        total_rides: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select();

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return NextResponse.json(
        {
          error: "Failed to create user profile",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user?.id,
        email: user?.email,
        full_name,
      },
    });
  } catch (error: any) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      {
        error: error.message || "Registration failed",
      },
      { status: 500 },
    );
  }
}
