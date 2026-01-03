import { getSupabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServer();

    // Update AirBear location to use new spot ID "17" (AirBear Headquarters)
    const { data: airbear, error } = await supabase
      .from("airbears")
      .update({
        current_spot_id: "17",
        latitude: 42.089,
        longitude: -75.95,
        updated_at: new Date().toISOString(),
      })
      .eq("id", "airbear-001")
      .select()
      .single();

    if (error) {
      console.error("Error updating AirBear location:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "AirBear location updated to headquarters (spot 17)",
      airbear: airbear,
    });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
