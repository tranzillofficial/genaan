"use client";

import Link from "next/link";
import { useI18n } from "../lib/i18n-context";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { isRTL } = useI18n();
  const c = (ar: string, en: string) => isRTL ? ar : en;
  useEffect(() => {
    console.error("[Page Error]", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-5 bg-[#f4f5f1]">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h2 className="text-2xl font-heading font-bold text-[#0d3a24] mb-3">
          {c("تعذر تحميل الصفحة", "We could not load this page")}
        </h2>
        <p className="text-[#5f786c] text-sm mb-8">
          {c("حاول مرة أخرى أو ارجع للصفحة الرئيسية.", "Please try again or return to the home page.")}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-[#17583a] text-white text-sm font-semibold rounded-xl hover:bg-[#195b36] transition-colors"
          >
            {c("حاول مرة أخرى", "Try again")}
          </button>
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
