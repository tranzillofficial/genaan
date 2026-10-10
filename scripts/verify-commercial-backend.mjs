import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) throw new Error("Set the dedicated Genaan URL and legacy anon key.");
const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
async function request(path, options = {}) {
  const response = await fetch(url + path, { headers, ...options });
  return { status: response.status, body: await response.json() };
}
const packs = await request("/rest/v1/genaan_packages?select=*&order=sort_order");
assert.equal(packs.status, 200); assert.equal(packs.body.length, 6);
assert.equal(packs.body.filter(p => !p.is_custom && p.price > 0).length, 5);
const custom = packs.body.find(p => p.is_custom);
assert.ok(custom); assert.equal(custom.price, null); assert.equal(custom.plant_count, 0);
const settings = await request("/rest/v1/genaan_business_settings?select=key,value");
const values = Object.fromEntries(settings.body.map(r => [r.key, r.value]));
const members = await request("/rest/v1/genaan_admins?select=user_id");
assert.equal(members.status, 200); assert.deepEqual(members.body, []);
assert.ok((await request("/rest/v1/genaan_enquiries?select=id")).status >= 400);
const base = { request_id: randomUUID(), package_id: packs.body[0].id, name: "Genaan automated verification", business_name: "GENAAN QA — DELETE TEST", phone: "201000000001", business_type: "clinic", city: "Cairo QA", area: "", rooms: "3", address: "", notes: "Integration test, not a customer request", care_plan: "quarterly", care_price: 1, lang: "ar" };
assert.ok((await request("/rest/v1/rpc/submit_genaan_enquiry_v2", { method: "POST", body: JSON.stringify({ p_request_id: randomUUID(), p_package_id: packs.body[0].id, p_name: "Test", p_business: "Test", p_phone: base.phone, p_type: "clinic", p_area: null, p_address: "", p_notes: "", p_city: "Cairo", p_rooms: 3, p_care_plan: "quarterly" }) })).status >= 400);
assert.ok((await request("/rest/v1/genaan_packages", { method: "PATCH", body: JSON.stringify({ is_active: false }) })).status >= 400);
assert.ok((await request("/rest/v1/genaan_business_settings", { method: "PATCH", body: JSON.stringify({ value: "1" }) })).status >= 400);
for (const invalid of [{ phone: "bad" }, { ...base, city: "" }, { ...base, care_plan: "fake" }, { ...base, rooms: "1.5" }, { ...base, area: true }]) {
  assert.equal((await request("/functions/v1/genaan-enquiry", { method: "POST", body: JSON.stringify(invalid) })).status, 400);
}
const post = body => request("/functions/v1/genaan-enquiry", { method: "POST", body: JSON.stringify(body) });
const saved = await post(base);
assert.equal(saved.status, 200, JSON.stringify(saved.body));
assert.match(saved.body.reference, /^[a-f0-9-]{36}$/);
const message = decodeURIComponent(saved.body.whatsapp_url.split("?text=")[1]);
assert.ok(message.includes(values.care_quarterly_price));
assert.ok(message.includes("Cairo QA")); assert.ok(message.includes("عدد الغرف: 3")); assert.ok(message.includes("المساحة: غير محددة"));
const repeat = await post({ ...base, care_plan: "none", rooms: "7" });
assert.equal(repeat.status, 200); assert.equal(repeat.body.reference, saved.body.reference);
assert.equal(repeat.body.whatsapp_url, saved.body.whatsapp_url);
const bespoke = await post({ ...base, request_id: randomUUID(), package_id: custom.id, phone: "201000000002", rooms: "", care_plan: "biannual" });
assert.equal(bespoke.status, 200, JSON.stringify(bespoke.body));
assert.ok(decodeURIComponent(bespoke.body.whatsapp_url).includes("عرض سعر مخصص"));
assert.ok(decodeURIComponent(bespoke.body.whatsapp_url).includes(values.care_biannual_price));
console.log(JSON.stringify({ passed: true, tests: ["Six public packages, no fixed bespoke price", "Private membership and enquiries", "Visitor RPC and edits denied", "Invalid care/city/room/area rejected", "Room-only enquiry accepted", "Server annual care price ignores client price", "Retry preserves saved snapshot", "Bespoke enquiry with no area or room count"], test_enquiry_ids: [saved.body.reference, bespoke.body.reference] }));
