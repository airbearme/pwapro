import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await getSupabaseServer();
    const { id: rideId } = await params;

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { paymentMethod } = body;

    // Validate ride belongs to user
    const { data: ride, error: rideError } = await supabase
      .from("rides")
      .select("*")
      .eq("id", rideId)
      .eq("user_id", user.id)
      .single();

    if (rideError || !ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    if (ride.status !== "pending") {
      return NextResponse.json({ error: "Ride already processed" }, { status: 400 });
    }

    // Update ride status to confirmed
    const { data: updatedRide, error: updateError } = await supabase
      .from("rides")
      .update({
        status: "confirmed",
        payment_method: paymentMethod,
        confirmed_at: new Date().toISOString(),
      })
      .eq("id", rideId)
      .select()
      .single();

    if (updateError) {
      console.error("Error confirming ride:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      ride: updatedRide,
      message: "Ride confirmed successfully!",
    });
  } catch (error: any) {
    console.error("Ride confirmation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
