import { NextResponse } from "next/server";

import { scrub } from "@/lib/pii";
import { rateLimit } from "@/lib/rate-limit";
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "u";
  if (!rateLimit(ip)) return NextResponse.json({}, { status: 429 });
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({}, { status: 400 });
  return NextResponse.json({ ok: true, message: scrub(b.message || "") });
}
