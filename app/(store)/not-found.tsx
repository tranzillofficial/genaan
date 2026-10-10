"use client";
import Link from "next/link";
import { useI18n } from "../lib/i18n-context";

export default function NotFound() {
  const { isRTL } = useI18n();
  const c = (ar: string, en: string) => isRTL ? ar : en;
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-5 bg-[#f4f5f1]">
      <div className="text-center max-w-md">
        <p className="text-8xl font-heading font-black text-[#e4ece7] mb-4">404</p>
        <h1 className="text-2xl font-heading font-bold text-[#0d3a24] mb-3">
          {c("الصفحة غير موجودة", "Page not found")}
        </h1>
        <p className="text-[#5f786c] text-sm mb-8">
          {c("الصفحة غير متاحة. تقدر تستعرض الباقات أو ترجع للصفحة الرئيسية.", "This page is unavailable. Explore our packages or return to the home page.")}
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/packages"
            className="px-5 py-2.5 bg-[#17583a] text-white text-sm font-semibold rounded-xl hover:bg-[#195b36] transition-colors"
          >
            {c("استعرض الباقات", "Explore packages")}
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 border border-[#d4ded7] text-sm font-semibold text-[#5f786c] rounded-xl hover:border-[#17583a] transition-colors"
          >
            {c("الصفحة الرئيسية", "Home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
