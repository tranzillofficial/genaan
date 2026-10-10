"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "../../lib/i18n-context";
import { normalizeWhatsApp, type PlantPackage, type BusinessSettings } from "../../lib/commercial";
import { QuoteRequestForm } from "../../components/commercial/QuoteRequestForm";
export default function ContactPage() {
  const { isRTL } = useI18n();
  const c = (ar: string, en: string) => isRTL ? ar : en;
  const [data, setData] = useState<{ settings: BusinessSettings; packages: PlantPackage[]; available: boolean } | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { fetch("/api/business").then(r => r.json()).then(setData).catch(() => {}).finally(() => setLoaded(true)); }, []);
  const phone = normalizeWhatsApp(data?.settings.whatsapp || "");
  const custom = data?.packages.find(p => p.is_custom);
  return <section dir={isRTL ? "rtl" : "ltr"} className="mx-auto max-w-[1100px] px-5 py-16">
    <p className="text-xs tracking-widest text-[#5f786c]">{c("تواصل معنا", "CONTACT US")}</p>
    <h1 className="mt-4 text-4xl font-bold md:text-6xl">{c("احكي لنا عن مكانك.", "Tell us about your space.")}</h1>
    <p className="mt-5 max-w-2xl text-base leading-8 text-[#5f786c]">{c("احكي لنا عن مدينتك ونشاطك. المساحة اختيارية، وممكن تكتفي بعدد الغرف. املأ الفورم وفريق جنان هيتواصل معاك لمناقشة النباتات والنخيل وتوزيعها وخطة العناية السنوية.", "Share a few details about your business and what you have in mind. We will call you to discuss the right plants, layout and care for your space. You can leave the area blank if you are unsure.")}</p>
    <div className="mt-10 grid items-start gap-8 md:grid-cols-2">
      <div className="space-y-5 rounded-3xl bg-[#0d3a24] p-8 text-white">
        <h2 className="text-2xl font-bold">{c("تواصل مع جنان", "Contact Genaan")}</h2>
        {!loaded && <p>{c("جارٍ تحميل بيانات التواصل…", "Loading contact details…")}</p>}
        {phone && <a className="block rounded-xl bg-white/10 p-4" href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer">WhatsApp <span className="ms-2" dir="ltr">+{phone}</span> ↗</a>}
        {data?.settings.email && <a className="block break-all rounded-xl bg-white/10 p-4" href={`mailto:${data.settings.email}`}>{data.settings.email}</a>}
        {data?.settings.phone && <a className="block rounded-xl bg-white/10 p-4" dir="ltr" href={`tel:${data.settings.phone}`}>{data.settings.phone}</a>}
        <p className="text-sm leading-7 text-white/75">{c("الباقة المخصصة بدون سعر ثابت. نتفق على العدد والخامات والتوصيل والعناية قبل أي تنفيذ. لا يتم الدفع من الموقع.", "We will prepare a quote based on your plants, pots and layout. Delivery and optional care are priced separately. There is no payment at this stage.")}</p>
        <Link className="inline-block underline" href="/packages">{c("استعرض الباقات الجاهزة", "Explore our packages")}</Link>
      </div>
      <div className="rounded-3xl border border-[#d4ded7] bg-white p-8">
        <h2 className="mb-5 text-2xl font-bold">{c("باقة على مقاسك", "Request a custom package")}</h2>
        {custom && data ? <QuoteRequestForm selected={custom} settings={data.settings} available={data.available}/> : <p className="text-sm">{loaded ? c("استخدم بيانات التواصل لمناقشة احتياجك.", "Use the contact details to discuss your needs.") : c("جارٍ التحميل…", "Loading…")}</p>}
      </div>
    </div>
  </section>;
}
