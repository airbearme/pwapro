import { getSupabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServer();

    // Fetch all AirBear locations with their assigned spots
    const { data: airbears, error } = await supabase
      .from("airbears")
      .select(
        `
        *,
        pickup_spot:spots (
          id,
          name,
          description,
          latitude,
          longitude
        ),
        destination_spot:spots (
          id,
          name,
          description,
          latitude,
          longitude
        )
      `
      )
      .order("created_at");

    if (error) {
      console.error("Error fetching AirBear locations:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      airbears: airbears || [],
      count: airbears?.length || 0,
    });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
