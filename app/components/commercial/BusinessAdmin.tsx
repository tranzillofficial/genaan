"use client";
import { useEffect, useState } from "react";
import { useI18n } from "../../lib/i18n-context";
import {
  getAdminAuthHeaders,
  getAdminUploadHeaders,
} from "../../lib/admin-auth";
import {
  BUSINESS_TYPES,
  DEFAULT_PACKAGES,
  CARE_PLANS,
  type PlantPackage,
} from "../../lib/commercial";

type Enquiry = {
  id: string;
  created_at: string;
  package_snapshot: {
    name_en: string;
    name_ar: string;
    plant_count: number;
    is_custom?: boolean;
    price: number | null;
  };
  contact_name: string;
  business_name: string;
  business_type: string;
  phone: string;
  area: number | null;
  city: string;
  rooms: number | null;
  care_plan: string;
  care_price: number;
  address: string;
  notes: string;
  status: string;
  admin_notes: string;
};
const STATUS = [
  { value: "new", ar: "جديد", en: "New" },
  { value: "contacted", ar: "تم التواصل", en: "Contacted" },
  { value: "quoted", ar: "عرض سعر", en: "Quoted" },
  { value: "confirmed", ar: "مؤكد", en: "Confirmed" },
  { value: "completed", ar: "مكتمل", en: "Completed" },
  { value: "closed", ar: "مغلق", en: "Closed" },
];
export function BusinessAdmin({
  mode,
}: {
  mode: "overview" | "packages" | "enquiries" | "settings";
}) {
  const { isRTL } = useI18n();
  const c = (ar: string, en: string) => (isRTL ? ar : en);
  const [packages, setPackages] = useState<PlantPackage[]>([]),
    [enquiries, setEnquiries] = useState<Enquiry[]>([]),
    [settings, setSettings] = useState({ whatsapp: "", email: "", phone: "", care_biannual_price: "1200", care_quarterly_price: "2200" });
  const [editing, setEditing] = useState<Partial<PlantPackage> | null>(null);
  const [loading, setLoading] = useState(true),
    [saving, setSaving] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const [query, setQuery] = useState(""),
    [status, setStatus] = useState("all");
  const [page, setPage] = useState(0);
  const input =
    "w-full rounded-xl border border-[#d4ded7] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#17583a]";
  async function get(kind: string) {
    const response = await fetch(`/api/admin/business?kind=${kind}`, {
      headers: await getAdminAuthHeaders(),
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  }
  async function load() {
    setError("");
    try {
      if (mode === "settings" || mode === "overview") {
        const rows = await get("settings");
        setSettings(
          Object.fromEntries(
            rows.map((r: { key: string; value: string }) => [r.key, r.value]),
          ) as typeof settings,
        );
      }
      if (mode === "packages" || mode === "overview")
        setPackages(await get("packages"));
      if (mode === "enquiries" || mode === "overview")
        setEnquiries(await get("enquiries"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load data");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, [mode]);
  async function save(body: unknown) {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/business", {
        method: "POST",
        headers: await getAdminAuthHeaders(),
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setMessage(c("تم الحفظ", "Saved"));
      await load();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
      return false;
    } finally {
      setSaving(false);
    }
  }
  async function upload(file?: File) {
    if (!file) return;
    if (
      !/^(image\/(jpeg|png|webp|avif))$/.test(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setError(
        c(
          "الصورة يجب أن تكون JPG أو PNG أو WebP أو AVIF وأقل من ٥ ميجا.",
          "Use a JPG, PNG, WebP or AVIF image under 5 MB.",
        ),
      );
      return;
    }
    setSaving(true);
    setError("");
    try {
      const body = new FormData();
      body.set("file", file);
      const response = await fetch("/api/admin/business/upload", {
        method: "POST",
        headers: await getAdminUploadHeaders(),
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setEditing((p) => ({ ...p, image_url: data.url }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setSaving(false);
    }
  }
  const filtered = enquiries.filter(
    (e) =>
      (status === "all" || e.status === status) &&
      `${e.business_name} ${e.contact_name} ${e.phone} ${e.city} ${e.id}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  function exportCsv() {
    const rows = [
      [
        "Reference",
        "Date",
        "Package",
        "Business",
        "Contact",
        "Phone",
        "City",
        "Business type",
        "Area m2",
        "Rooms",
        "Annual care",
        "Annual starting care price EGP",
        "Address",
        "Status",
      ],
      ...filtered.map((e) => [
        e.id,
        e.created_at,
        isRTL ? e.package_snapshot.name_ar : e.package_snapshot.name_en,
        e.business_name,
        e.contact_name,
        e.phone,
        e.city || "",
        e.business_type,
        e.area === null ? "" : String(e.area),
        e.rooms === null ? "" : String(e.rooms),
        e.care_plan,
        String(e.care_price),
        e.address,
        e.status,
      ]),
    ];
    const escape = (s: string) =>
      '"' + (/^[=+\-@]/.test(s) ? "'" : "") + s.replaceAll('"', '""') + '"';
    const blob = new Blob(
      ["\uFEFF" + rows.map((r) => r.map(escape).join(",")).join("\n")],
      { type: "text/csv;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "genaan-quote-requests.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#5f786c]">
            GENAAN / BUSINESS
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            {mode === "overview"
              ? c("جنان للأعمال", "Genaan for business")
              : mode === "packages"
                ? c("باقات النباتات", "Plant packages")
                : mode === "enquiries"
                  ? c("طلبات عروض الأسعار", "Quote requests")
                  : c("التواصل والعناية السنوية", "Contact & annual care")}
          </h1>
        </div>
        <button
          className="rounded-xl border px-4 py-2 text-sm"
          onClick={() => void load()}
        >
          {c("تحديث", "Refresh")}
        </button>
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {message && (
        <p
          role="status"
          className="rounded-xl bg-[#e8f3ec] p-3 text-sm text-[#17583a]"
        >
          {message}
        </p>
      )}
      {loading ? (
        <p>{c("جارٍ التحميل…", "Loading…")}</p>
      ) : (
        <>
          {mode === "overview" && (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  [
                    c("باقات منشورة", "Published packages"),
                    packages.filter((p) => p.is_active).length,
                  ],
                  [
                    c("طلبات جديدة", "New requests"),
                    enquiries.filter((e) => e.status === "new").length,
                  ],
                  [
                    c("طلبات مؤكدة", "Confirmed requests"),
                    enquiries.filter((e) => e.status === "confirmed").length,
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-[#e4ece7] bg-white p-6"
                  >
                    <p className="text-sm text-[#5f786c]">{label}</p>
                    <p className="mt-3 text-4xl font-bold">{value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-[#0d3a24] p-8 text-white">
                <h2 className="text-xl font-bold">
                  {c(
                    "من مساحة فارغة إلى انطباع أخضر",
                    "From an empty space to a green impression",
                  )}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/75">
                  {c(
                    "أدر الباقات وطلبات العملاء من هنا. الطلبات هي استفسارات وعروض أسعار، ويُؤكد التنفيذ مع العميل عبر واتساب.",
                    "Manage packages and customer requests here. Enquiries become confirmed work only after you agree the details with the customer on WhatsApp.",
                  )}
                </p>
                <p className="mt-4 text-sm">
                  {c("واتساب الطلبات:", "Orders WhatsApp:")}{" "}
                  <span dir="ltr">
                    {settings.whatsapp || c("لم يتم تحديده", "Not configured")}
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  ["/admin/packages", c("إدارة الباقات", "Manage packages")],
                  ["/admin/business-orders", c("عرض الطلبات", "View requests")],
                  [
                    "/admin/business-settings",
                    c("إعداد التواصل", "Contact settings"),
                  ],
                ].map(([href, label]) => (
                  <a
                    key={href}
                    href={href}
                    className="rounded-xl border bg-white px-5 py-3 text-sm font-semibold"
                  >
                    {label} ↗
                  </a>
                ))}
              </div>
            </>
          )}
          {mode === "settings" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void save({ kind: "settings", ...settings });
              }}
              className="max-w-2xl space-y-5 rounded-2xl border border-[#e4ece7] bg-white p-6"
            >
              <p className="text-sm leading-7 text-[#5f786c]">
                {c(
                  "رقم الواتساب يستقبل تفاصيل الباقة والنشاط والعميل. أدخل كود الدولة؛ الأرقام المصرية المحلية تتحول تلقائيًا إلى +20.",
                  "This WhatsApp number receives package and customer details. Include the country code; Egyptian local numbers are converted to +20 automatically.",
                )}
              </p>
              {[
                [
                  "whatsapp",
                  c("رقم واتساب الطلبات", "Orders WhatsApp number"),
                  "tel",
                ],
                ["email", c("البريد الإلكتروني", "Contact email"), "email"],
                ["phone", c("رقم التواصل", "Contact phone"), "tel"],
                ["care_biannual_price", c("سعر بداية العناية السنوية — زيارتان (جنيه)", "Annual starting care price — 2 visits (EGP)"), "number"],
                ["care_quarterly_price", c("سعر بداية العناية السنوية — ٤ زيارات (جنيه)", "Annual starting care price — 4 visits (EGP)"), "number"],
              ].map(([key, label, type]) => (
                <label className="block text-sm" key={key}>
                  <span className="mb-2 block font-semibold">{label}</span>
                  <input
                    type={type}
                    required={type === "number"}
                    min={type === "number" ? 0 : undefined}
                    max={type === "number" ? 9999999 : undefined}
                    step={type === "number" ? "0.01" : undefined}
                    value={settings[key as keyof typeof settings] || ""}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, [key]: e.target.value }))
                    }
                    className={input}
                    maxLength={200}
                    dir="ltr"
                  />
                </label>
              ))}
              <p className="text-xs leading-6 text-[#5f786c]">{c("يمكن تغيير رقم التواصل ورقم واتساب بشكل مستقل. أسعار العناية لسنة كاملة، وليست للزيارة؛ تتأكد حسب عدد النباتات والمدينة. الطلبات القديمة تحتفظ بسعرها وقت الاستفسار.", "Contact phone and WhatsApp can be changed independently. Care prices cover a full year, not a single visit; confirm for plant count and city. Existing requests retain their original price snapshot.")}</p>
              <button
                disabled={saving}
                className="rounded-xl bg-[#17583a] px-6 py-3 font-semibold text-white disabled:opacity-50"
              >
                {saving
                  ? c("جارٍ الحفظ…", "Saving…")
                  : c("حفظ الإعدادات", "Save settings")}
              </button>
            </form>
          )}
          {mode === "packages" && (
            <>
              <button
                onClick={() => {
                  setEditing({
                    ...DEFAULT_PACKAGES[0],
                    slug: "new-package",
                    name_ar: "",
                    name_en: "",
                    sort_order: packages.length + 1,
                    is_active: false,
                  });
                  setMessage("");
                }}
                className="rounded-xl bg-[#17583a] px-5 py-3 text-sm font-semibold text-white"
              >
                + {c("إضافة باقة", "Add package")}
              </button>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {packages.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl border border-[#e4ece7] bg-white p-5"
                  >
                    <img
                      src={p.image_url || "/assets/hero_image.png"}
                      alt={isRTL ? p.name_ar : p.name_en}
                      className="mb-4 h-36 w-full rounded-xl object-cover"
                    />
                    <div className="flex justify-between gap-2">
                      <h2 className="text-xl font-bold">
                        {isRTL ? p.name_ar : p.name_en}
                      </h2>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${p.is_active ? "bg-[#e8f3ec]" : "bg-gray-100"}`}
                      >
                        {p.is_active
                          ? c("منشورة", "Published")
                          : c("مسودة", "Draft")}
                      </span>
                    </div>
                    <p className="my-3 text-sm text-[#5f786c]">
                      {p.plant_count} {c("نبات", "plants")} · {p.area_min}–
                      {p.area_max} m²
                    </p>
                    <button
                      className="rounded-xl border px-4 py-2 text-sm font-semibold"
                      onClick={() => {
                        setEditing(p);
                        setMessage("");
                      }}
                    >
                      {c("تعديل الباقة", "Edit package")}
                    </button>
                  </div>
                ))}
              </div>
              {editing && (
                <form
                  className="rounded-2xl border border-[#d4ded7] bg-white p-6"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (await save({ kind: "package", package: editing }))
                      setEditing(null);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                      {c("تفاصيل الباقة", "Package details")}
                    </h2>
                    <button type="button" onClick={() => setEditing(null)}>
                      {c("إغلاق", "Close")} ×
                    </button>
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {[
                      ["slug", c("الرابط المختصر", "Slug"), "text"],
                      ["name_ar", c("الاسم بالعربية", "Arabic name"), "text"],
                      [
                        "name_en",
                        c("الاسم بالإنجليزية", "English name"),
                        "text",
                      ],
                      [
                        "plant_count",
                        c("عدد النباتات", "Plant count"),
                        "number",
                      ],
                      [
                        "area_min",
                        c("المساحة من (م²)", "Area from (m²)"),
                        "number",
                      ],
                      [
                        "area_max",
                        c("المساحة إلى (م²)", "Area to (m²)"),
                        "number",
                      ],
                      [
                        "price",
                        c(
                          "سعر بداية (اتركه فارغًا لعرض سعر)",
                          "Starting price (blank for quote)",
                        ),
                        "number",
                      ],
                      [
                        "sort_order",
                        c("ترتيب العرض", "Display order"),
                        "number",
                      ],
                    ].map(([key, label, type]) => (
                      <label key={key} className="block text-sm">
                        <span className="mb-2 block font-semibold">
                          {label}
                        </span>
                        <input
                          disabled={!!editing.is_custom && (key === "price" || key === "plant_count")}
                          required={key !== "price"}
                          type={type}
                          step={
                            key === "price" || key.startsWith("area_")
                              ? "any"
                              : "1"
                          }
                          min={type === "number" ? 0 : undefined}
                          className={input}
                          value={String(
                            editing[key as keyof PlantPackage] ?? "",
                          )}
                          onChange={(e) =>
                            setEditing((p) => ({
                              ...p,
                              [key]:
                                type === "number"
                                  ? e.target.value === "" && key === "price"
                                    ? null
                                    : Number(e.target.value)
                                  : e.target.value,
                            }))
                          }
                        />
                      </label>
                    ))}
                    {[
                      [
                        "description_ar",
                        c("الوصف بالعربية", "Arabic description"),
                      ],
                      [
                        "description_en",
                        c("الوصف بالإنجليزية", "English description"),
                      ],
                      ["care_ar", c("العناية بالعربية", "Care note in Arabic")],
                      [
                        "care_en",
                        c("العناية بالإنجليزية", "Care note in English"),
                      ],
                      [
                        "includes_ar",
                        c(
                          "المحتويات بالعربية (كل بند بسطر)",
                          "Arabic inclusions (one per line)",
                        ),
                      ],
                      [
                        "includes_en",
                        c(
                          "المحتويات بالإنجليزية (كل بند بسطر)",
                          "English inclusions (one per line)",
                        ),
                      ],
                    ].map(([key, label]) => (
                      <label key={key} className="block text-sm">
                        <span className="mb-2 block font-semibold">
                          {label}
                        </span>
                        <textarea
                          rows={3}
                          className={input}
                          value={
                            key.startsWith("includes")
                              ? (
                                  editing[
                                    key as "includes_ar" | "includes_en"
                                  ] || []
                                ).join("\n")
                              : String(editing[key as keyof PlantPackage] || "")
                          }
                          onChange={(e) =>
                            setEditing((p) => ({
                              ...p,
                              [key]: key.startsWith("includes")
                                ? e.target.value.split("\n")
                                : e.target.value,
                            }))
                          }
                        />
                      </label>
                    ))}
                  </div>
                  <div className="my-5 flex flex-wrap gap-4">
                    {BUSINESS_TYPES.map((t) => (
                      <label key={t.value} className="text-sm">
                        <input
                          type="checkbox"
                          checked={
                            editing.business_types?.includes(t.value) || false
                          }
                          onChange={(e) =>
                            setEditing((p) => ({
                              ...p,
                              business_types: e.target.checked
                                ? [...(p?.business_types || []), t.value]
                                : (p?.business_types || []).filter(
                                    (v) => v !== t.value,
                                  ),
                            }))
                          }
                        />{" "}
                        {isRTL ? t.ar : t.en}
                      </label>
                    ))}
                  </div>
                  <div
                    className="rounded-xl border-2 border-dashed p-5"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      void upload(e.dataTransfer.files[0]);
                    }}
                    onPaste={(e) => {
                      const file = Array.from(e.clipboardData.items)
                        .find((i) => i.type.startsWith("image/"))
                        ?.getAsFile();
                      if (file) {
                        e.preventDefault();
                        void upload(file);
                      }
                    }}
                  >
                    <p className="mb-3 text-sm">
                      {c(
                        "اسحب صورة هنا أو الصقها أو اختر ملفًا",
                        "Drag, paste or select a package image",
                      )}
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      onChange={(e) => void upload(e.target.files?.[0])}
                    />
                    {editing.image_url && (
                      <img
                        className="mt-3 h-32 w-48 rounded-xl object-cover"
                        src={editing.image_url}
                        alt="Package preview"
                      />
                    )}
                    <label className="mt-3 block text-sm">
                      {c("أو رابط صورة HTTPS", "Or an HTTPS image URL")}
                      <input
                        className={input}
                        value={editing.image_url || ""}
                        onChange={(e) =>
                          setEditing((p) => ({
                            ...p,
                            image_url: e.target.value,
                          }))
                        }
                      />
                    </label>
                  </div>
                  <div className="my-5 flex flex-wrap gap-5">
                    {[
                      ["is_active", c("نشر الباقة", "Publish package")],
                      ["is_featured", c("باقة مميزة", "Featured package")],
                      ["is_custom", c("باقة مخصصة بدون عدد أو سعر ثابت", "Bespoke package with no fixed count or price")],
                    ].map(([key, label]) => (
                      <label key={key}>
                        <input
                          type="checkbox"
                          checked={!!editing[key as keyof PlantPackage]}
                          onChange={(e) =>
                            setEditing((p) => ({
                              ...p,
                              [key]: e.target.checked,
                              ...(key === "is_custom" ? { plant_count: e.target.checked ? 0 : 5, price: null } : {}),
                            }))
                          }
                        />{" "}
                        {label}
                      </label>
                    ))}
                  </div>
                  <button
                    disabled={saving}
                    className="rounded-xl bg-[#17583a] px-6 py-3 font-semibold text-white disabled:opacity-50"
                  >
                    {saving
                      ? c("جارٍ الحفظ…", "Saving…")
                      : c("حفظ الباقة", "Save package")}
                  </button>
                </form>
              )}
            </>
          )}
          {mode === "enquiries" && (
            <>
              <div className="flex flex-wrap gap-3">
                <input
                  aria-label={c("بحث الطلبات", "Search requests")}
                  placeholder={c(
                    "الاسم، النشاط، الهاتف أو المرجع",
                    "Name, business, phone or reference",
                  )}
                  className={`${input} max-w-md`}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(0);
                  }}
                />
                <select
                  className={`${input} max-w-48`}
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(0);
                  }}
                >
                  <option value="all">{c("كل الحالات", "All statuses")}</option>
                  {STATUS.map((s) => (
                    <option value={s.value} key={s.value}>
                      {isRTL ? s.ar : s.en}
                    </option>
                  ))}
                </select>
                <button
                  className="rounded-xl border bg-white px-4 text-sm"
                  onClick={exportCsv}
                >
                  {c("تصدير CSV", "Export CSV")}
                </button>
              </div>
              <p className="text-xs text-[#5f786c]">
                {c(
                  "يتم عرض آخر ٥٠٠ طلب. فتح واتساب لا يعني أن العميل أرسل الرسالة.",
                  "Showing the latest 500 requests. Opening WhatsApp does not confirm the customer sent the message.",
                )}
              </p>
              {filtered.slice(page * 20, (page + 1) * 20).map((e) => (
                <article
                  key={e.id}
                  className="rounded-2xl border border-[#e4ece7] bg-white p-5"
                >
                  <div className="flex flex-wrap justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold">{e.business_name}</h2>
                      <p className="mt-1 text-sm text-[#5f786c]">
                        {e.contact_name} · <span dir="ltr">{e.phone}</span>
                      </p>
                      <p className="mt-2 text-sm">
                        {isRTL
                          ? e.package_snapshot.name_ar
                          : e.package_snapshot.name_en}{" "}
                        · {e.package_snapshot.is_custom ? c("حسب الاتفاق", "To be agreed") : <>{e.package_snapshot.plant_count} {c("نبات", "plants")}</>}{" "}
                        {e.area !== null && <> · {e.area} m²</>}
                        {e.rooms !== null && <> · {e.rooms} {c("غرف / مساحات", "rooms / zones")}</>}
                      </p>
                      <p className="mt-1 text-sm">{e.city} · {BUSINESS_TYPES.find(t => t.value === e.business_type)?.[isRTL ? "ar" : "en"]} {e.address && `· ${e.address}`}</p>
                      <p className="mt-2 rounded-xl bg-[#e8f3ec] p-3 text-sm">{c("العناية:", "Care:")} {CARE_PLANS.find(p => p.value === e.care_plan)?.[isRTL ? "ar" : "en"] || c("بدون عناية", "No care")}{e.care_plan !== "none" && <> · {c("تبدأ من", "From")} {e.care_price} {c("جنيه سنويًا", "EGP per year")}</>}</p>
                      {e.notes && (
                        <p className="mt-2 text-sm text-[#5f786c]">{e.notes}</p>
                      )}
                      <p className="mt-3 text-xs text-[#5f786c]">
                        {new Date(e.created_at).toLocaleString(
                          isRTL ? "ar-EG" : "en-EG",
                        )}{" "}
                        · {e.id}
                      </p>
                    </div>
                    <a
                      href={`https://wa.me/${e.phone}?text=${encodeURIComponent(c(`أهلًا ${e.contact_name}، بخصوص طلب جنان ${e.id}`, `Hello ${e.contact_name}, about your Genaan request ${e.id}`))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-fit rounded-xl bg-[#e8f3ec] px-4 py-3 text-sm font-semibold text-[#17583a]"
                    >
                      {c("تواصل واتساب", "Contact on WhatsApp")}
                    </a>
                  </div>
                  <form
                    className="mt-4 flex flex-wrap gap-3 border-t pt-4"
                    onSubmit={(f) => {
                      f.preventDefault();
                      const fd = new FormData(f.currentTarget);
                      void save({
                        kind: "enquiry",
                        id: e.id,
                        status: fd.get("status"),
                        admin_notes: fd.get("notes"),
                      });
                    }}
                  >
                    <select
                      aria-label="Status"
                      name="status"
                      defaultValue={e.status}
                      className={`${input} max-w-48`}
                    >
                      {STATUS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {isRTL ? s.ar : s.en}
                        </option>
                      ))}
                    </select>
                    <input
                      name="notes"
                      aria-label="Internal notes"
                      defaultValue={e.admin_notes || ""}
                      className={`${input} flex-1 min-w-40`}
                      placeholder={c("ملاحظات داخلية", "Internal notes")}
                    />
                    <button
                      disabled={saving}
                      className="rounded-xl bg-[#17583a] px-5 text-sm text-white disabled:opacity-50"
                    >
                      {c("حفظ", "Save")}
                    </button>
                  </form>
                </article>
              ))}
              {!filtered.length && (
                <p className="rounded-2xl border border-dashed p-10 text-center text-[#5f786c]">
                  {c("لا توجد طلبات مطابقة", "No matching requests")}
                </p>
              )}
              {filtered.length > 20 && (
                <div className="flex items-center justify-center gap-4">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                    className="rounded-xl border px-4 py-2 disabled:opacity-40"
                  >
                    {c("السابق", "Previous")}
                  </button>
                  <span>
                    {page + 1} / {Math.ceil(filtered.length / 20)}
                  </span>
                  <button
                    disabled={(page + 1) * 20 >= filtered.length}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-xl border px-4 py-2 disabled:opacity-40"
                  >
                    {c("التالي", "Next")}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
