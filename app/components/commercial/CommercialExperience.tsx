"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PlantGallery } from "./PlantGallery";
import { QuoteRequestForm } from "./QuoteRequestForm";
import { useI18n } from "../../lib/i18n-context";
import {
  type PlantPackage,
  type PlantVariety,
  type BusinessSettings,
} from "../../lib/commercial";

export function CommercialExperience({
  packages,
  plants,
  settings,
  hero = false,
  available = true,
}: {
  packages: PlantPackage[];
  plants: PlantVariety[];
  settings: BusinessSettings;
  hero?: boolean;
  available?: boolean;
}) {
  const { isRTL } = useI18n();
  const copy = (ar: string, en: string) => (isRTL ? ar : en);
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
                "PLANTS FOR BUSINESS SPACES",
              )}
            </span>
            <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-[1.15] tracking-tight md:text-7xl">
              {copy("نباتات تناسب نشاطك.", "Plants for your business.")}
              <br />
              <span className="text-[#b4d9c5]">
                {copy("وتكمل جمال مكانك.", "Chosen for your space.")}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/85 md:text-lg">
              {copy(
                "نباتات وأصص متناسقة للعيادات والمطاعم والفنادق والسوبر ماركت والمكاتب في مصر. نساعدك تختار النباتات المناسبة ونرتبها بما يناسب مكانك.",
                "Plants and matching pots for clinics, restaurants, hotels, supermarkets and offices in Egypt. We help you choose the right plants and arrange them around your space.",
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
                {copy("خمس باقات وباقة على مقاسك", "Five packages and a custom option")}
              </span>
              <span>
                {copy(
                  "نباتات أرضية ونخيل زينة",
                  "Large plants and palms",
                )}
              </span>
              <span>
                {copy("نستلم طلبك ونتواصل معك", "Send your request and we will contact you")}
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
                  "باقات النباتات",
                  "OUR PLANT PACKAGES",
                )}
              </p>
              <h2 className="mt-3 text-3xl font-bold text-[#0d3a24] md:text-5xl">
                {copy("اختر باقة تناسب نشاطك", "Choose a package for your space")}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#5f786c]">
              {copy(
                "المساحات استرشادية، وليست قياسًا لتغطية الأرضية. العدد والتوزيع النهائي يتحددان حسب الإضاءة والأثاث والحركة داخل المكان.",
                "Use the suggested area to find a starting point. We will help you choose a layout that suits your lighting, furniture and daily use.",
              )}
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((p, index) => (
                <article
                  key={p.id}
                  className={`group flex flex-col overflow-hidden rounded-3xl border bg-white ${p.is_featured ? "border-[#17583a] shadow-lg" : "border-[#e4ece7]"}`}
                >
                  <div className="relative h-48 shrink-0 overflow-hidden bg-[#e8f3ec]">
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
                      {p.is_custom ? copy("حسب مساحتك", "Tailored to your space") : <>{p.area_min} {copy("إلى", "to")} {p.area_max} {copy("م²", "m²")}</>}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
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
                        {p.is_custom ? copy("عدد وتوزيع حسب احتياجك", "Plant count and layout agreed with you") : copy("نباتًا مع أصصها", "plants with pots")}
                      </span>
                    </div>
                    <ul className="space-y-2 pt-4">
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
                    <p className="mb-5 mt-4 text-xs leading-6 text-[#5f786c]">
                      {isRTL ? p.care_ar : p.care_en}
                    </p>
                    <div className="mt-auto pt-4">
                      <p className="mb-4 text-sm font-semibold text-[#0d3a24]">
                        {p.price !== null
                          ? `${copy("تبدأ من", "From")} ${p.price.toLocaleString(isRTL ? "ar-EG" : "en-EG")} ${copy("جنيه", "EGP")}`
                          : copy(
                              "عرض سعر حسب تفاصيل مساحتك",
                              "Price agreed after we discuss your space",
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
          {packages.length === 0 && (
            <p className="rounded-2xl border border-dashed p-10 text-center text-[#5f786c]">
              {copy(
                "الباقات قيد التحديث. تواصل معنا لمناقشة احتياجات مكانك.",
                "Our packages are being updated. Contact us to discuss your space.",
              )}
            </p>
          )}
          <p className="mt-6 text-xs leading-6 text-[#5f786c]">
            {copy(
              "الصور وتوزيع الأنواع توضيحيان. أسعار الباقات تبدأ من المبالغ المعروضة وتشمل الأصص والتجهيز الأولي. التوصيل وخدمة العناية السنوية منفصلان؛ العدد والحجم والخامات تتأكد في عرض السعر، ولا يتم الدفع من الموقع.",
              "Package prices include pots and initial setup. Delivery and optional annual care cost extra. Photos show examples of the style. Your quote will confirm the plants, sizes, pots and final price.",
            )}
          </p>
        </section>
        <section className="pb-16">
          <h2 className="text-3xl font-bold">{copy("اكتشف النباتات والنخيل", "Explore our plants and palms")}</h2>
          <p className="my-4 max-w-3xl text-sm leading-7 text-[#5f786c]">{plants.length > 0 && <span>{copy(`${plants.filter(p => p.category === "plant").length} نوع نباتات و${plants.filter(p => p.category === "palm").length} أنواع نخيل. `, `${plants.filter(p => p.category === "plant").length} plant varieties and ${plants.filter(p => p.category === "palm").length} palm varieties. `)}</span>}{copy("نختار النباتات الأرضية وشجر الزينة والنخيل حسب إضاءة المكان وتوزيعه. الأحجام النهائية والتوافر يتأكدان قبل التنفيذ.", "Choose from large plants, ornamental trees and palms. We will confirm the right sizes and available options when we discuss your space.")}</p>
          <PlantGallery plants={plants} />
          <p className="mt-4 text-xs text-[#5f786c]">{copy("نساعدك تختار المكان المناسب لكل نبات ونوضح لك طريقة العناية به.", "We help you find a suitable spot for each plant and explain how to look after it.")}</p>
        </section>
        <section className="rounded-3xl bg-[#e8f3ec] p-8 md:p-12">
          <p className="text-xs font-bold tracking-widest text-[#5f786c]">
            {copy("من الفكرة للمكان", "HOW IT WORKS")}
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#0d3a24]">
            {copy(
              "من اختيار الباقة لتجهيز المكان",
              "From choosing to setting up",
            )}
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              [
                "01",
                copy("اختار نقطة البداية", "Choose your package"),
                copy(
                  "حدد المدينة والنشاط، واختار باقتك والعناية المناسبة. عدد الغرف يكفي لو مش عارف المساحة.",
                  "Tell us your city and business, choose a package and care plan. Room count is enough if you do not know the area.",
                ),
              ],
              [
                "02",
                copy("نتكلم عن التفاصيل", "Talk through the details"),
                copy(
                  "بعد إرسال الفورم، فريق جنان يتواصل معك لمناقشة المكان والإضاءة وتحديد الأنواع والتوزيع والتكلفة.",
                  "We will call you to discuss the plants, pots and layout, then prepare your quote.",
                ),
              ],
              [
                "03",
                copy("أكد تجهيز مساحتك", "Confirm your plan"),
                copy(
                  "نثبت عرض السعر ومواعيد التوصيل وخيارات التركيب والعناية قبل التنفيذ.",
                  "Once you approve the quote, we will agree on delivery, setup and any care visits.",
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
              "Looking for a custom package?",
            )}
          </h2>
          <p className="mx-auto my-4 max-w-xl text-sm leading-7 text-[#5f786c]">
            {copy(
              "أكثر من ٣٠٠ م²، فروع متعددة أو تصميم خاص؟ نبدأ بتفاصيل المكان ونجهز اقتراحًا مناسبًا.",
              "For larger spaces, several branches or a particular look, we can plan a package around your needs. Tell us what you have in mind.",
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
        aria-labelledby="quote-dialog-title"
        className="m-auto max-h-[90svh] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto rounded-3xl bg-[#f4f5f1] p-6 text-[#0d3a24] shadow-2xl backdrop:bg-black/50 md:p-8"
      >
        {selected && (
          <>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-[#5f786c]">
                  {copy("طلب عرض سعر", "Request a quote")}
                </p>
                <h2 id="quote-dialog-title" className="mt-1 text-2xl font-bold">
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
            <QuoteRequestForm key={selected.id} selected={selected} settings={settings} available={available}/>

          </>
        )}
      </dialog>
    </div>
  );
}
