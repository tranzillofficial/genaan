export type BusinessType =
  | "clinic"
  | "restaurant"
  | "hotel"
  | "supermarket"
  | "office"
  | "other";
export type PlantPackage = {
  id: string;
  is_custom: boolean;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  plant_count: number;
  area_min: number;
  area_max: number;
  price: number | null;
  image_url: string;
  includes_en: string[];
  includes_ar: string[];
  business_types: BusinessType[];
  care_en: string;
  care_ar: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
};
export type BusinessSettings = {
  whatsapp: string;
  email: string;
  phone: string;
  care_biannual_price: string;
  care_quarterly_price: string;
};
export const BUSINESS_TYPES: { value: BusinessType; en: string; ar: string }[] =
  [
    { value: "clinic", en: "Clinic", ar: "عيادة" },
    { value: "restaurant", en: "Restaurant / Café", ar: "مطعم / كافيه" },
    { value: "hotel", en: "Hotel", ar: "فندق" },
    { value: "supermarket", en: "Supermarket", ar: "سوبر ماركت" },
    { value: "office", en: "Office", ar: "مكتب / شركة" },
    { value: "other", en: "Other", ar: "نشاط آخر" },
  ];
export function normalizeWhatsApp(value: string): string {
  let digits = value.trim().replace(/[^0-9]/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (/^01[0125]\d{8}$/.test(digits)) digits = "2" + digits;
  return /^[1-9]\d{7,14}$/.test(digits) ? digits : "";
}
export const CARE_PLANS = [
  { value: "none", ar: "بدون اشتراك عناية", en: "No care subscription", visits: 0 },
  { value: "biannual", ar: "زيارة كل ٦ شهور — زيارتان سنويًا", en: "Every 6 months — 2 annual visits", visits: 2 },
  { value: "quarterly", ar: "زيارة كل ٣ شهور — ٤ زيارات سنويًا", en: "Every 3 months — 4 annual visits", visits: 4 },
] as const;
export function carePrice(settings: BusinessSettings, plan: string): number {
  if (plan === "none") return 0;
  const value = Number(plan === "quarterly" ? settings.care_quarterly_price : settings.care_biannual_price);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}
