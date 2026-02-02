import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

const numberedSpots = [
  {
    id: "1",
    name: "1. Appalachian Dining",
    description: "Dining hall",
    latitude: 42.084523,
    longitude: -75.971264,
    amenities: ["Food"],
    is_active: true,
  },
  {
    id: "2",
    name: "2. BU East Gym",
    description: "Recreation center",
    latitude: 42.091695,
    longitude: -75.96359,
    amenities: ["Gym", "Fitness"],
    is_active: true,
  },
  {
    id: "3",
    name: "3. BU Fine Arts Building",
    description: "Arts center",
    latitude: 42.089282,
    longitude: -75.967441,
    amenities: ["Art", "Culture"],
    is_active: true,
  },
  {
    id: "4",
    name: "4. BU Science Building",
    description: "Science labs",
    latitude: 42.090227,
    longitude: -75.972315,
    amenities: ["Labs", "Research"],
    is_active: true,
  },
  {
    id: "5",
    name: "5. Confluence Park",
    description: "Scenic park",
    latitude: 42.090123,
    longitude: -75.912345,
    amenities: ["Park", "Nature"],
    is_active: true,
  },
  {
    id: "6",
    name: "6. Court Street Downtown",
    description: "Heart of downtown Binghamton",
    latitude: 42.099118,
    longitude: -75.917538,
    amenities: ["Restaurants", "Shopping"],
    is_active: true,
  },
  {
    id: "7",
    name: "7. General Hospital",
    description: "Healthcare facility",
    latitude: 42.086741,
    longitude: -75.915711,
    amenities: ["Hospital"],
    is_active: true,
  },
  {
    id: "8",
    name: "8. Greenway Path",
    description: "Scenic greenway",
    latitude: 42.086678,
    longitude: -75.932483,
    amenities: ["Bike Path", "Walking"],
    is_active: true,
  },
  {
    id: "9",
    name: "9. Hinman Dining Hall",
    description: "Dining facility",
    latitude: 42.086314,
    longitude: -75.973292,
    amenities: ["Food"],
    is_active: true,
  },
  {
    id: "10",
    name: "10. Innovation Park",
    description: "Tech center",
    latitude: 42.093877,
    longitude: -75.958331,
    amenities: ["Business"],
    is_active: true,
  },
  {
    id: "11",
    name: "11. McArthur Park",
    description: "Community park",
    latitude: 42.086165,
    longitude: -75.926153,
    amenities: ["Playground", "Sports"],
    is_active: true,
  },
  {
    id: "12",
    name: "12. Riverwalk BU Center",
    description: "Riverside walkway",
    latitude: 42.098765,
    longitude: -75.916543,
    amenities: ["Parks", "Walking Trails"],
    is_active: true,
  },
  {
    id: "13",
    name: "13. Southside Walking Bridge",
    description: "Pedestrian bridge",
    latitude: 42.091409,
    longitude: -75.914568,
    amenities: ["Bridge", "Views"],
    is_active: true,
  },
  {
    id: "14",
    name: "14. Student Union",
    description: "Student hub",
    latitude: 42.086903,
    longitude: -75.966704,
    amenities: ["Food", "Services"],
    is_active: true,
  },
  {
    id: "15",
    name: "15. Vestal Center",
    description: "Commercial hub",
    latitude: 42.091851,
    longitude: -75.951729,
    amenities: ["Shopping", "Dining"],
    is_active: true,
  },
  {
    id: "16",
    name: "16. Whitney Hall",
    description: "Academic building",
    latitude: 42.088456,
    longitude: -75.965432,
    amenities: ["Classrooms"],
    is_active: true,
  },
  {
    id: "17",
    name: "17. AirBear Headquarters",
    description: "Main AirBear station and depot",
    latitude: 42.089,
    longitude: -75.95,
    amenities: ["Charging", "Maintenance", "Office"],
    is_active: true,
  },
];

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServer();

    // Delete existing spots
    await supabase.from("spots").delete().neq("id", null);

    // Insert new numbered spots
    const { data: spots, error } = await supabase
      .from("spots")
      .insert(numberedSpots)
      .select();

    if (error) {
      console.error("Error updating spots:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${spots?.length || 0} spots with numbered IDs (1-17)`,
      spots: spots || [],
    });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
