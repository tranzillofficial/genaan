"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useI18n } from "../../lib/i18n-context";
import { normalizeInstagram, normalizeWhatsApp } from "../../lib/commercial";
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
    instagram: "",
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
  const instagram = normalizeInstagram(contact.instagram);
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
                "نباتات وأصص متناسقة لمساحات عمل وضيافة ترحب بكل زائر في مصر.",
                "Plants and matching pots for welcoming business spaces in Egypt.",
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
              <div className="flex gap-3">
                {instagram && <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label={c("إنستجرام جنان", "Genaan on Instagram")} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                </a>}
                {whatsapp && <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label={c("تواصل مع جنان عبر واتساب", "Contact Genaan on WhatsApp")} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                  <svg aria-hidden="true" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.7a8.5 8.5 0 1 1 16.3-3.8Z"/><path d="M8.1 7.7c-.7.5-.9 1.6-.4 2.6 1.2 2.5 3.1 4.3 5.6 5.1 1.1.4 2.3-.1 2.5-.9l.2-1.1-2.4-1.1-.9 1c-1.6-.6-2.9-1.8-3.6-3.3l.8-.9-1-2.2Z"/></svg>
                </a>}
              </div>
              {contact.email && (
                <a className="block" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              )}
              <Link className="block" href="/contact">
                {c("صفحة التواصل", "Contact us")}
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 pt-6 text-xs text-[#b4d9c5]">
          <span>© {new Date().getFullYear()} Genaan</span>
          <div className="flex gap-5">
            <Link href="/privacy-policy">{c("سياسة الخصوصية", "Privacy policy")}</Link>
            <Link href="/faq">{c("الأسئلة الشائعة", "Common questions")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
