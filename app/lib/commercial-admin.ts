import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

/** Validated user token + database membership; no service-role bypass. */
export async function commercialAdmin(req: NextRequest) {
  const token = req.headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) return { error: "Unauthorized", status: 401 } as const;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key)
    return { error: "Backend is not configured", status: 503 } as const;
  const client = createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });
  const {
    data: { user },
    error,
  } = await client.auth.getUser(token);
  if (error || !user) return { error: "Unauthorized", status: 401 } as const;
  const { data: member } = await client
    .from("genaan_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!member) return { error: "Forbidden", status: 403 } as const;
  return { client } as const;
}
