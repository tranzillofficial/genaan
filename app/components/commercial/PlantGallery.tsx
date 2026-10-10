"use client";
import { useEffect, useState } from "react";
import { type PlantVariety } from "../../lib/commercial";
import { useI18n } from "../../lib/i18n-context";

export function PlantGallery({ plants }: { plants: PlantVariety[] }) {
  const { isRTL } = useI18n();
  const c = (ar: string, en: string) => isRTL ? ar : en;
  const [selected, setSelected] = useState("");
  const [failed, setFailed] = useState(false);
  const plant = plants.find(p => p.id === selected) || plants[0];
  useEffect(() => { setFailed(false); }, [plant?.image_url]);
  if (!plant) return <p className="rounded-2xl border border-[#d4ded7] p-6 text-sm text-[#5f786c]">{c("الأنواع المتاحة هتظهر هنا قريبًا. تواصل معنا لمناقشة النباتات المناسبة لمساحتك.", "Available varieties will appear here soon. Contact us to discuss plants for your space.")}</p>;
  return <div className="mt-6 grid overflow-hidden rounded-3xl border border-[#d4ded7] bg-white lg:grid-cols-[1fr_1.1fr]">
    <div className="p-6 md:p-8">
      <p className="mb-5 text-sm font-semibold text-[#5f786c]">{c("اختار نوع النبات عشان تشوف صورته", "Choose a plant to see its photo")}</p>
      <div role="group" aria-label={c("أنواع النباتات", "Plant varieties")} className="flex flex-wrap gap-2">
        {plants.map((p) => <button key={p.id} type="button" aria-pressed={p.id === plant.id} aria-controls="selected-plant-photo" onClick={() => { setSelected(p.id); setFailed(false); }} className={`rounded-full border px-4 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17583a] ${p.id === plant.id ? "border-[#17583a] bg-[#17583a] text-white" : "border-[#d4ded7] bg-white text-[#17583a] hover:bg-[#e8f3ec]"}`}>{isRTL ? p.name_ar : p.name_en}</button>)}
      </div>
      <p className="mt-6 text-xs leading-6 text-[#5f786c]">{c("الصور للتعريف بكل نوع. الحجم والأصيص والتوافر بيتأكدوا معاك في عرض السعر.", "Photos show examples of each plant. We will confirm its size, pot and availability in your quote.")}</p>
    </div>
    <figure id="selected-plant-photo" className="bg-[#e8ede5] p-4 md:p-6">
      <div className="flex h-80 items-center justify-center overflow-hidden rounded-2xl bg-[#f4f5f1] md:h-[420px]">
        {failed ? <p role="status" className="p-8 text-sm text-[#5f786c]">{c("تعذر تحميل الصورة حاليًا. جرّب اختيار النبات مرة أخرى.", "This photo could not load. Select the plant again to retry.")}</p> : <img key={plant.image_url} src={plant.image_url} alt={isRTL ? plant.name_ar : plant.name_en} width={1200} height={900} loading="lazy" decoding="async" onError={() => setFailed(true)} className="h-full w-full object-contain" />}
      </div>
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-2" aria-live="polite">
        <span className="text-lg font-bold text-[#0d3a24]">{isRTL ? plant.name_ar : plant.name_en}</span>
      </figcaption>
    </figure>
  </div>;
}
