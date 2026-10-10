export type BusinessType =
  | "clinic"
  | "restaurant"
  | "hotel"
  | "supermarket"
  | "office"
  | "other";
export type PlantPackage = {
  id: string;
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
