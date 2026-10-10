import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key)
  throw new Error("Set the dedicated Genaan URL and legacy anon key.");
const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
};
async function request(path, options = {}) {
  const response = await fetch(url + path, { headers, ...options });
  const body = await response.json();
  return { status: response.status, body };
}
const packages = await request(
  "/rest/v1/genaan_packages?select=*&order=sort_order",
);
assert.equal(packages.status, 200);
assert.equal(packages.body.length, 5);
const members = await request("/rest/v1/genaan_admins?select=user_id");
assert.equal(members.status, 200);
assert.deepEqual(members.body, []);
const privateRequests = await request("/rest/v1/genaan_enquiries?select=id");
assert.ok(privateRequests.status >= 400);
const deniedRpc = await request("/rest/v1/rpc/submit_genaan_enquiry", {
  method: "POST",
  body: JSON.stringify({
    p_request_id: randomUUID(),
    p_package_id: packages.body[0].id,
    p_name: "Test",
    p_business: "Test",
    p_phone: "201000000001",
    p_type: "clinic",
    p_area: 20,
    p_address: "Test",
    p_notes: "",
  }),
});
assert.ok(deniedRpc.status >= 400);
const deniedWrite = await request("/rest/v1/genaan_packages", {
  method: "PATCH",
  body: JSON.stringify({ is_active: false }),
});
assert.ok(deniedWrite.status >= 400);
const malformed = await request("/functions/v1/genaan-enquiry", {
  method: "POST",
  body: JSON.stringify({ phone: "bad" }),
});
assert.equal(malformed.status, 400);
const requestId = randomUUID();
const body = {
  request_id: requestId,
  package_id: packages.body[0].id,
  name: "Genaan automated verification",
  business_name: "GENAAN QA — DELETE TEST",
  phone: "201000000001",
  business_type: "clinic",
  area: 20,
  address: "Test only — no delivery",
  notes: "Integration test, not a customer request",
  lang: "ar",
};
const saved = await request("/functions/v1/genaan-enquiry", {
  method: "POST",
  body: JSON.stringify(body),
});
assert.equal(saved.status, 200, JSON.stringify(saved.body));
assert.match(saved.body.reference, /^[a-f0-9-]{36}$/);
assert.match(saved.body.whatsapp_url, /^https:\/\/wa\.me\/201094963553\?text=/);
const repeat = await request("/functions/v1/genaan-enquiry", {
  method: "POST",
  body: JSON.stringify(body),
});
assert.equal(repeat.status, 200);
assert.equal(repeat.body.reference, saved.body.reference);
console.log(
  JSON.stringify({
    passed: true,
    tests: [
      "Public packages",
      "Admin membership private",
      "Enquiries private",
      "RPC denied to visitors",
      "Package edits denied to visitors",
      "Invalid input rejected",
      "Saved enquiry + WhatsApp draft",
      "Duplicate retry idempotent",
    ],
    test_request_id: requestId,
    test_enquiry_id: saved.body.reference,
  }),
);
