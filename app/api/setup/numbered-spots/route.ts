import { getSupabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServer();

    // Clear existing spots
    await supabase.from("spots").delete().neq("id", "dummy");

    // Insert 16 numbered ride spots
    const spotsData = [
      {
        id: "spot-01",
        name: "Spot 1 - Court Street Downtown",
        latitude: 42.099118,
        longitude: -75.917538,
        description: "Main downtown pickup location near shops and restaurants",
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
        description: "Scenic park location with river views",
        amenities: ["shelter", "lighting", "bench", "water"],
        is_active: true,
      },
      {
        id: "spot-04",
        name: "Spot 4 - Southside Walking Bridge",
        latitude: 42.091409,
        longitude: -75.914568,
        description: "Pedestrian bridge access point",
        amenities: ["lighting", "bench"],
        is_active: true,
      },
      {
        id: "spot-05",
        name: "Spot 5 - General Hospital",
        latitude: 42.086741,
        longitude: -75.915711,
        description: "Medical center pickup location",
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
        name: "Spot 7 - Vestal Center",
        latitude: 42.091851,
        longitude: -75.951729,
        description: "Vestal shopping district",
        amenities: ["shelter", "lighting", "bench", "parking"],
        is_active: true,
      },
      {
        id: "spot-08",
        name: "Spot 8 - Innovation Park",
        latitude: 42.093877,
        longitude: -75.958331,
        description: "Tech park and business district",
        amenities: ["shelter", "lighting", "bench", "wifi", "parking"],
        is_active: true,
      },
      {
        id: "spot-09",
        name: "Spot 9 - Binghamton Plaza",
        latitude: 42.102345,
        longitude: -75.923456,
        description: "Shopping plaza with multiple stores",
        amenities: ["shelter", "lighting", "bench", "parking"],
        is_active: true,
      },
      {
        id: "spot-10",
        name: "Spot 10 - Oakdale Mall",
        latitude: 42.104567,
        longitude: -75.934567,
        description: "Regional shopping mall",
        amenities: [
          "shelter",
          "lighting",
          "bench",
          "parking",
          "indoor-waiting",
        ],
        is_active: true,
      },
      {
        id: "spot-11",
        name: "Spot 11 - SUNY Broome",
        latitude: 42.098765,
        longitude: -75.945678,
        description: "Community college campus",
        amenities: ["shelter", "lighting", "bench", "wifi"],
        is_active: true,
      },
      {
        id: "spot-12",
        name: "Spot 12 - Johnson City",
        latitude: 42.115678,
        longitude: -75.956789,
        description: "Johnson City downtown area",
        amenities: ["shelter", "lighting", "bench"],
        is_active: true,
      },
      {
        id: "spot-13",
        name: "Spot 13 - Endicott",
        latitude: 42.123456,
        longitude: -75.96789,
        description: "Endicott business district",
        amenities: ["shelter", "lighting", "bench", "parking"],
        is_active: true,
      },
      {
        id: "spot-14",
        name: "Spot 14 - Union Center",
        latitude: 42.078901,
        longitude: -75.923456,
        description: "Union shopping and dining",
        amenities: ["shelter", "lighting", "bench", "parking"],
        is_active: true,
      },
      {
        id: "spot-15",
        name: "Spot 15 - Kirkwood",
        latitude: 42.089012,
        longitude: -75.934567,
        description: "Kirkwood community area",
        amenities: ["shelter", "lighting", "bench"],
        is_active: true,
      },
      {
        id: "spot-16",
        name: "Spot 16 - Port Dickinson",
        latitude: 42.06789,
        longitude: -75.945678,
        description: "Port Dickinson residential area",
        amenities: ["lighting", "bench"],
        is_active: true,
      },
      {
        id: "merchandise-spot",
        name: "🛍️ AirBear Merchandise Shop",
        latitude: 42.0987,
        longitude: -75.917,
        description:
          "Official AirBear merchandise and apparel store - Visit for exclusive gear!",
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
