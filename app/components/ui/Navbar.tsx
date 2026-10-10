"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "../../lib/i18n-context";

export function Navbar() {
  const { t, lang, setLang, isRTL } = useI18n();
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Scroll-aware transparency — only on home page
  const [scrolled, setScrolled] = useState(!isHome);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isHome) return; // fixed on all non-home pages
    setScrolled(false);
    const hero = document.querySelector("section") as HTMLElement | null;
    const threshold = hero?.offsetHeight ?? window.innerHeight * 0.85;
    const handleScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  return (
    <>
      <header
        className={[
          "fixed top-0 inset-x-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur border-b border-[#e4ece7] shadow-sm"
            : "bg-transparent border-b border-transparent",
        ].join(" ")}
      >
        {/* Always LTR: logo on left, actions on right — only nav links flip */}
        <div
          dir="ltr"
          className="mx-auto max-w-[1200px] px-5 h-16 flex items-center justify-between gap-4"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/assets/icon.png"
              alt="Genaan logo"
              width={40}
              height={40}
              className={[
                "object-contain transition-all duration-300",
                !scrolled ? "brightness-[1.55] saturate-[0.7]" : "",
              ].join(" ")}
            />
            <span
              className={[
                "text-xl tracking-tight transition-colors duration-300",
                scrolled ? "text-[#0d3a24]" : "text-white drop-shadow",
              ].join(" ")}
              style={{ fontFamily: "var(--font-fugaz), sans-serif" }}
            >
              genaan
            </span>
          </Link>

          {/* Nav links */}
          <nav
            dir={isRTL ? "rtl" : "ltr"}
            className={[
              "hidden md:flex items-center gap-6 text-sm font-medium transition-colors duration-300",
              scrolled ? "text-[#5f786c]" : "text-white/90",
            ].join(" ")}
          >
            <Link
              href="/packages"
              className={`hover:text-[#17583a] transition-colors ${!scrolled && "hover:text-white"}`}
            >
              {isRTL ? "الباقات" : "Packages"}
            </Link>
            <Link
              href="/contact"
              className={`hover:text-[#17583a] transition-colors ${!scrolled && "hover:text-white"}`}
            >
              {isRTL ? "جهز مساحتك" : "Your space"}
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language toggle — rounded-[6px] */}
            <button
              id="lang-toggle"
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-bold transition-colors",
                scrolled
                  ? "text-[#5f786c] hover:text-[#17583a]"
                  : "text-white hover:text-white/80",
              ].join(" ")}
              title={lang === "en" ? "Switch to Arabic" : "Switch to English"}
            >
              <i className="fa-solid fa-language text-sm" />
              {lang === "en" ? "AR" : "EN"}
            </button>

            <Link
              href="/contact"
              className={`hidden sm:inline-flex rounded-lg px-4 py-2 text-xs font-semibold ${scrolled ? "bg-[#17583a] text-white" : "bg-white text-[#0d3a24]"}`}
            >
              {isRTL ? "تواصل معنا" : "Get in touch"}
            </Link>

            {/* Hamburger mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={[
                "md:hidden w-10 h-10 flex items-center justify-center rounded-[6px] transition-colors",
                scrolled
                  ? "hover:bg-[#f4f5f1] text-[#0d3a24]"
                  : "text-white hover:bg-white/10",
              ].join(" ")}
              aria-label="Toggle Menu"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={[
          "fixed inset-0 z-50 transition-opacity duration-300 md:hidden",
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#0d3a24]/30 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer content */}
        <div
          className={[
            "absolute top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] p-6",
            isRTL ? "left-0" : "right-0",
            mobileMenuOpen
              ? "translate-x-0"
              : isRTL
                ? "-translate-x-full"
                : "translate-x-full",
          ].join(" ")}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Close button */}
          <div className="flex items-center justify-between mb-8">
            <span className="font-heading font-black text-xl text-[#0d3a24]">
              genaan
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f4f5f1] text-[#0d3a24] hover:bg-[#e4ece7]"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-4 text-base font-semibold text-[#5f786c]">
            <Link
              href="/packages"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#17583a] py-2 border-b border-[#f4f5f1] flex items-center justify-between"
            >
              <span>{isRTL ? "الباقات" : "Packages"}</span>
              <i className="fa-solid fa-chevron-right text-xs text-[#8aab99] rtl:rotate-180" />
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#17583a] py-2 border-b border-[#f4f5f1] flex items-center justify-between"
            >
              <span>{isRTL ? "جهز مساحتك" : "Your space"}</span>
              <i className="fa-solid fa-chevron-right text-xs text-[#8aab99] rtl:rotate-180" />
            </Link>
          </nav>

          {/* Mobile specific controls (Language switcher, Cart, Auth) */}
          <div className="mt-auto pt-6 border-t border-[#e4ece7] space-y-4">
            {/* Lang switch */}
            <button
              onClick={() => {
                setLang(lang === "en" ? "ar" : "en");
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#f4f5f1] text-[#0d3a24] font-bold text-sm"
            >
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-language text-base" />
                {lang === "en" ? "العربية" : "English"}
              </span>
              <span className="text-xs text-[#8aab99]">
                {lang === "en" ? "AR" : "EN"}
              </span>
            </button>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl bg-[#17583a] px-4 py-3 text-center text-sm font-semibold text-white"
            >
              {isRTL ? "تواصل معنا" : "Get in touch"}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
