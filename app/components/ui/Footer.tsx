"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useI18n } from "../../lib/i18n-context";
import { normalizeWhatsApp } from "../../lib/commercial";
export type FooterSocials = {
  instagram: string;
  facebook: string;
  whatsapp: string;
  telegram: string;
};
export function Footer(_props: { initialSocials?: FooterSocials }) {
  const { isRTL } = useI18n();
  const c = (ar: string, en: string) => (isRTL ? ar : en);
  const [contact, setContact] = useState({
    whatsapp: "",
    email: "",
    phone: "",
  });
  useEffect(() => {
    let live = true;
    fetch("/api/business")
      .then((r) => r.json())
      .then((d) => {
        if (live && d.settings) setContact(d.settings);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  const whatsapp = normalizeWhatsApp(contact.whatsapp);
  return (
    <footer dir={isRTL ? "rtl" : "ltr"} className="bg-[#0d3a24] text-white">
      <div className="mx-auto max-w-[1200px] px-5 py-12 md:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Image
                src="/assets/icon.png"
                alt="Genaan logo"
                width={36}
                height={36}
                className="object-contain brightness-0 invert"
              />
              <span
                className="text-2xl"
                style={{ fontFamily: "var(--font-fugaz),sans-serif" }}
              >
                genaan
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-7 text-[#b4d9c5]">
              {c(
                "نباتات مختارة بعناية، ومساحات تترك انطباعًا. باقات للأعمال والضيافة.",
                "Considered greenery. Memorable spaces. Plant packages for business and hospitality.",
              )}
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">
              {c("اكتشف جنان", "Explore Genaan")}
            </h3>
            <div className="space-y-3 text-sm text-[#b4d9c5]">
              {[
                ["/packages", c("باقات النباتات", "Plant packages")],
                ["/care", c("العناية بالنباتات", "Plant care")],
                ["/about", c("عن جنان", "About Genaan")],
                ["/journal", c("المدونة", "Journal")],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="block hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">
              {c("لنتحدث عن مساحتك", "Let's talk about your space")}
            </h3>
            <div className="space-y-3 text-sm text-[#b4d9c5]">
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-white"
                >
                  {c("تواصل عبر واتساب", "Contact on WhatsApp")} ↗
                </a>
              )}
              {contact.email && (
                <a className="block" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              )}
              {contact.phone && (
                <a className="block" href={`tel:${contact.phone}`} dir="ltr">
                  {contact.phone}
                </a>
              )}
              <Link className="block" href="/contact">
                {c("صفحة التواصل", "Contact us")}
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6 text-xs text-[#b4d9c5]">
          <span>© {new Date().getFullYear()} Genaan</span>
          <div className="flex gap-5">
            <Link href="/privacy-policy">{c("الخصوصية", "Privacy")}</Link>
            <Link href="/admin/login">{c("دخول الإدارة", "Admin login")}</Link>
            <span>
              {c(
                "الطلبات والتفاصيل عبر واتساب",
                "Orders & details on WhatsApp",
              )}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
