"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { QuoteRequestForm } from "./QuoteRequestForm";
import { useI18n } from "../../lib/i18n-context";
import {
  BUSINESS_TYPES,
  CURATED_PLANTS,
  type PlantPackage,
  type BusinessSettings,
} from "../../lib/commercial";

export function CommercialExperience({
  packages,
  settings,
  hero = false,
  available = true,
}: {
  packages: PlantPackage[];
  settings: BusinessSettings;
  hero?: boolean;
  available?: boolean;
}) {
  const { isRTL } = useI18n();
  const copy = (ar: string, en: string) => (isRTL ? ar : en);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<PlantPackage | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (selected) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [selected]);
  const choose = (p: PlantPackage) => setSelected(p);
  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {hero && (
        <section
          className="relative flex min-h-[88svh] items-center bg-[#0d3a24] text-white"
          style={{
            backgroundImage:
              "linear-gradient(90deg,rgba(10,37,24,.88),rgba(10,37,24,.4)),url('/assets/hero_image.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="mx-auto w-full max-w-[1200px] px-5 pb-16 pt-32 md:px-8">
            <span className="inline-block rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs tracking-wide">
              {copy(
                "نباتات لمساحات العمل والضيافة",
                "GREENERY FOR BUSINESS & HOSPITALITY",
              )}
            </span>
            <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-[1.15] tracking-tight md:text-7xl">
              {copy("مساحة خضراء.", "A greener space.")}
              <br />
              <span className="text-[#b4d9c5]">
                {copy("انطباع يدوم.", "A lasting impression.")}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/85 md:text-lg">
              {copy(
                "باقات نباتات وأصص متناسقة للعيادات والمطاعم والفنادق والسوبر ماركت. نبدأ بمساحتك، ونختار التفاصيل المناسبة لها.",
                "Thoughtful plant and pot packages for clinics, restaurants, hotels and supermarkets. Start with your space. Let the greenery bring it to life.",
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#packages"
                className="rounded-xl bg-[#b4d9c5] px-7 py-4 text-sm font-bold text-[#0d3a24] hover:bg-white"
              >
                {copy("اكتشف الباقات", "Explore packages")}{" "}
                <span aria-hidden="true">↗</span>
              </a>
              <Link
                href="/contact"
                className="rounded-xl border border-white/40 px-7 py-4 text-sm font-semibold hover:bg-white/10"
              >
                {copy("ناقش مساحتك معنا", "Discuss your space")}
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-xs text-white/80">
              <span>
                {copy("٥ باقات + باقة على مقاسك", "5 packages + a bespoke option")}
              </span>
              <span>
                {copy(
                  "نباتات أرضية ونخيل زينة",
                  "Floor plants and ornamental palms",
                )}
              </span>
              <span>
                {copy("التفاصيل عبر واتساب", "Details confirmed on WhatsApp")}
              </span>
            </div>
          </div>
        </section>
      )}
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <section id="packages" className="scroll-mt-24 py-16 md:py-24">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold tracking-[.2em] text-[#5f786c]">
                {copy(
                  "اختيار مدروس لكل مساحة",
                  "A CONSIDERED CHOICE FOR EVERY SPACE",
                )}
              </p>
              <h2 className="mt-3 text-3xl font-bold text-[#0d3a24] md:text-5xl">
                {copy("اختر باقة تناسب نشاطك", "Find your green fit")}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#5f786c]">
              {copy(
                "المساحات استرشادية، وليست قياسًا لتغطية الأرضية. العدد والتوزيع النهائي يتحددان حسب الإضاءة والأثاث والحركة داخل المكان.",
                "Areas are planning guides, not floor coverage. Final placement depends on light, furniture and the way people move through your space.",
              )}
            </p>
          </div>
          <div
            className="my-8 flex flex-wrap gap-2"
            role="group"
            aria-label={copy("نوع النشاط", "Business type")}
          >
            {[
              { value: "all", ar: "كل الأنشطة", en: "All spaces" },
              ...BUSINESS_TYPES.filter((t) => t.value !== "other"),
            ].map((t) => (
              <button
                key={t.value}
                onClick={() => setFilter(t.value)}
                aria-pressed={filter === t.value}
                className={`rounded-full border px-5 py-2.5 text-sm transition-colors ${filter === t.value ? "border-[#0d3a24] bg-[#0d3a24] text-white" : "border-[#d4ded7] bg-white text-[#5f786c] hover:border-[#17583a]"}`}
              >
                {isRTL ? t.ar : t.en}
              </button>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages
              .filter(
                (p) =>
                  filter === "all" ||
                  p.business_types.includes(
                    filter as (typeof p.business_types)[number],
                  ),
              )
              .map((p, index) => (
                <article
                  key={p.id}
                  className={`group overflow-hidden rounded-3xl border bg-white ${p.is_featured ? "border-[#17583a] shadow-lg" : "border-[#e4ece7]"}`}
                >
                  <div className="relative h-48 overflow-hidden bg-[#e8f3ec]">
                    <img
                      src={p.image_url || "/assets/hero_image.png"}
                      alt={isRTL ? p.name_ar : p.name_en}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{
                        objectPosition: `${20 + (index % 5) * 15}% center`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d3a24]/40 to-transparent" />
                    {p.is_featured && (
                      <span className="absolute start-4 top-4 rounded-full bg-[#0d3a24] px-3 py-1.5 text-xs font-semibold text-white">
                        {copy("اختيار جنان", "Genaan's pick")}
                      </span>
                    )}
                    <span className="absolute bottom-4 start-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0d3a24]">
                      {p.is_custom ? copy("حسب مساحتك", "Tailored to your space") : <>{p.area_min}–{p.area_max} {copy("م²", "m²")}</>}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-[#0d3a24]">
                      {isRTL ? p.name_ar : p.name_en}
                    </h3>
                    <p className="mt-3 min-h-14 text-sm leading-7 text-[#5f786c]">
                      {isRTL ? p.description_ar : p.description_en}
                    </p>
                    <div className="my-5 flex items-baseline gap-2">
                      <span className="text-4xl font-semibold text-[#17583a]">
                        {p.is_custom ? "↗" : p.plant_count}
                      </span>
                      <span className="text-sm text-[#5f786c]">
                        {p.is_custom ? copy("عدد وتوزيع حسب احتياجك", "Quantities and layout to suit you") : copy("نباتًا مع أصصها", "plants with pots")}
                      </span>
                    </div>
                    <ul className="space-y-2 border-t border-[#e4ece7] pt-4">
                      {(isRTL ? p.includes_ar : p.includes_en).map((s, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm text-[#163e2b]"
                        >
                          <span className="text-[#4a9c72]" aria-hidden="true">
                            ✓
                          </span>
                          {s}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-xs leading-6 text-[#5f786c]">
                      {isRTL ? p.care_ar : p.care_en}
                    </p>
                    <div className="mt-5 border-t border-[#e4ece7] pt-4">
                      <p className="mb-4 text-sm font-semibold text-[#0d3a24]">
                        {p.price !== null
                          ? `${copy("تبدأ من", "From")} ${p.price.toLocaleString(isRTL ? "ar-EG" : "en-EG")} ${copy("جنيه", "EGP")}`
                          : copy(
                              "عرض سعر حسب تفاصيل مساحتك",
                              "Quoted for your space",
                            )}
                      </p>
                      <button
                        onClick={() => choose(p)}
                        className="w-full rounded-xl bg-[#0d3a24] px-5 py-3.5 text-sm font-bold text-white hover:bg-[#17583a]"
                      >
                        {copy("اطلب عرض سعر", "Request a quote")}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
          </div>
          {packages.filter(
            (p) =>
              filter === "all" ||
              p.business_types.includes(
                filter as (typeof p.business_types)[number],
              ),
          ).length === 0 && (
            <p className="rounded-2xl border border-dashed p-10 text-center text-[#5f786c]">
              {copy(
                "لا توجد باقات لهذا النشاط حاليًا. تواصل معنا لتجهيز باقة خاصة.",
                "No packages for this activity yet. Contact us for a custom proposal.",
              )}
            </p>
          )}
          <p className="mt-6 text-xs leading-6 text-[#5f786c]">
            {copy(
              "الصور وتوزيع الأنواع توضيحيان. أسعار الباقات تبدأ من المبالغ المعروضة وتشمل الأصص والتجهيز الأولي. التوصيل وخدمة العناية السنوية منفصلان؛ العدد والحجم والخامات تتأكد في عرض السعر، ولا يتم الدفع من الموقع.",
              "Images and plant mixes are illustrative. Starting package prices include pots and initial setup. Delivery and annual care are separate; quantities, sizes and materials are confirmed in your quote. No online payment is collected.",
            )}
          </p>
        </section>
        <section className="pb-16">
          <h2 className="text-3xl font-bold">{copy("نباتات مختارة ونخيل بحضور مميز", "Considered plants and statement palms")}</h2>
          <p className="my-4 max-w-3xl text-sm leading-7 text-[#5f786c]">{copy("١٢ نوع نباتات + ٣ أنواع نخيل. نركز على النباتات الأرضية وشجر الزينة مثل الشيفليرا ارتفاع متر، ونكملها بأنواع تناسب إضاءة المكان. الأحجام النهائية والتوافر يتأكدان قبل التنفيذ.", "12 plant varieties plus 3 palms. Floor plants and ornamental trees such as one-metre schefflera lead the layout, complemented by varieties suited to your light. Final sizes and availability are confirmed before fulfilment.")}</p>
          <div className="flex flex-wrap gap-2">{CURATED_PLANTS.map(p => <span key={p.en} className="rounded-full border border-[#d4ded7] bg-white px-4 py-2 text-sm text-[#17583a]">{isRTL ? p.ar : p.en}</span>)}</div>
          <p className="mt-4 text-xs text-[#5f786c]">{copy("نحدد الموقع المناسب لكل نوع حسب الضوء والتهوية؛ زيارات العناية لا تغني عن الري والمتابعة المعتادة بين الزيارات.", "Placement is matched to light and airflow. Care visits do not replace routine watering and attention between visits.")}</p>
        </section>
        <section className="rounded-3xl bg-[#e8f3ec] p-8 md:p-12">
          <p className="text-xs font-bold tracking-widest text-[#5f786c]">
            {copy("من الفكرة للمكان", "FROM IDEA TO YOUR SPACE")}
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#0d3a24]">
            {copy(
              "ثلاث خطوات لبداية خضراء",
              "Three steps to a greener beginning",
            )}
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              [
                "01",
                copy("اختار نقطة البداية", "Choose your starting point"),
                copy(
                  "حدد المدينة والنشاط، واختار باقتك والعناية المناسبة. عدد الغرف يكفي لو مش عارف المساحة.",
                  "Tell us your city and business, choose a package and care plan. Room count is enough if you do not know the area.",
                ),
              ],
              [
                "02",
                copy("نتكلم عن التفاصيل", "Make it personal"),
                copy(
                  "شارك صور المكان والإضاءة على واتساب لتحديد الأنواع والتوزيع والتكلفة.",
                  "Share photos and lighting on WhatsApp to agree varieties, placement and cost.",
                ),
              ],
              [
                "03",
                copy("أكد تجهيز مساحتك", "Confirm your plan"),
                copy(
                  "نثبت عرض السعر ومواعيد التوصيل وخيارات التركيب والعناية قبل التنفيذ.",
                  "Agree the quotation, delivery timing, installation and care before fulfilment.",
                ),
              ],
            ].map(([n, title, desc]) => (
              <div key={n}>
                <span className="text-3xl font-light text-[#4a9c72]">{n}</span>
                <h3 className="mb-2 mt-4 text-lg font-bold">{title}</h3>
                <p className="text-sm leading-7 text-[#5f786c]">{desc}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold">
            {copy(
              "مساحتك محتاجة حل مختلف؟",
              "Need something beyond a package?",
            )}
          </h2>
          <p className="mx-auto my-4 max-w-xl text-sm leading-7 text-[#5f786c]">
            {copy(
              "أكثر من ٣٠٠ م²، فروع متعددة أو تصميم خاص؟ نبدأ بتفاصيل المكان ونجهز اقتراحًا مناسبًا.",
              "More than 300 m², several branches or a bespoke layout? Start with your space and we will shape a proposal around it.",
            )}
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-xl border border-[#17583a] px-6 py-3 text-sm font-bold text-[#17583a]"
          >
            {copy("تواصل لتجهيز باقة مخصصة", "Discuss a custom package")}
          </Link>
        </section>
      </div>
      <dialog
        ref={dialogRef}
        onCancel={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
        className="m-auto max-h-[90svh] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto rounded-3xl bg-[#f4f5f1] p-6 text-[#0d3a24] shadow-2xl backdrop:bg-black/50 md:p-8"
      >
        {selected && (
          <>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-[#5f786c]">
                  {copy("طلب عرض سعر", "Quotation request")}
                </p>
                <h2 className="mt-1 text-2xl font-bold">
                  {isRTL ? selected.name_ar : selected.name_en}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-full border px-3 py-1.5"
                aria-label={copy("إغلاق", "Close")}
              >
                ×
              </button>
            </div>
            <QuoteRequestForm key={selected.id} selected={selected} settings={settings} available={available} initialBusinessType={filter !== "all" ? filter : undefined}/>

          </>
        )}
      </dialog>
    </div>
  );
}
