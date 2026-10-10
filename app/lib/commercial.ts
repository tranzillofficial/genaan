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
export const DEFAULT_PACKAGES: Omit<PlantPackage, "id">[] = [
  {
    slug: "green-corner",
    name_en: "Green Corner",
    name_ar: "ركن أخضر",
    description_en:
      "A considered first touch of greenery for reception desks and small waiting rooms.",
    description_ar: "لمسة خضراء موزعة بعناية للاستقبال وغرف الانتظار الصغيرة.",
    plant_count: 5,
    area_min: 15,
    area_max: 30,
    price: null,
    image_url: "/assets/hero_image.png",
    includes_en: [
      "1 floor plant + 4 tabletop plants",
      "5 coordinated pots",
      "Placement plan and care guide",
    ],
    includes_ar: [
      "نبات أرضي + ٤ نباتات مكتبية",
      "٥ أصص متناسقة",
      "خطة توزيع ودليل عناية",
    ],
    business_types: ["clinic", "office"],
    care_en: "Low-maintenance selection; optional monthly care.",
    care_ar: "اختيارات سهلة العناية؛ صيانة شهرية اختيارية.",
    is_active: true,
    is_featured: false,
    sort_order: 1,
  },
  {
    slug: "welcoming-space",
    name_en: "Welcoming Space",
    name_ar: "مساحة ترحيب",
    description_en:
      "Create a calm arrival experience across a clinic, office or neighbourhood café.",
    description_ar: "استقبال مريح للعيادات والمكاتب والكافيهات الصغيرة.",
    plant_count: 10,
    area_min: 30,
    area_max: 60,
    price: null,
    image_url: "/assets/hero_image.png",
    includes_en: [
      "3 floor plants + 7 tabletop plants",
      "10 coordinated pots",
      "Reception and seating layout",
    ],
    includes_ar: [
      "٣ نباتات أرضية + ٧ نباتات مكتبية",
      "١٠ أصص متناسقة",
      "توزيع للاستقبال ومناطق الجلوس",
    ],
    business_types: ["clinic", "restaurant", "office"],
    care_en: "Care schedule tailored to light and opening hours.",
    care_ar: "جدول عناية مناسب للإضاءة ومواعيد العمل.",
    is_active: true,
    is_featured: false,
    sort_order: 2,
  },
  {
    slug: "living-business",
    name_en: "Living Business",
    name_ar: "نشاط ينبض بالحياة",
    description_en:
      "A balanced mix of statement plants and small accents for busier commercial spaces.",
    description_ar:
      "مزيج من النباتات البارزة واللمسات الصغيرة للمساحات التجارية المتوسطة.",
    plant_count: 18,
    area_min: 60,
    area_max: 100,
    price: null,
    image_url: "/assets/hero_image.png",
    includes_en: [
      "6 floor plants + 12 accent plants",
      "18 coordinated pots",
      "Zoning for entrances, corners and seating",
    ],
    includes_ar: [
      "٦ نباتات أرضية + ١٢ نباتًا للمسات الديكور",
      "١٨ أصيصًا متناسقًا",
      "توزيع للمداخل والأركان والجلوس",
    ],
    business_types: ["restaurant", "supermarket", "clinic", "office"],
    care_en: "Optional monthly maintenance quoted separately.",
    care_ar: "صيانة شهرية اختيارية بعرض سعر منفصل.",
    is_active: true,
    is_featured: true,
    sort_order: 3,
  },
  {
    slug: "signature-space",
    name_en: "Signature Space",
    name_ar: "مساحة مميزة",
    description_en:
      "A cohesive green identity for a restaurant, larger store or boutique hotel lobby.",
    description_ar:
      "هوية خضراء متكاملة للمطاعم والمحلات الكبيرة واستقبال الفنادق الصغيرة.",
    plant_count: 30,
    area_min: 100,
    area_max: 180,
    price: null,
    image_url: "/assets/hero_image.png",
    includes_en: [
      "10 floor plants + 20 accent plants",
      "30 coordinated pots",
      "Layout proposal for multiple zones",
    ],
    includes_ar: [
      "١٠ نباتات أرضية + ٢٠ نباتًا للديكور",
      "٣٠ أصيصًا متناسقًا",
      "اقتراح توزيع لعدة مناطق",
    ],
    business_types: ["restaurant", "hotel", "supermarket", "office"],
    care_en: "Maintenance and replacement options available in the quote.",
    care_ar: "خيارات الصيانة والاستبدال تُحدد في عرض السعر.",
    is_active: true,
    is_featured: false,
    sort_order: 4,
  },
  {
    slug: "green-destination",
    name_en: "Green Destination",
    name_ar: "وجهة خضراء",
    description_en:
      "A larger planting concept for hotel common areas and expansive commercial floors.",
    description_ar:
      "تصور نباتي للمناطق المشتركة بالفنادق والمساحات التجارية الواسعة.",
    plant_count: 50,
    area_min: 180,
    area_max: 300,
    price: null,
    image_url: "/assets/hero_image.png",
    includes_en: [
      "18 floor plants + 32 accent plants",
      "50 coordinated pots",
      "Multi-zone planting and care proposal",
    ],
    includes_ar: [
      "١٨ نباتًا أرضيًا + ٣٢ نباتًا للديكور",
      "٥٠ أصيصًا متناسقًا",
      "اقتراح توزيع وعناية لعدة مناطق",
    ],
    business_types: ["hotel", "supermarket", "restaurant", "office"],
    care_en: "Scheduled care can be included in a separate service agreement.",
    care_ar: "يمكن إضافة زيارات عناية باتفاق خدمة منفصل.",
    is_active: true,
    is_featured: false,
    sort_order: 5,
  },
];
