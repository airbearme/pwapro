import { getSupabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServer();

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's profile to check if they're a driver and their assigned AirBear
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("role, assigned_airbear_id")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 },
      );
    }

    // If user is a driver with an assigned AirBear, only return their AirBear
    if (userProfile?.role === "driver" && userProfile.assigned_airbear_id) {
      const { data: airbears, error } = await supabase
        .from("airbears")
        .select("*")
        .eq("id", userProfile.assigned_airbear_id)
        .single();

      if (error) {
        console.error("Error fetching driver's AirBear:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        data: airbears ? [airbears] : [],
        count: airbears ? 1 : 0,
        isDriverView: true,
      });
    }

    // For non-drivers or drivers without assigned AirBears, return all available AirBears
    const { data: airbears, error } = await supabase
      .from("airbears")
      .select("*")
      .eq("is_available", true)
      .order("created_at");

    if (error) {
      console.error("Error fetching AirBear locations:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: airbears || [],
      count: airbears?.length || 0,
      isDriverView: false,
    });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
