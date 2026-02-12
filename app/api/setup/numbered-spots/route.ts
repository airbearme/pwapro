import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServer();

    // Clear existing spots
    await supabase.from("spots").delete().neq("id", "dummy");

    // Insert 16 numbered ride spots using user's exact data
    const spotsData = [
      {
        id: "spot-01",
        name: "Spot 1 - Court Street Downtown",
        latitude: 42.099118,
        longitude: -75.917538,
        description: "Main downtown pickup location",
        amenities: ["shelter", "lighting", "bench"],
        is_active: true,
      },
      {
        id: "spot-02",
        name: "Spot 2 - Riverwalk BU Center",
        latitude: 42.098765,
        longitude: -75.916543,
        description: "Binghamton University area pickup",
        amenities: ["shelter", "lighting", "bench", "wifi"],
        is_active: true,
      },
      {
        id: "spot-03",
        name: "Spot 3 - Confluence Park",
        latitude: 42.090123,
        longitude: -75.912345,
        description: "Scenic park location",
        amenities: ["shelter", "lighting", "bench", "water"],
        is_active: true,
      },
      {
        id: "spot-04",
        name: "Spot 4 - Southside Walking Bridge",
        latitude: 42.091409,
        longitude: -75.914568,
        description: "Pedestrian bridge access",
        amenities: ["lighting", "bench"],
        is_active: true,
      },
      {
        id: "spot-05",
        name: "Spot 5 - General Hospital",
        latitude: 42.086741,
        longitude: -75.915711,
        description: "Medical center pickup",
        amenities: ["shelter", "lighting", "bench", "wheelchair-access"],
        is_active: true,
      },
      {
        id: "spot-06",
        name: "Spot 6 - McArthur Park",
        latitude: 42.086165,
        longitude: -75.926153,
        description: "Recreation area with parking",
        amenities: ["shelter", "lighting", "bench", "parking"],
        is_active: true,
      },
      {
        id: "spot-07",
        name: "Spot 7 - Greenway Path",
        latitude: 42.086678,
        longitude: -75.932483,
        description: "Scenic greenway trail access",
        amenities: ["lighting", "bench", "bike-rack"],
        is_active: true,
      },
      {
        id: "spot-08",
        name: "Spot 8 - Vestal Center",
        latitude: 42.091851,
        longitude: -75.951729,
        description: "Vestal shopping district",
        amenities: ["shelter", "lighting", "bench", "parking"],
        is_active: true,
      },
      {
        id: "spot-09",
        name: "Spot 9 - Innovation Park",
        latitude: 42.093877,
        longitude: -75.958331,
        description: "Tech park and business district",
        amenities: ["shelter", "lighting", "bench", "wifi", "parking"],
        is_active: true,
      },
      {
        id: "spot-10",
        name: "Spot 10 - BU East Gym",
        latitude: 42.091695,
        longitude: -75.96359,
        description: "Binghamton University East Gym",
        amenities: ["shelter", "lighting", "bench", "wifi"],
        is_active: true,
      },
      {
        id: "spot-11",
        name: "Spot 11 - BU Fine Arts Building",
        latitude: 42.089282,
        longitude: -75.967441,
        description: "BU Fine Arts Building",
        amenities: ["shelter", "lighting", "bench"],
        is_active: true,
      },
      {
        id: "spot-12",
        name: "Spot 12 - Whitney Hall",
        latitude: 42.088456,
        longitude: -75.965432,
        description: "Whitney Hall residence",
        amenities: ["shelter", "lighting", "bench"],
        is_active: true,
      },
      {
        id: "spot-13",
        name: "Spot 13 - Student Union",
        latitude: 42.086903,
        longitude: -75.966704,
        description: "Student Union building",
        amenities: ["shelter", "lighting", "bench", "wifi"],
        is_active: true,
      },
      {
        id: "spot-14",
        name: "Spot 14 - Appalachian Dining",
        latitude: 42.084523,
        longitude: -75.971264,
        description: "Appalachian Dining Hall",
        amenities: ["shelter", "lighting", "bench"],
        is_active: true,
      },
      {
        id: "spot-15",
        name: "Spot 15 - Hinman Dining Hall",
        latitude: 42.086314,
        longitude: -75.973292,
        description: "Hinman Dining Hall",
        amenities: ["shelter", "lighting", "bench"],
        is_active: true,
      },
      {
        id: "spot-16",
        name: "Spot 16 - BU Science Building",
        latitude: 42.090227,
        longitude: -75.972315,
        description: "BU Science Building",
        amenities: ["shelter", "lighting", "bench", "wifi"],
        is_active: true,
      },
      {
        id: "merchandise-spot",
        name: "🛍️ AirBear Merchandise Shop",
        latitude: 42.0987,
        longitude: -75.917,
        description: "Official AirBear merchandise and apparel store",
        amenities: ["indoor-shopping", "fitting-rooms", "parking", "atm"],
        is_active: true,
      },
    ];

    const { data: spots, error: spotsError } = await supabase
      .from("spots")
      .insert(spotsData)
      .select();

    if (spotsError) {
      console.error("Error creating spots:", spotsError);
      return NextResponse.json({ error: spotsError.message }, { status: 500 });
    }

    // Update AirBears to use new spot IDs
    const airbearUpdates = [
      { id: "airbear-001", current_spot_id: "spot-01" },
      { id: "airbear-002", current_spot_id: "spot-02" },
      { id: "airbear-003", current_spot_id: "spot-03" },
      { id: "airbear-004", current_spot_id: "spot-04" },
      { id: "airbear-005", current_spot_id: "spot-05" },
      { id: "airbear-006", current_spot_id: "spot-06" },
      { id: "airbear-007", current_spot_id: "spot-07" },
      { id: "airbear-008", current_spot_id: "spot-08" },
    ];

    for (const airbear of airbearUpdates) {
      await supabase
        .from("airbears")
        .update({ current_spot_id: airbear.current_spot_id })
        .eq("id", airbear.id);
    }

    return NextResponse.json({
      success: true,
      message: "Numbered spots setup completed successfully!",
      spotsCreated: spots?.length || 0,
    });
  } catch (error: any) {
    console.error("Setup error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
