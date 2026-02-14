import { getSupabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServer();
    const body = await request.json();

    const {
      airbear_id,
      latitude,
      longitude,
      battery_level,
      is_available,
      is_charging,
      heading,
    } = body;

    // Validate required fields
    if (!airbear_id || !latitude || !longitude) {
      return NextResponse.json(
        { error: "Missing required fields: airbear_id, latitude, longitude" },
        { status: 400 },
      );
    }

    // Validate coordinates
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return NextResponse.json(
        { error: "Invalid coordinates" },
        { status: 400 },
      );
    }

    // Update AirBear location and status
    const updateData: any = {
      latitude,
      longitude,
      updated_at: new Date().toISOString(),
    };

    // Add optional fields if provided
    if (battery_level !== undefined) {
      if (battery_level < 0 || battery_level > 100) {
        return NextResponse.json(
          { error: "Battery level must be between 0 and 100" },
          { status: 400 },
        );
      }
      updateData.battery_level = battery_level;
    }

    if (is_available !== undefined) {
      updateData.is_available = is_available;
    }

    if (is_charging !== undefined) {
      updateData.is_charging = is_charging;
    }

    if (heading !== undefined) {
      updateData.heading = heading;
    }

    const { data: airbear, error } = await supabase
      .from("airbears")
      .update(updateData)
      .eq("id", airbear_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating AirBear location:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!airbear) {
      return NextResponse.json({ error: "AirBear not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "AirBear location updated successfully",
      airbear: airbear,
    });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
