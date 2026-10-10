import { unstable_cache } from "next/cache";
import { createServerSupabase } from "./supabase-server";
import {
  DEFAULT_PACKAGES,
  type PlantPackage,
  type PlantVariety,
  type BusinessSettings,
} from "./commercial";

export const getCommercialData = unstable_cache(
  async () => {
    try {
      const sb = createServerSupabase();
      const [packages, settings, plants] = await Promise.all([
        sb
          .from("genaan_packages")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
        sb.from("genaan_business_settings").select("key,value"),
        sb.from("genaan_plants").select("id,name_ar,name_en,image_url,category,is_active,sort_order").eq("is_active", true).order("sort_order").order("created_at"),
      ]);
      if (packages.error || settings.error || plants.error)
        throw new Error("Commercial backend unavailable");
      const values = Object.fromEntries(
        (settings.data ?? []).map((row) => [row.key, row.value]),
      );
      return {
        plants: (plants.data ?? []) as PlantVariety[],
        packages: (packages.data ?? []) as PlantPackage[],
        settings: {
          instagram: values.instagram || "",
          whatsapp: values.whatsapp || "",
          email: values.email || "",
          phone: values.phone || "",
          care_biannual_price: values.care_biannual_price || "1200",
          care_quarterly_price: values.care_quarterly_price || "2200",
        } as BusinessSettings,
        available: true,
      };
    } catch {
      return {
        plants: [] as PlantVariety[],
        packages: DEFAULT_PACKAGES.map((p) => ({ ...p, id: p.slug })),
        settings: { instagram: "", whatsapp: "", email: "", phone: "", care_biannual_price: "1200", care_quarterly_price: "2200" },
        available: false,
      };
    }
  },
  ["genaan-commercial-v4"],
  { revalidate: 60, tags: ["genaan-commercial"] },
);
