import { NextResponse } from "next/server";

import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServer();

    // Fetch all available bodega items
    const { data: items, error } = await supabase
      .from("bodega_items")
      .select("*")
      .eq("is_available", true)
      .order("name");

    if (error) {
      console.error("Error fetching bodega items:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      items: items || [],
      count: items?.length || 0,
    });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
