import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServer();

    // Update existing spots with correct IDs and user's data
    const spotsUpdates = [
      {
        id: "court-street-downtown",
        name: "Spot 1 - Court Street Downtown",
        latitude: 42.099118,
        longitude: -75.917538,
        description: "Main downtown pickup location",
      },
      {
        id: "riverwalk-bu-center",
        name: "Spot 2 - Riverwalk BU Center",
        latitude: 42.098765,
        longitude: -75.916543,
        description: "Binghamton University area pickup",
      },
      {
        id: "confluence-park",
        name: "Spot 3 - Confluence Park",
        latitude: 42.090123,
        longitude: -75.912345,
        description: "Scenic park location",
      },
      {
        id: "southside-walking-bridge",
        name: "Spot 4 - Southside Walking Bridge",
        latitude: 42.091409,
        longitude: -75.914568,
        description: "Pedestrian bridge access",
      },
      {
        id: "general-hospital",
        name: "Spot 5 - General Hospital",
        latitude: 42.086741,
        longitude: -75.915711,
        description: "Medical center pickup",
      },
      {
        id: "mcarthur-park",
        name: "Spot 6 - McArthur Park",
        latitude: 42.086165,
        longitude: -75.926153,
        description: "Recreation area with parking",
      },
      {
        id: "greenway-path",
        name: "Spot 7 - Greenway Path",
        latitude: 42.086678,
        longitude: -75.932483,
        description: "Scenic greenway trail access",
      },
      {
        id: "vestal-center",
        name: "Spot 8 - Vestal Center",
        latitude: 42.091851,
        longitude: -75.951729,
        description: "Vestal shopping district",
      },
      {
        id: "innovation-park",
        name: "Spot 9 - Innovation Park",
        latitude: 42.093877,
        longitude: -75.958331,
        description: "Tech park and business district",
      },
      {
        id: "bu-east-gym",
        name: "Spot 10 - BU East Gym",
        latitude: 42.091695,
        longitude: -75.96359,
        description: "Binghamton University East Gym",
      },
      {
        id: "bu-fine-arts-building",
        name: "Spot 11 - BU Fine Arts Building",
        latitude: 42.089282,
        longitude: -75.967441,
        description: "BU Fine Arts Building",
      },
      {
        id: "whitney-hall",
        name: "Spot 12 - Whitney Hall",
        latitude: 42.088456,
        longitude: -75.965432,
        description: "Whitney Hall residence",
      },
      {
        id: "student-union",
        name: "Spot 13 - Student Union",
        latitude: 42.086903,
        longitude: -75.966704,
        description: "Student Union building",
      },
      {
        id: "appalachian-dinin",
        name: "Spot 14 - Appalachian Dining",
        latitude: 42.084523,
        longitude: -75.971264,
        description: "Appalachian Dining Hall",
      },
      {
        id: "hinman-dining-hall",
        name: "Spot 15 - Hinman Dining Hall",
        latitude: 42.086314,
        longitude: -75.973292,
        description: "Hinman Dining Hall",
      },
      {
        id: "bu-science-building",
        name: "Spot 16 - BU Science Building",
        latitude: 42.090227,
        longitude: -75.972315,
        description: "BU Science Building",
      },
    ];

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const spot of spotsUpdates) {
      try {
        const { error } = await supabase
          .from("spots")
          .update({
            name: spot.name,
            latitude: spot.latitude,
            longitude: spot.longitude,
            description: spot.description,
            is_active: true,
          })
          .eq("id", spot.id);

        if (error) {
          console.error(`Error updating ${spot.id}:`, error);
          errors.push(`${spot.id}: ${error.message}`);
          errorCount++;
        } else {
          successCount++;
          console.log(`✅ Updated ${spot.id} -> ${spot.name}`);
        }
      } catch (err: any) {
        console.error(`Error updating ${spot.id}:`, err);
        errors.push(`${spot.id}: ${err.message}`);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Numbered spots update completed!",
      successCount,
      errorCount,
      errors,
    });
  } catch (error: any) {
    console.error("Setup error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
