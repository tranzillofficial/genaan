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
export const DEFAULT_PACKAGES: Omit<PlantPackage, "id">[] = [
  {
    "slug": "green-corner",
    "is_custom": false,
    "name_ar": "ركن أخضر",
    "name_en": "Green Corner",
    "description_ar": "نباتات أرضية ونخيل زينة تمنح نشاطك حضورًا أخضر، مع لمسات نباتية مكملة حسب الإضاءة.",
    "description_en": "Floor plants and ornamental palms give your business a green presence, with complementary planting matched to the light.",
    "plant_count": 5,
    "area_min": 15,
    "area_max": 30,
    "price": 4000,
    "image_url": "https://images.unsplash.com/photo-1545239735-f0b35d2b9683?auto=format&fit=crop&w=1200&h=800&q=80",
    "includes_ar": [
      "أريكا واحدة + شيفليرا ارتفاع متر",
      "زنبق السلام + أجلونيما + سانسيفيريا",
      "5 أصيصًا متناسقًا + توزيع وتجهيز أولي"
    ],
    "includes_en": [
      "1 areca palm + 1 metre schefflera",
      "Peace lily + aglaonema + snake plant",
      "5 coordinated pots + placement and initial setup"
    ],
    "business_types": [
      "clinic",
      "restaurant",
      "hotel",
      "supermarket",
      "office",
      "other"
    ],
    "care_ar": "عناية سنوية اختيارية بزيارتين أو أربع زيارات؛ التوصيل منفصل.",
    "care_en": "Optional annual care with 2 or 4 visits; delivery charged separately.",
    "is_active": true,
    "is_featured": false,
    "sort_order": 1
  },
  {
    "slug": "welcoming-space",
    "is_custom": false,
    "name_ar": "مساحة ترحيب",
    "name_en": "Welcoming Space",
    "description_ar": "نباتات أرضية ونخيل زينة تمنح نشاطك حضورًا أخضر، مع لمسات نباتية مكملة حسب الإضاءة.",
    "description_en": "Floor plants and ornamental palms give your business a green presence, with complementary planting matched to the light.",
    "plant_count": 10,
    "area_min": 30,
    "area_max": 60,
    "price": 8500,
    "image_url": "https://images.unsplash.com/photo-1769501203620-29d7bba05e78?auto=format&fit=crop&w=1200&h=800&q=80",
    "includes_ar": [
      "٢ أريكا + شمدوريا + ٢ شيفليرا",
      "٢ أجلونيما + زنبق السلام + إمبريال + بوتس",
      "10 أصيصًا متناسقًا + توزيع وتجهيز أولي"
    ],
    "includes_en": [
      "2 areca palms + chamaedorea + 2 scheffleras",
      "2 aglaonemas + peace lily + imperial + pothos",
      "10 coordinated pots + placement and initial setup"
    ],
    "business_types": [
      "clinic",
      "restaurant",
      "hotel",
      "supermarket",
      "office",
      "other"
    ],
    "care_ar": "عناية سنوية اختيارية بزيارتين أو أربع زيارات؛ التوصيل منفصل.",
    "care_en": "Optional annual care with 2 or 4 visits; delivery charged separately.",
    "is_active": true,
    "is_featured": false,
    "sort_order": 2
  },
  {
    "slug": "living-business",
    "is_custom": false,
    "name_ar": "نشاط ينبض بالحياة",
    "name_en": "Living Business",
    "description_ar": "نباتات أرضية ونخيل زينة تمنح نشاطك حضورًا أخضر، مع لمسات نباتية مكملة حسب الإضاءة.",
    "description_en": "Floor plants and ornamental palms give your business a green presence, with complementary planting matched to the light.",
    "plant_count": 18,
    "area_min": 60,
    "area_max": 100,
    "price": 15500,
    "image_url": "https://images.unsplash.com/photo-1773927005455-8efc55a8d512?auto=format&fit=crop&w=1200&h=800&q=80",
    "includes_ar": [
      "٣ أريكا + ٢ شمدوريا + ٣ شيفليرا",
      "٣ أجلونيما + ٢ زنبق السلام + ٢ إمبريال + رابس + ديفنباخيا + بوتس",
      "18 أصيصًا متناسقًا + توزيع وتجهيز أولي"
    ],
    "includes_en": [
      "3 areca palms + 2 chamaedoreas + 3 scheffleras",
      "3 aglaonemas + 2 peace lilies + 2 imperials + rhapis + dieffenbachia + pothos",
      "18 coordinated pots + placement and initial setup"
    ],
    "business_types": [
      "clinic",
      "restaurant",
      "hotel",
      "supermarket",
      "office",
      "other"
    ],
    "care_ar": "عناية سنوية اختيارية بزيارتين أو أربع زيارات؛ التوصيل منفصل.",
    "care_en": "Optional annual care with 2 or 4 visits; delivery charged separately.",
    "is_active": true,
    "is_featured": true,
    "sort_order": 3
  },
  {
    "slug": "signature-space",
    "is_custom": false,
    "name_ar": "مساحة مميزة",
    "name_en": "Signature Space",
    "description_ar": "نباتات أرضية ونخيل زينة تمنح نشاطك حضورًا أخضر، مع لمسات نباتية مكملة حسب الإضاءة.",
    "description_en": "Floor plants and ornamental palms give your business a green presence, with complementary planting matched to the light.",
    "plant_count": 30,
    "area_min": 100,
    "area_max": 180,
    "price": 25000,
    "image_url": "https://images.unsplash.com/photo-1761695939620-a18c88ab83b7?auto=format&fit=crop&w=1200&h=800&q=80",
    "includes_ar": [
      "٥ أريكا + ٣ شمدوريا + ٥ شيفليرا",
      "٥ أجلونيما + ٤ زنبق السلام + ٣ إمبريال + ٢ رابس + ٢ ديفنباخيا + بوتس",
      "30 أصيصًا متناسقًا + توزيع وتجهيز أولي"
    ],
    "includes_en": [
      "5 areca palms + 3 chamaedoreas + 5 scheffleras",
      "5 aglaonemas + 4 peace lilies + 3 imperials + 2 rhapis + 2 dieffenbachias + pothos",
      "30 coordinated pots + placement and initial setup"
    ],
    "business_types": [
      "clinic",
      "restaurant",
      "hotel",
      "supermarket",
      "office",
      "other"
    ],
    "care_ar": "عناية سنوية اختيارية بزيارتين أو أربع زيارات؛ التوصيل منفصل.",
    "care_en": "Optional annual care with 2 or 4 visits; delivery charged separately.",
    "is_active": true,
    "is_featured": false,
    "sort_order": 4
  },
  {
    "slug": "green-destination",
    "is_custom": false,
    "name_ar": "وجهة خضراء",
    "name_en": "Green Destination",
    "description_ar": "نباتات أرضية ونخيل زينة تمنح نشاطك حضورًا أخضر، مع لمسات نباتية مكملة حسب الإضاءة.",
    "description_en": "Floor plants and ornamental palms give your business a green presence, with complementary planting matched to the light.",
    "plant_count": 50,
    "area_min": 180,
    "area_max": 300,
    "price": 41500,
    "image_url": "https://images.unsplash.com/photo-1700760934202-406926c28458?auto=format&fit=crop&w=1200&h=800&q=80",
    "includes_ar": [
      "٨ أريكا + ٥ شمدوريا + ٨ شيفليرا",
      "٨ أجلونيما + ٧ زنبق السلام + ٥ إمبريال + ٤ رابس + ٣ ديفنباخيا + ٢ بوتس",
      "50 أصيصًا متناسقًا + توزيع وتجهيز أولي"
    ],
    "includes_en": [
      "8 areca palms + 5 chamaedoreas + 8 scheffleras",
      "8 aglaonemas + 7 peace lilies + 5 imperials + 4 rhapis + 3 dieffenbachias + 2 pothos",
      "50 coordinated pots + placement and initial setup"
    ],
    "business_types": [
      "clinic",
      "restaurant",
      "hotel",
      "supermarket",
      "office",
      "other"
    ],
    "care_ar": "عناية سنوية اختيارية بزيارتين أو أربع زيارات؛ التوصيل منفصل.",
    "care_en": "Optional annual care with 2 or 4 visits; delivery charged separately.",
    "is_active": true,
    "is_featured": false,
    "sort_order": 5
  },
  {
    "slug": "custom-package",
    "is_custom": true,
    "name_ar": "باقة على مقاسك",
    "name_en": "Your Bespoke Package",
    "description_ar": "للفروع المتعددة والمساحات المختلفة: نحدد النباتات والنخيل والعدد والتوزيع معك قبل عرض السعر.",
    "description_en": "For multiple branches or a unique space: discuss plant varieties, palms, quantities and layout before a quotation.",
    "plant_count": 0,
    "area_min": 1,
    "area_max": 100000,
    "price": null,
    "image_url": "/assets/hero_image.png",
    "includes_ar": [
      "نباتات ونخيل حسب المكان والإضاءة",
      "عدد وأصص وتوزيع يتم الاتفاق عليهم",
      "عرض سعر مخصص؛ التوصيل والعناية منفصلان"
    ],
    "includes_en": [
      "Plants and palms tailored to your space and light",
      "Agree quantities, pots and placement together",
      "Bespoke quote; delivery and care charged separately"
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
    "care_en": "Add an annual care plan when requesting your quotation.",
    "is_active": true,
    "is_featured": false,
    "sort_order": 6
  }
];

export const CURATED_PLANTS = [
  { ar: "أجلونيما", en: "Aglaonema" },
  { ar: "شيفليرا ارتفاع متر", en: "1 metre Schefflera" },
  { ar: "كلاسيا", en: "Clusia" },
  { ar: "ديفنباخيا", en: "Dieffenbachia" },
  { ar: "زنبق السلام", en: "Peace lily" },
  { ar: "فوجير", en: "Fern" },
  { ar: "إمبريال", en: "Imperial" },
  { ar: "ببروميا خضراء", en: "Green Peperomia" },
  { ar: "سانسيفيريا (تعبان)", en: "Snake plant" },
  { ar: "ألوكاسيا", en: "Alocasia" },
  { ar: "سنجونيوم", en: "Syngonium" },
  { ar: "بوتس إنجوي معلّق", en: "Hanging N'Joy Pothos" },
  { ar: "نخيل أريكا", en: "Areca palm" },
  { ar: "نخيل شمدوريا", en: "Chamaedorea palm" },
  { ar: "نخيل رابس", en: "Rhapis palm" },
];
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
