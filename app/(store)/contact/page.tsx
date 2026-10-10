"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "../../lib/i18n-context";
import { normalizeWhatsApp } from "../../lib/commercial";
export default function ContactPage() {
  const { isRTL } = useI18n();
  const c = (ar: string, en: string) => (isRTL ? ar : en);
  const [settings, setSettings] = useState({
      whatsapp: "",
      email: "",
      phone: "",
    }),
    [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState({
    name: "",
    business: "",
    area: "",
    notes: "",
  });
  useEffect(() => {
    fetch("/api/business")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);
  const phone = normalizeWhatsApp(settings.whatsapp);
  const message = isRTL
    ? `أهلًا جنان، أحتاج باقة نباتات مخصصة.\nالاسم: ${form.name}\nالنشاط: ${form.business}\nالمساحة: ${form.area} م²\nالتفاصيل: ${form.notes}`
    : `Hello Genaan, I would like a custom plant package.\nName: ${form.name}\nBusiness: ${form.business}\nArea: ${form.area} m²\nDetails: ${form.notes}`;
  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="mx-auto max-w-[1100px] px-5 py-16"
    >
      <p className="text-xs tracking-widest text-[#5f786c]">
        GENAAN / LET'S TALK
      </p>
      <h1 className="mt-4 text-4xl font-bold md:text-6xl">
        {c("كل مساحة لها حكاية.", "Every space has a story.")}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-8 text-[#5f786c]">
        {c(
          "احكي لنا عن نشاطك والإضاءة والمساحة. نناقش معك الباقة وتوزيع النباتات والأصص وخيارات العناية على واتساب.",
          "Tell us about your business, light and space. We will discuss your package, plant placement, pots and care options on WhatsApp.",
        )}
      </p>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="space-y-5 rounded-3xl bg-[#0d3a24] p-8 text-white">
          <h2 className="text-2xl font-bold">
            {c("تواصل مع جنان", "Contact Genaan")}
          </h2>
          {!loaded && (
            <p>{c("جارٍ تحميل بيانات التواصل…", "Loading contact details…")}</p>
          )}
          {phone && (
            <a
              className="block rounded-xl bg-white/10 p-4"
              href={`https://wa.me/${phone}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp{" "}
              <span className="ms-2" dir="ltr">
                +{phone}
              </span>{" "}
              ↗
            </a>
          )}
          {settings.email && (
            <a
              className="block break-all rounded-xl bg-white/10 p-4"
              href={`mailto:${settings.email}`}
            >
              {settings.email}
            </a>
          )}
          {settings.phone && (
            <a
              className="block rounded-xl bg-white/10 p-4"
              dir="ltr"
              href={`tel:${settings.phone}`}
            >
              {settings.phone}
            </a>
          )}
          <p className="text-sm leading-7 text-white/75">
            {c(
              "التكلفة والمواعيد والتوصيل والتركيب تتأكد في عرض السعر قبل أي اتفاق.",
              "Cost, timing, delivery and installation are agreed in the quotation before you commit.",
            )}
          </p>
          <Link className="inline-block underline" href="/packages">
            {c("استعرض الباقات الجاهزة", "Explore our packages")}
          </Link>
        </div>
        <form
          className="space-y-4 rounded-3xl border border-[#d4ded7] bg-white p-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (phone)
              window.open(
                `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
                "_blank",
                "noopener,noreferrer",
              );
          }}
        >
          {[
            ["name", c("الاسم", "Your name")],
            ["business", c("النشاط والمدينة", "Business and city")],
            ["area", c("المساحة بالمتر المربع", "Area in m²")],
            [
              "notes",
              c("الإضاءة والتفاصيل المطلوبة", "Light and requirements"),
            ],
          ].map(([key, label]) => (
            <label key={key} className="block text-sm">
              <span className="mb-2 block font-semibold">{label}</span>
              <input
                required
                type={key === "area" ? "number" : "text"}
                min={key === "area" ? 1 : undefined}
                maxLength={500}
                className="w-full rounded-xl border border-[#d4ded7] px-4 py-3"
                value={form[key as keyof typeof form]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [key]: e.target.value }))
                }
              />
            </label>
          ))}
          <p className="text-xs leading-6 text-[#5f786c]">
            {c(
              "يفتح الزر واتساب برسالة جاهزة، وأنت تختار إرسالها. هذا النموذج لا يسجل طلبًا في الموقع.",
              "The button opens a WhatsApp draft for you to send. This form does not record a website order.",
            )}
          </p>
          <button
            disabled={!phone}
            className="w-full rounded-xl bg-[#17583a] px-5 py-4 font-semibold text-white disabled:opacity-50"
          >
            {phone
              ? c(
                  "ناقش باقة مخصصة على واتساب",
                  "Discuss a custom package on WhatsApp",
                )
              : c(
                  "واتساب غير متاح مؤقتًا",
                  "WhatsApp is temporarily unavailable",
                )}
          </button>
        </form>
      </div>
    </section>
  );
}
