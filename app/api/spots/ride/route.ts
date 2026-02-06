import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServer();

    // Fetch only ride spots (excludes merchandise spot)
    const { data: spots, error } = await supabase
      .from("spots")
      .select("*")
      .eq("is_active", true)
      .neq("id", "merchandise-spot") // Exclude merchandise spot
      .order("id"); // Order by spot number (spot-01, spot-02, etc.)

    if (error) {
      console.error("Error fetching ride spots:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: spots || [],
      count: spots?.length || 0,
    });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
