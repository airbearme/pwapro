import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

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
        { status: 400 },
      );
    }

    // Check for available AirBear first
    const { data: availableAirbears, error: airbearError } = await supabase
      .from("airbears")
      .select("id")
      .eq("is_available", true)
      .eq("is_charging", false)
      .limit(1);

    if (airbearError) {
      console.error("Error checking AirBear availability:", airbearError);
      return NextResponse.json(
        { error: "Failed to check vehicle availability" },
        { status: 500 },
      );
    }

    if (!availableAirbears || availableAirbears.length === 0) {
      return NextResponse.json(
        {
          error:
            "No AirBears Available - All vehicles are currently in use. Please try again later.",
        },
        { status: 503 },
      );
    }

    const assignedAirbear = availableAirbears[0];

    // Create the ride booking with minimal schema (temporary fix)
    const { data: ride, error: rideError } = await supabase
      .from("rides")
      .insert({
        user_id: user.id,
        pickup_spot_id,
        dropoff_spot_id,
        fare: parseFloat(fare),
        status: "pending",
      })
      .select()
      .single();

    if (rideError) {
      console.error("Error creating ride:", rideError);
      return NextResponse.json({ error: rideError.message }, { status: 500 });
    }

    // Update AirBear availability to assign it (commented out until schema fixed)
    // const { error: updateError } = await supabase
    //   .from("airbears")
    //   .update({ is_available: false })
    //   .eq("id", assignedAirbear.id);

    // if (updateError) {
    //   console.error("Error updating AirBear availability:", updateError);
    //   // Don't fail the booking, but log the error
    // }

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
