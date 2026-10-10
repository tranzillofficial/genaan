import { createClient } from "npm:@supabase/supabase-js@2.106.2";
import { BUSINESS_TYPES, normalizeWhatsApp } from "./commercial.ts";
// The gateway validates the caller's JWT. Only the trusted service client can
// execute the atomic, rate-limited enquiry function or access customer records.
const NextResponse = {
  json: (data: unknown, options: { status?: number } = {}) =>
    new Response(JSON.stringify(data), {
      status: options.status || 200,
      headers: { "Content-Type": "application/json" },
    }),
};
Deno.serve(async (req: Request) => {
  if (req.method !== "POST")
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  if (Number(req.headers.get("content-length")) > 16000)
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  try {
    const raw = await req.text();
    if (raw.length > 16000)
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    const body = JSON.parse(raw);
    const clean = (key: string, max: number) =>
      typeof body[key] === "string" ? body[key].trim().slice(0, max) : "";
    const name = clean("name", 120),
      business = clean("business_name", 160),
      phone = normalizeWhatsApp(clean("phone", 30));
    const type = clean("business_type", 30),
      address = clean("address", 500),
      notes = clean("notes", 1500);
    const area = Number(body.area),
      id = clean("package_id", 80),
      requestId = clean("request_id", 80);
    if (
      body.website ||
      !name ||
      !business ||
      !phone ||
      !address ||
      !BUSINESS_TYPES.some((t) => t.value === type) ||
      !Number.isFinite(area) ||
      area < 1 ||
      area > 100000 ||
      !/^[\da-f-]{36}$/i.test(requestId)
    ) {
      return NextResponse.json(
        { error: "Please enter valid business and contact details." },
        { status: 400 },
      );
    }
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );
    // Fetch current contact setting, not a cached number, before recording a request.
    const { data: setting } = await sb
      .from("genaan_business_settings")
      .select("value")
      .eq("key", "whatsapp")
      .maybeSingle();
    const whatsapp = normalizeWhatsApp(setting?.value || "");
    if (!whatsapp)
      return NextResponse.json(
        {
          error:
            "WhatsApp orders are temporarily unavailable. Please use the contact page.",
        },
        { status: 503 },
      );
    const { data: pack, error: packError } = await sb
      .from("genaan_packages")
      .select("id,name_en,name_ar,plant_count")
      .eq("id", id)
      .eq("is_active", true)
      .maybeSingle();
    if (packError || !pack)
      return NextResponse.json(
        { error: "This package is no longer available." },
        { status: 400 },
      );
    const { data, error } = await sb.rpc("submit_genaan_enquiry", {
      p_request_id: requestId,
      p_package_id: id,
      p_name: name,
      p_business: business,
      p_phone: phone,
      p_type: type,
      p_area: area,
      p_address: address,
      p_notes: notes,
    });
    if (error)
      return NextResponse.json(
        {
          error: error.message.includes("Too many")
            ? "Too many requests. Please try again later."
            : "Could not save your request. Please try again.",
        },
        { status: error.message.includes("Too many") ? 429 : 503 },
      );
    const ar = body.lang === "ar";
    const typeLabel = BUSINESS_TYPES.find((t) => t.value === type)!;
    const message = ar
      ? `طلب عرض سعر جنان\nالمرجع: ${data}\nالباقة: ${pack.name_ar}\nعدد النباتات: ${pack.plant_count}\nالنشاط: ${typeLabel.ar}\nاسم النشاط: ${business}\nالاسم: ${name}\nالهاتف: ${phone}\nالمساحة: ${area} م²\nالعنوان: ${address}\nملاحظات: ${notes || "—"}\nأرغب في تأكيد التفاصيل والتكلفة عبر واتساب.`
      : `Genaan quotation request\nReference: ${data}\nPackage: ${pack.name_en}\nPlants: ${pack.plant_count}\nBusiness: ${business} (${typeLabel.en})\nContact: ${name}\nPhone: ${phone}\nArea: ${area} m²\nAddress: ${address}\nNotes: ${notes || "—"}\nPlease confirm the details and quotation on WhatsApp.`;
    return NextResponse.json({
      reference: data,
      whatsapp_url: `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not process your request. Please try again." },
      { status: 503 },
    );
  }
});
