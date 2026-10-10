import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { commercialAdmin } from "../../../lib/commercial-admin";

const uuid = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;
const columns = "id,name_ar,name_en,image_url,category,is_active,sort_order";
function refreshGallery() {
  revalidateTag("genaan-commercial", { expire: 0 });
  revalidatePath("/");
  revalidatePath("/packages");
}
function validImage(value: string) {
  if (value.startsWith("/assets/") && !value.includes("..")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
}

export async function GET(req: NextRequest) {
  const admin = await commercialAdmin(req);
  if (!admin.client) return NextResponse.json({ error: admin.error }, { status: admin.status });
  const { data, error } = await admin.client.from("genaan_plants").select(columns).order("sort_order").order("created_at").limit(1000);
  return NextResponse.json(error ? { error: "Could not load plants." } : { data }, { status: error ? 503 : 200 });
}

export async function POST(req: NextRequest) {
  const admin = await commercialAdmin(req);
  if (!admin.client) return NextResponse.json({ error: admin.error }, { status: admin.status });
  try {
    const raw = await req.text();
    if (raw.length > 6000) return NextResponse.json({ error: "Request too large." }, { status: 413 });
    const body = JSON.parse(raw);
    const name_ar = typeof body.name_ar === "string" ? body.name_ar.trim() : "";
    const name_en = typeof body.name_en === "string" && body.name_en.trim() ? body.name_en.trim() : name_ar;
    const image_url = typeof body.image_url === "string" ? body.image_url.trim() : "";
    if (!name_ar || name_ar.length > 120 || name_en.length > 120 || !image_url || image_url.length > 1800 || !validImage(image_url)
      || !["plant", "palm"].includes(body.category) || typeof body.is_active !== "boolean"
      || !Number.isInteger(body.sort_order) || body.sort_order < 0 || body.sort_order > 100000
      || (body.id !== undefined && (typeof body.id !== "string" || !uuid.test(body.id))))
      return NextResponse.json({ error: "Check the plant name, image URL, category and display order." }, { status: 400 });
    const row = { name_ar, name_en, image_url, category: body.category, is_active: body.is_active, sort_order: body.sort_order };
    const query = body.id ? admin.client.from("genaan_plants").update(row).eq("id", body.id) : admin.client.from("genaan_plants").insert(row);
    const { data, error } = await query.select(columns).maybeSingle();
    if (error) return NextResponse.json({ error: "Could not save the plant." }, { status: 400 });
    if (!data) return NextResponse.json({ error: "Plant not found." }, { status: 404 });
    refreshGallery();
    return NextResponse.json({ data });
  } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
}

export async function DELETE(req: NextRequest) {
  const admin = await commercialAdmin(req);
  if (!admin.client) return NextResponse.json({ error: admin.error }, { status: admin.status });
  try {
    const body = await req.json();
    if (typeof body.id !== "string" || !uuid.test(body.id)) return NextResponse.json({ error: "Invalid plant ID." }, { status: 400 });
    const { data, error } = await admin.client.from("genaan_plants").delete().eq("id", body.id).select("id").maybeSingle();
    if (error) return NextResponse.json({ error: "Could not delete the plant." }, { status: 400 });
    if (!data) return NextResponse.json({ error: "Plant not found." }, { status: 404 });
    refreshGallery();
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
}
