"use client";
import Link from "next/link";
import { useI18n } from "../../lib/i18n-context";
export default function AboutPage() {
  const { isRTL } = useI18n();
  const c = (ar: string, en: string) => (isRTL ? ar : en);
  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="mx-auto max-w-[1100px] px-5 py-16"
    >
      <p className="text-xs tracking-widest text-[#5f786c]">
        THE GENAAN APPROACH
      </p>
      <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
        {c("الطبيعة جزء من تجربة المكان.", "Nature is part of the experience.")}
      </h1>
      <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
        <img
          className="h-96 w-full rounded-3xl object-cover"
          src="/assets/hero_image.png"
          alt={c("مساحة نباتية من جنان", "A green space by Genaan")}
        />
        <div className="space-y-5 text-base leading-8 text-[#5f786c]">
          <p>
            {c(
              "جنان تساعد الأنشطة التجارية على إضافة نباتات وأصص متناسقة للمكان. هدفنا إن كل ركن يخدم تجربة الناس: استقبال مريح في عيادة، لمسة ترحيب في مطعم، أو انطباع مميز في فندق ومحل تجاري.",
              "Genaan helps businesses bring coordinated plants and pots into their spaces. Every corner can support the experience: a calm clinic reception, a welcoming restaurant or a memorable hotel and retail interior.",
            )}
          </p>
          <p>
            {c(
              "نبدأ بباقات واضحة العدد والمساحة، ونخصص الأنواع والتوزيع حسب الإضاءة والأثاث وطريقة استخدام المكان. يمكن اختيار الطبيعي أو الصناعي، وتحديد خيارات العناية في عرض السعر.",
              "We start with clear plant counts and area guides, then tailor varieties and placement to light, furniture and daily use. Real or artificial options and care requirements are agreed in the quotation.",
            )}
          </p>
          <Link
            href="/packages"
            className="inline-block rounded-xl bg-[#17583a] px-6 py-3 text-sm font-semibold text-white"
          >
            {c("اكتشف الباقات", "Discover packages")}
          </Link>
        </div>
      </div>
    </section>
  );
}
