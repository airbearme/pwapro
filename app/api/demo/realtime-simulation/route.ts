import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { action } = await request.json();

  // Simulate real-time updates for demonstration
  const simulations = {
    user_booking: {
      type: "user_booking",
      timestamp: new Date().toISOString(),
      user_id: "user_123",
      pickup_spot: "appalachian-dining",
      destination_spot: "bu-east-gym",
      fare: 4.0,
      status: "confirmed",
    },
    driver_location: {
      type: "driver_location",
      timestamp: new Date().toISOString(),
      driver_id: "driver_456",
      airbear_id: "airbear_001",
      latitude: 42.099118,
      longitude: -75.917538,
      heading: 45.5,
      battery_level: 87,
      status: "active",
    },
    ride_status: {
      type: "ride_status",
      timestamp: new Date().toISOString(),
      ride_id: "ride_789",
      status: "in_progress",
      driver_id: "driver_456",
      current_location: {
        latitude: 42.095234,
        longitude: -75.918762,
      },
    },
  };

  // Return the appropriate simulation based on action
  switch (action) {
    case "user_booking":
      return NextResponse.json(simulations.user_booking);

    case "driver_location":
      return NextResponse.json(simulations.driver_location);

    case "ride_status":
      return NextResponse.json(simulations.ride_status);

    default:
      return NextResponse.json(
        {
          error:
            "Invalid action. Available actions: user_booking, driver_location, ride_status",
        },
        { status: 400 },
      );
  }
}
