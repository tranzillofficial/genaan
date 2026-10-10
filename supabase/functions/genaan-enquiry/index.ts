import { createClient } from "npm:@supabase/supabase-js@2.106.2";
import { BUSINESS_TYPES, CARE_PLANS, normalizeWhatsApp } from "./commercial.ts";
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { "Content-Type": "application/json" },
});
Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (Number(req.headers.get("content-length")) > 16000) return json({ error: "Request too large" }, 413);
  try {
    const raw = await req.text();
    if (raw.length > 16000) return json({ error: "Request too large" }, 413);
    const body = JSON.parse(raw);
    const clean = (key: string, max: number) => typeof body[key] === "string" ? body[key].trim().slice(0, max) : "";
    const optionalNumber = (key: string) => body[key] === "" || body[key] === undefined || body[key] === null
      ? null : typeof body[key] === "string" || typeof body[key] === "number" ? Number(body[key]) : NaN;
    const name = clean("name", 120), business = clean("business_name", 160), phone = normalizeWhatsApp(clean("phone", 30));
    const type = clean("business_type", 30), address = clean("address", 500), notes = clean("notes", 1500);
    // Older deployed clients supplied a combined city/address field.
    const city = clean("city", 120) || (body.city === undefined ? clean("address", 120) : "");
    const area = optionalNumber("area"), rooms = optionalNumber("rooms");
    const id = clean("package_id", 80), requestId = clean("request_id", 80), plan = body.care_plan === undefined ? "none" : clean("care_plan", 30);
    if (body.website || !name || !business || !phone || !city || !BUSINESS_TYPES.some(t => t.value === type)
      || !CARE_PLANS.some(p => p.value === plan)
      || (area !== null && (!Number.isFinite(area) || area < 1 || area > 100000))
      || (rooms !== null && (!Number.isInteger(rooms) || rooms < 1 || rooms > 10000))
      || !/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(requestId)
      || !/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id))
      return json({ error: "Please enter valid business, city and contact details. Area and rooms are optional." }, 400);
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
    const { data, error } = await sb.rpc("submit_genaan_enquiry_v2", {
      p_request_id: requestId, p_package_id: id, p_name: name, p_business: business, p_phone: phone,
      p_type: type, p_area: area, p_address: address, p_notes: notes, p_city: city, p_rooms: rooms, p_care_plan: plan,
    });
    if (error) return json({ error: error.message.includes("Too many") ? "Too many requests. Please try again later." : "Could not save your request. Please try again." }, error.message.includes("Too many") ? 429 : 503);
    return json({ reference: data });
  } catch { return json({ error: "Could not process your request. Please try again." }, 503); }
});
