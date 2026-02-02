import { NextResponse } from "next/server";

import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServer();

    // Fetch all active spots
    const { data: spots, error } = await supabase
      .from("spots")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) {
      console.error("Error fetching spots:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      spots: spots || [],
      count: spots?.length || 0,
    });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
