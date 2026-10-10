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
  instagram: string;
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
export const DEFAULT_PACKAGES: Omit<PlantPackage, "id">[] = [
  {
    "slug": "green-corner",
    "is_custom": false,
    "name_ar": "ركن أخضر",
    "name_en": "Green Corner",
    "description_ar": "خمس نباتات تضيف لمسة ترحيب للاستقبال أو المدخل أو مساحة عمل صغيرة.",
    "description_en": "Five plants to bring a welcoming touch to a reception, entrance or small workspace.",
    "plant_count": 5,
    "area_min": 15,
    "area_max": 30,
    "price": 4000,
    "image_url": "https://images.unsplash.com/photo-1545239735-f0b35d2b9683?auto=format&fit=crop&w=1200&h=800&q=80",
    "includes_ar": [
      "أريكا واحدة، شيفليرا ارتفاع متر",
      "زنبق السلام، أجلونيما، سانسيفيريا",
      "5 أصص متناسقة مع التوزيع والتجهيز الأولي"
    ],
    "includes_en": [
      "An Areca palm, a one metre Schefflera",
      "Peace lily, aglaonema, snake plant",
      "5 coordinated pots with placement and initial setup"
    ],
    "business_types": [
      "clinic",
      "restaurant",
      "hotel",
      "supermarket",
      "office",
      "other"
    ],
    "care_ar": "عناية سنوية اختيارية بزيارتين أو أربع زيارات. التوصيل بتكلفة منفصلة.",
    "care_en": "Optional annual care with two or four visits. Delivery costs extra.",
    "is_active": true,
    "is_featured": false,
    "sort_order": 1
  },
  {
    "slug": "welcoming-space",
    "is_custom": false,
    "name_ar": "مساحة ترحيب",
    "name_en": "Welcoming Space",
    "description_ar": "عشر نباتات لتنسيق منطقة الاستقبال ومساحات الجلوس القريبة.",
    "description_en": "Ten plants to arrange around a reception and nearby seating areas.",
    "plant_count": 10,
    "area_min": 30,
    "area_max": 60,
    "price": 8500,
    "image_url": "https://images.unsplash.com/photo-1769501203620-29d7bba05e78?auto=format&fit=crop&w=1200&h=800&q=80",
    "includes_ar": [
      "٢ أريكا، شمدوريا، ٢ شيفليرا",
      "٢ أجلونيما، زنبق السلام، إمبريال، بوتس",
      "10 أصص متناسقة مع التوزيع والتجهيز الأولي"
    ],
    "includes_en": [
      "2 areca palms, chamaedorea, 2 scheffleras",
      "2 aglaonemas, peace lily, imperial, pothos",
      "10 coordinated pots with placement and initial setup"
    ],
    "business_types": [
      "clinic",
      "restaurant",
      "hotel",
      "supermarket",
      "office",
      "other"
    ],
    "care_ar": "عناية سنوية اختيارية بزيارتين أو أربع زيارات. التوصيل بتكلفة منفصلة.",
    "care_en": "Optional annual care with two or four visits. Delivery costs extra.",
    "is_active": true,
    "is_featured": false,
    "sort_order": 2
  },
  {
    "slug": "living-business",
    "is_custom": false,
    "name_ar": "نشاط ينبض بالحياة",
    "name_en": "Living Business",
    "description_ar": "ثماني عشرة نبتة لتنسيق الاستقبال والغرف والمساحات المشتركة بطابع متناسق.",
    "description_en": "Eighteen plants to connect the look of your reception, rooms and shared spaces.",
    "plant_count": 18,
    "area_min": 60,
    "area_max": 100,
    "price": 15500,
    "image_url": "https://images.unsplash.com/photo-1773927005455-8efc55a8d512?auto=format&fit=crop&w=1200&h=800&q=80",
    "includes_ar": [
      "٣ أريكا، ٢ شمدوريا، ٣ شيفليرا",
      "٣ أجلونيما، ٢ زنبق السلام، ٢ إمبريال، رابس، ديفنباخيا، بوتس",
      "18 أصص متناسقة مع التوزيع والتجهيز الأولي"
    ],
    "includes_en": [
      "3 areca palms, 2 chamaedoreas, 3 scheffleras",
      "3 aglaonemas, 2 peace lilies, 2 imperials, rhapis, dieffenbachia, pothos",
      "18 coordinated pots with placement and initial setup"
    ],
    "business_types": [
      "clinic",
      "restaurant",
      "hotel",
      "supermarket",
      "office",
      "other"
    ],
    "care_ar": "عناية سنوية اختيارية بزيارتين أو أربع زيارات. التوصيل بتكلفة منفصلة.",
    "care_en": "Optional annual care with two or four visits. Delivery costs extra.",
    "is_active": true,
    "is_featured": true,
    "sort_order": 3
  },
  {
    "slug": "signature-space",
    "is_custom": false,
    "name_ar": "مساحة مميزة",
    "name_en": "Signature Space",
    "description_ar": "ثلاثون نبتة لمساحة تجارية أكبر، مع نخيل ونباتات موزعة في أكثر من منطقة.",
    "description_en": "Thirty plants for a larger business space, with palms and greenery across several areas.",
    "plant_count": 30,
    "area_min": 100,
    "area_max": 180,
    "price": 25000,
    "image_url": "https://images.unsplash.com/photo-1761695939620-a18c88ab83b7?auto=format&fit=crop&w=1200&h=800&q=80",
    "includes_ar": [
      "٥ أريكا، ٣ شمدوريا، ٥ شيفليرا",
      "٥ أجلونيما، ٤ زنبق السلام، ٣ إمبريال، ٢ رابس، ٢ ديفنباخيا، بوتس",
      "30 أصص متناسقة مع التوزيع والتجهيز الأولي"
    ],
    "includes_en": [
      "5 areca palms, 3 chamaedoreas, 5 scheffleras",
      "5 aglaonemas, 4 peace lilies, 3 imperials, 2 rhapis, 2 dieffenbachias, pothos",
      "30 coordinated pots with placement and initial setup"
    ],
    "business_types": [
      "clinic",
      "restaurant",
      "hotel",
      "supermarket",
      "office",
      "other"
    ],
    "care_ar": "عناية سنوية اختيارية بزيارتين أو أربع زيارات. التوصيل بتكلفة منفصلة.",
    "care_en": "Optional annual care with two or four visits. Delivery costs extra.",
    "is_active": true,
    "is_featured": false,
    "sort_order": 4
  },
  {
    "slug": "green-destination",
    "is_custom": false,
    "name_ar": "وجهة خضراء",
    "name_en": "Green Destination",
    "description_ar": "خمسون نبتة لتنسيق مكان واسع أو عدة مساحات متصلة بطابع متناسق.",
    "description_en": "Fifty plants to create a consistent look across a spacious venue or several connected areas.",
    "plant_count": 50,
    "area_min": 180,
    "area_max": 300,
    "price": 41500,
    "image_url": "https://images.unsplash.com/photo-1700760934202-406926c28458?auto=format&fit=crop&w=1200&h=800&q=80",
    "includes_ar": [
      "٨ أريكا، ٥ شمدوريا، ٨ شيفليرا",
      "٨ أجلونيما، ٧ زنبق السلام، ٥ إمبريال، ٤ رابس، ٣ ديفنباخيا، ٢ بوتس",
      "50 أصص متناسقة مع التوزيع والتجهيز الأولي"
    ],
    "includes_en": [
      "8 areca palms, 5 chamaedoreas, 8 scheffleras",
      "8 aglaonemas, 7 peace lilies, 5 imperials, 4 rhapis, 3 dieffenbachias, 2 pothos",
      "50 coordinated pots with placement and initial setup"
    ],
    "business_types": [
      "clinic",
      "restaurant",
      "hotel",
      "supermarket",
      "office",
      "other"
    ],
    "care_ar": "عناية سنوية اختيارية بزيارتين أو أربع زيارات. التوصيل بتكلفة منفصلة.",
    "care_en": "Optional annual care with two or four visits. Delivery costs extra.",
    "is_active": true,
    "is_featured": false,
    "sort_order": 5
  },
  {
    "slug": "custom-package",
    "is_custom": true,
    "name_ar": "باقة على مقاسك",
    "name_en": "Custom Package",
    "description_ar": "باقة نخططها حسب مكانك والتنسيق اللي تفضله وعدد فروعك.",
    "description_en": "A package planned around your space, preferred style and number of branches.",
    "plant_count": 0,
    "area_min": 1,
    "area_max": 100000,
    "price": null,
    "image_url": "/assets/hero_image.png",
    "includes_ar": [
      "نباتات ونخيل مناسبة لمكانك",
      "عدد النباتات والأصص والتوزيع بالاتفاق معك",
      "عرض سعر مخصص، والتوصيل والعناية بتكلفة منفصلة"
    ],
    "includes_en": [
      "Plants and palms chosen for your space",
      "Plant count, pots and layout agreed with you",
      "A custom quote with delivery and care priced separately"
    ],
    "business_types": [
      "clinic",
      "restaurant",
      "hotel",
      "supermarket",
      "office",
      "other"
    ],
    "care_ar": "يمكن إضافة خطة عناية سنوية عند طلب عرض السعر.",
    "care_en": "Choose optional annual care when you request a quote.",
    "is_active": true,
    "is_featured": false,
    "sort_order": 6
  }
];

export type PlantVariety = {
  id: string;
  name_ar: string;
  name_en: string;
  image_url: string;
  category: "plant" | "palm";
  is_active: boolean;
  sort_order: number;
};
export const CARE_PLANS = [
  { value: "none", ar: "بدون اشتراك عناية", en: "No care subscription", visits: 0 },
  { value: "biannual", ar: "زيارتان سنويًا، زيارة كل ٦ شهور", en: "Two visits per year, every six months", visits: 2 },
  { value: "quarterly", ar: "٤ زيارات سنويًا، زيارة كل ٣ شهور", en: "Four visits per year, every three months", visits: 4 },
] as const;
export function carePrice(settings: BusinessSettings, plan: string): number {
  if (plan === "none") return 0;
  const value = Number(plan === "quarterly" ? settings.care_quarterly_price : settings.care_biannual_price);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

export function normalizeInstagram(value: string): string {
  if (!value.trim()) return "";
  try {
    const url = new URL(value.trim());
    if (!["https:", "http:"].includes(url.protocol) || !["instagram.com", "www.instagram.com"].includes(url.hostname) || url.username || url.password || url.port || url.pathname === "/") return "";
    return `https://www.instagram.com${url.pathname}`;
  } catch { return ""; }
}
