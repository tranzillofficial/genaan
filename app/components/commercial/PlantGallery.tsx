"use client";
import { useState } from "react";
import { CURATED_PLANTS } from "../../lib/commercial";
import { useI18n } from "../../lib/i18n-context";

export function PlantGallery() {
  const { isRTL } = useI18n();
  const c = (ar: string, en: string) => isRTL ? ar : en;
  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState(false);
  const plant = CURATED_PLANTS[selected];
  return <div className="mt-6 grid overflow-hidden rounded-3xl border border-[#d4ded7] bg-white lg:grid-cols-[1fr_1.1fr]">
    <div className="p-6 md:p-8">
      <p className="mb-5 text-sm font-semibold text-[#5f786c]">{c("اختار نوع النبات عشان تشوف صورته", "Choose a plant to see its photo")}</p>
      <div role="group" aria-label={c("أنواع النباتات", "Plant varieties")} className="flex flex-wrap gap-2">
        {CURATED_PLANTS.map((p, i) => <button key={p.en} type="button" aria-pressed={i === selected} aria-controls="selected-plant-photo" onClick={() => { setSelected(i); setFailed(false); }} className={`rounded-full border px-4 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17583a] ${i === selected ? "border-[#17583a] bg-[#17583a] text-white" : "border-[#d4ded7] bg-white text-[#17583a] hover:bg-[#e8f3ec]"}`}>{isRTL ? p.ar : p.en}</button>)}
      </div>
      <p className="mt-6 text-xs leading-6 text-[#5f786c]">{c("الصور للتعريف بالنوع وتنسيقه. لون الأوراق والصنف والحجم والأصيص النهائي بيتحددوا معاك حسب المتاح وإضاءة المكان.", "Photos illustrate each plant variety and styling. Leaf colour, cultivar, size and the final pot are agreed with you for availability and light.")}</p>
    </div>
    <figure id="selected-plant-photo" className="bg-[#e8ede5] p-4 md:p-6">
      <div className="flex h-80 items-center justify-center overflow-hidden rounded-2xl bg-[#f4f5f1] md:h-[420px]">
        {failed ? <p role="status" className="p-8 text-sm text-[#5f786c]">{c("تعذر تحميل الصورة حاليًا. جرّب اختيار النبات مرة أخرى.", "This photo could not load. Select the plant again to retry.")}</p> : <img key={plant.image} src={plant.image} alt={isRTL ? plant.ar : plant.en} width={1200} height={900} loading="lazy" decoding="async" onError={() => setFailed(true)} className="h-full w-full object-contain" />}
      </div>
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-2" aria-live="polite">
        <span className="text-lg font-bold text-[#0d3a24]">{isRTL ? plant.ar : plant.en}</span>
      </figcaption>
    </figure>
  </div>;
}
