import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { commercialAdmin } from "../../../lib/commercial-admin";
import { BUSINESS_TYPES, normalizeWhatsApp } from "../../../lib/commercial";

export async function GET(req: NextRequest) {
  const admin = await commercialAdmin(req);
  if (!admin.client)
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  const kind = req.nextUrl.searchParams.get("kind");
  const table =
    kind === "enquiries"
      ? "genaan_enquiries"
      : kind === "settings"
        ? "genaan_business_settings"
        : "genaan_packages";
  const { data, error } = await admin.client
    .from(table)
    .select("*")
    .order(
      kind === "enquiries"
        ? "created_at"
        : kind === "settings"
          ? "key"
          : "sort_order",
      { ascending: kind !== "enquiries" },
    )
    .limit(500);
  return NextResponse.json(error ? { error: error.message } : { data }, {
    status: error ? 500 : 200,
  });
}
export async function POST(req: NextRequest) {
  const admin = await commercialAdmin(req);
  if (!admin.client)
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  try {
    const body = await req.json();
    let error;
    if (body.kind === "settings") {
      const phone = String(body.whatsapp || "").trim();
      if (phone && !normalizeWhatsApp(phone))
        return NextResponse.json(
          { error: "Enter a valid WhatsApp number including country code." },
          { status: 400 },
        );
      const contactPhone = String(body.phone || "").trim();
      if (contactPhone && !normalizeWhatsApp(contactPhone))
        return NextResponse.json({ error: "Enter a valid contact phone number." }, { status: 400 });
      for (const key of ["care_biannual_price", "care_quarterly_price"]) {
        if (!/^[0-9]{1,7}([.][0-9]{1,2})?$/.test(String(body[key] ?? "")))
          return NextResponse.json({ error: "Enter valid annual care prices." }, { status: 400 });
      }
      ({ error } = await admin.client.from("genaan_business_settings").upsert(
        ["whatsapp", "email", "phone", "care_biannual_price", "care_quarterly_price"].map((key) => ({
          key,
          value:
            key === "whatsapp"
              ? normalizeWhatsApp(phone)
              : key === "phone" && contactPhone ? "+" + normalizeWhatsApp(contactPhone) : String(body[key] ?? "")
                  .trim()
                  .slice(0, 200),
        })),
        { onConflict: "key" },
      ));
    } else if (body.kind === "enquiry") {
      if (
        ![
          "new",
          "contacted",
          "quoted",
          "confirmed",
          "completed",
          "closed",
        ].includes(body.status)
      )
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      ({ error } = await admin.client
        .from("genaan_enquiries")
        .update({
          status: body.status,
          admin_notes: String(body.admin_notes || "").slice(0, 3000),
        })
        .eq("id", body.id));
    } else if (body.kind === "package") {
      const p = body.package;
      if (
        !p ||
        !/^[a-z0-9-]{2,80}$/.test(p.slug) ||
        !p.name_en?.trim() ||
        !p.name_ar?.trim() ||
        !Number.isInteger(p.plant_count) ||
        (p.is_custom ? p.plant_count !== 0 || p.price !== null : p.plant_count < 1) ||
        p.plant_count > 10000 ||
        !Number.isFinite(p.area_min) ||
        !Number.isFinite(p.area_max) ||
        p.area_min < 1 ||
        p.area_max < p.area_min ||
        p.area_max > 100000 ||
        (p.price !== null &&
          (!Number.isFinite(p.price) || p.price < 0 || p.price > 10000000)) ||
        !Array.isArray(p.includes_en) ||
        !Array.isArray(p.includes_ar) ||
        p.includes_en.length > 20 ||
        p.includes_ar.length > 20 ||
        !Array.isArray(p.business_types) ||
        p.business_types.length < 1 ||
        p.business_types.some(
          (v: string) => !BUSINESS_TYPES.some((t) => t.value === v),
        ) ||
        !Number.isInteger(p.sort_order)
      )
        return NextResponse.json(
          {
            error:
              "Check package names, plants, area, price and business types.",
          },
          { status: 400 },
        );
      const image = String(p.image_url || "");
      if (image && !image.startsWith("/assets/") && !/^https:\/\//.test(image))
        return NextResponse.json(
          { error: "Use an HTTPS image URL or upload an image." },
          { status: 400 },
        );
      const text = (v: unknown, n = 1500) =>
        String(v || "")
          .trim()
          .slice(0, n);
      const row = {
        slug: p.slug,
        is_custom: !!p.is_custom,
        name_en: text(p.name_en, 120),
        name_ar: text(p.name_ar, 120),
        description_en: text(p.description_en),
        description_ar: text(p.description_ar),
        plant_count: p.plant_count,
        area_min: p.area_min,
        area_max: p.area_max,
        price: p.price,
        image_url: image,
        includes_en: p.includes_en.map((v: unknown) => text(v, 200)),
        includes_ar: p.includes_ar.map((v: unknown) => text(v, 200)),
        business_types: p.business_types,
        care_en: text(p.care_en),
        care_ar: text(p.care_ar),
        is_active: !!p.is_active,
        is_featured: !!p.is_featured,
        sort_order: p.sort_order,
      };
      const query = p.id
        ? admin.client.from("genaan_packages").update(row).eq("id", p.id)
        : admin.client.from("genaan_packages").insert(row);
      ({ error } = await query);
    } else
      return NextResponse.json({ error: "Invalid operation" }, { status: 400 });
    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    revalidateTag("genaan-commercial", { expire: 0 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
