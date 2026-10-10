import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "../../lib/supabase-server";

export async function POST(req: NextRequest) {
  if (
    req.headers.get("origin") &&
    req.headers.get("origin") !== req.nextUrl.origin
  )
    return NextResponse.json(
      { error: "Invalid request origin" },
      { status: 403 },
    );
  try {
    const raw = await req.text();
    if (raw.length > 16000)
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    const sb = createServerSupabase();
    const { data, error } = await sb.functions.invoke("genaan-enquiry", {
      body: JSON.parse(raw),
    });
    if (error) {
      const response = error.context as Response | undefined;
      const details = await response?.json().catch(() => null);
      return NextResponse.json(
        {
          error:
            details?.error || "Could not save your request. Please try again.",
        },
        { status: response?.status || 503 },
      );
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Could not process your request. Please try again." },
      { status: 503 },
    );
  }
}
