import { getSupabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServer();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { pickup_spot_id, dropoff_spot_id, fare, distance } = body;

    // Validate required fields
    if (!pickup_spot_id || !dropoff_spot_id || !fare || !distance) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: pickup_spot_id, dropoff_spot_id, fare, distance",
        },
        { status: 400 }
      );
    }

    // Create the ride booking
    const { data: ride, error: rideError } = await supabase
      .from("rides")
      .insert({
        user_id: user.id,
        pickup_spot_id,
        dropoff_spot_id,
        fare: parseFloat(fare),
        distance_km: parseFloat(distance),
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (rideError) {
      console.error("Error creating ride:", rideError);
      return NextResponse.json({ error: rideError.message }, { status: 500 });
    }

    // Update AirBear availability if assigned
    const { data: availableAirbears } = await supabase
      .from("airbears")
      .select("id")
      .eq("is_available", true)
      .eq("is_charging", false)
      .limit(1);

    if (availableAirbears && availableAirbears.length > 0) {
      await supabase
        .from("airbears")
        .update({ is_available: false })
        .eq("id", availableAirbears[0].id);
    }

    return NextResponse.json({
      success: true,
      ride,
      message: "Ride booked successfully!",
    });
  } catch (error: any) {
    console.error("Ride creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
