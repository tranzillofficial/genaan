"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useI18n } from "../../lib/i18n-context";
import { BUSINESS_TYPES, CARE_PLANS, carePrice, type PlantPackage, type BusinessSettings } from "../../lib/commercial";
export function QuoteRequestForm({ selected, settings, available = true, initialBusinessType }: {
  selected: PlantPackage; settings: BusinessSettings; available?: boolean; initialBusinessType?: string;
}) {
  const { isRTL, lang } = useI18n();
  const c = (ar: string, en: string) => isRTL ? ar : en;
  const [form, setForm] = useState({ name: "", business_name: "", business_type: initialBusinessType || selected.business_types[0] || "other", phone: "", city: "", area: "", rooms: "", address: "", notes: "", website: "", care_plan: "none" });
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const [result, setResult] = useState<{ reference: string } | null>(null);
  const requestId = useRef("");
  const field = "w-full rounded-xl border border-[#d4ded7] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#17583a]";
  const annual = carePrice(settings, form.care_plan);
  const money = (n: number) => `${n.toLocaleString(isRTL ? "ar-EG" : "en-EG")} ${c("جنيه", "EGP")}`;
  async function submit(e: React.FormEvent) {
    e.preventDefault(); if (busy) return; setBusy(true); setError("");
    if (!requestId.current) requestId.current = crypto.randomUUID();
    try {
      const response = await fetch("/api/package-enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, package_id: selected.id, request_id: requestId.current, lang }) });
      const data = await response.json();
      if (!response.ok) {
        const message = response.status === 400
          ? c("راجع اسم النشاط والمدينة ورقم الهاتف وحاول مرة أخرى.", "Check your business name, city and phone number, then try again.")
          : response.status === 429
            ? c("تم إرسال طلبات كثيرة. حاول مرة أخرى لاحقًا.", "Too many requests. Please try again later.")
            : c("تعذر إرسال طلبك. حاول مرة أخرى.", "We could not send your request. Please try again.");
        throw new Error(message);
      }
      setResult(data);
    } catch (e) { setError(e instanceof Error ? e.message : c("تعذر حفظ الطلب. حاول مرة أخرى.", "Could not save your request. Please retry.")); }
    finally { setBusy(false); }
  }
  if (result) return <div className="space-y-5" role="status" aria-live="polite">
    <div className="rounded-2xl bg-[#e8f3ec] p-6">
      <h3 className="text-xl font-bold">{c("تم استلام طلبك بنجاح", "Thank you for your request")}</h3>
      <p className="mt-3 text-sm leading-7">{c("فريق جنان هيتواصل معاك على رقم الهاتف اللي سجلته لمناقشة التفاصيل وتجهيز عرض السعر.", "We will call you on the number you provided to discuss your space and prepare a quote.")}</p>
      <p className="mt-3 text-sm font-semibold">{c("الباقة المختارة:", "Selected package:")} {isRTL ? selected.name_ar : selected.name_en}</p>
    </div>
    <p className="break-all text-xs">{c("مرجع الطلب:", "Request reference:")} {result.reference}</p>
  </div>;
  if (!available) return <p className="text-sm leading-7">{c("طلبات عروض الأسعار غير متاحة مؤقتًا.", "Quotation requests are temporarily unavailable.")} {settings.email && <a className="underline" href={`mailto:${settings.email}`}>{settings.email}</a>}</p>;
  return <form onSubmit={submit} className="space-y-4">
    <p className="rounded-xl border border-[#d4ded7] bg-white p-4 text-sm"><span className="block text-xs text-[#5f786c]">{c("الباقة المختارة", "Selected package")}</span><strong>{isRTL ? selected.name_ar : selected.name_en}</strong></p>
    <p className="rounded-xl bg-[#e8f3ec] p-4 text-sm font-semibold">{selected.price !== null ? `${c("سعر الباقة يبدأ من", "Package from")} ${money(selected.price)}` : c("باقة مخصصة حسب تفاصيل مكانك", "A custom package for your space")}<span className="mt-1 block text-xs font-normal">{c("التوصيل وخدمة العناية منفصلان.", "Delivery and care are charged separately.")}</span></p>
    {[
      ["name", c("اسمك", "Your name"), "text", true],
      ["business_name", c("اسم النشاط", "Business name"), "text", true],
      ["phone", c("رقم هاتفك", "Phone number"), "tel", true],
      ["city", c("المدينة", "City"), "text", true],
      ["area", c("المساحة بالمتر المربع (اختياري)", "Area in m² (optional)"), "number", false],
      ["rooms", c("عدد الغرف أو المساحات (اختياري)", "Number of rooms or spaces (optional)"), "number", false],
      ["address", c("العنوان التفصيلي (اختياري)", "Address (optional)"), "text", false],
    ].map(([key, label, type, required]) => <label key={String(key)} className="block text-sm"><span className="mb-1.5 block font-semibold">{label}</span>
      <input required={Boolean(required)} type={String(type)} min={type === "number" ? 1 : undefined} max={key === "rooms" ? 10000 : type === "number" ? 100000 : undefined} step={key === "area" ? "any" : key === "rooms" ? 1 : undefined} maxLength={key === "address" ? 500 : key === "city" ? 120 : 160} value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [String(key)]: e.target.value }))} className={field}/>
    </label>)}
    <p className="text-xs leading-6 text-[#5f786c]">{c("مش عارف المساحة؟ اكتب عدد الغرف، أو سيب الاتنين وهنناقش التفاصيل معاك.", "Unsure of the area? Enter the room count, or leave both blank and we will discuss the details with you.")}</p>
    <label className="block text-sm"><span className="mb-1.5 block font-semibold">{c("نوع النشاط", "Business type")}</span><select className={field} value={form.business_type} onChange={e => setForm(f => ({ ...f, business_type: e.target.value }))}>{BUSINESS_TYPES.map(t => <option key={t.value} value={t.value}>{isRTL ? t.ar : t.en}</option>)}</select></label>
    <fieldset className="space-y-3 rounded-2xl border border-[#d4ded7] p-4"><legend className="px-2 text-sm font-bold">{c("العناية والمتابعة السنوية (اختياري)", "Annual plant care (optional)")}</legend>
      {CARE_PLANS.map(plan => <label key={plan.value} className={`flex cursor-pointer gap-3 rounded-xl border p-3 text-sm ${form.care_plan === plan.value ? "border-[#17583a] bg-[#e8f3ec]" : "border-[#e4ece7] bg-white"}`}><input type="radio" name={`care-${selected.id}`} value={plan.value} checked={form.care_plan === plan.value} onChange={() => setForm(f => ({ ...f, care_plan: plan.value }))}/><span>{isRTL ? plan.ar : plan.en}{plan.visits > 0 && <span className="mt-1 block font-semibold">{c("تبدأ من", "From")} {money(carePrice(settings, plan.value))} {c("سنويًا", "per year")}</span>}</span></label>)}
      <p className="text-xs leading-6 text-[#5f786c]">{c("فحص النباتات والتربة، تقليم وتنظيف وتقييم التغذية حسب الحاجة، مع إرشادات بين الزيارات. السعر السنوي يُؤكد حسب عدد النباتات والمدينة؛ النقل والمواد الإضافية والاستبدال تُسعّر منفصلًا. الري المعتاد مسؤولية العميل.", "Visits include plant and soil checks, pruning, cleaning and advice on feeding. We confirm the annual fee based on your plants and location. Travel, extra materials and replacements cost extra. You will need to water and care for your plants between visits.")}</p>
    </fieldset>
    {selected.price !== null && <p className="text-sm font-semibold">{c("الإجمالي المبدئي", "Estimated total")}: {money(selected.price + annual)} {annual > 0 && c("(الباقة وسنة عناية)", "(package and one year of care)")}<span className="block text-xs font-normal text-[#5f786c]">{c("غير شامل التوصيل؛ المبلغ النهائي يتأكد في عرض السعر.", "Delivery costs extra. Your quote will confirm the final price.")}</span></p>}
    <label className="block text-sm"><span className="mb-1.5 block font-semibold">{c("الإضاءة وملاحظاتك (اختياري)", "Lighting and notes (optional)")}</span><textarea rows={3} maxLength={1500} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={field}/></label>
    <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))}/>
    <p className="text-xs leading-6 text-[#5f786c]">{c("بإرسال الطلب توافق على حفظ بياناتك للتواصل بشأن عرض السعر. فريق جنان هيتواصل معاك على رقم الهاتف اللي سجلته.", "By sending this request, you agree that we may save your details and contact you about your quote.")} <Link className="underline" href="/privacy-policy">{c("سياسة الخصوصية", "Privacy policy")}</Link></p>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <button disabled={busy} className="w-full rounded-xl bg-[#17583a] py-4 text-sm font-bold text-white disabled:opacity-50">{busy ? c("جارٍ حفظ الطلب…", "Sending…") : c("إرسال طلب عرض السعر", "Send request")}</button>
  </form>;
}
