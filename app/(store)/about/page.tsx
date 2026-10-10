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
        {c("عن جنان", "ABOUT GENAAN")}
      </p>
      <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
        {c("نباتات تضيف ترحيب وجمال لمكانك.", "Plants that make your space more welcoming.")}
      </h1>
      <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
        <img
          className="h-96 w-full rounded-3xl object-cover"
          src="/assets/hero_image.png"
          alt={c("مساحة نباتية من جنان", "Plants arranged in an interior")}
        />
        <div className="space-y-5 text-base leading-8 text-[#5f786c]">
          <p>
            {c(
              "جنان تساعد الأنشطة التجارية على إضافة نباتات وأصص متناسقة للمكان. هدفنا إن كل ركن يخدم تجربة الناس: استقبال مريح في عيادة، لمسة ترحيب في مطعم، أو انطباع مميز في فندق ومحل تجاري.",
              "Genaan brings plants and matching pots to business spaces in Egypt. From clinic receptions to restaurants, hotels and shops, we help you create a place where people feel welcome.",
            )}
          </p>
          <p>
            {c(
              "ابدأ بباقة من باقاتنا أو احكي لنا عن مشروع مخصص. نختار النباتات ونرتبها حسب الإضاءة والأثاث واستخدام المكان. ويمكنك إضافة عناية سنوية لمتابعة النباتات مع الوقت.",
              "Start with one of our packages or tell us about a custom project. We choose the plants and plan their placement around your lighting, furniture and daily use. Optional annual care helps you look after them over time.",
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
