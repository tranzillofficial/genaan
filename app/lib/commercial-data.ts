import { unstable_cache } from "next/cache";
import { createServerSupabase } from "./supabase-server";
import {
  DEFAULT_PACKAGES,
  type PlantPackage,
  type BusinessSettings,
} from "./commercial";

export const getCommercialData = unstable_cache(
  async () => {
    try {
      const sb = createServerSupabase();
      const [packages, settings] = await Promise.all([
        sb
          .from("genaan_packages")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
        sb.from("genaan_business_settings").select("key,value"),
      ]);
      if (packages.error || settings.error)
        throw new Error("Commercial backend unavailable");
      const values = Object.fromEntries(
        (settings.data ?? []).map((row) => [row.key, row.value]),
      );
      return {
        packages: (packages.data ?? []) as PlantPackage[],
        settings: {
          whatsapp: values.whatsapp || "",
          email: values.email || "",
          phone: values.phone || "",
        } as BusinessSettings,
        available: true,
      };
    } catch {
      return {
        packages: DEFAULT_PACKAGES.map((p) => ({ ...p, id: p.slug })),
        settings: { whatsapp: "", email: "", phone: "" },
        available: false,
      };
    }
  },
  ["genaan-commercial-v1"],
  { revalidate: 60, tags: ["genaan-commercial"] },
);
