"use client";
import { useI18n } from "../../lib/i18n-context";
export default function FAQPage() {
  const { isRTL } = useI18n();
  const c = (ar: string, en: string) => isRTL ? ar : en;
  const questions = [
    [c("أقدر أطلب عرض سعر لو مش عارف المساحة؟", "Can I request a quote without knowing the area?"), c("أكيد. المساحة اختيارية، وممكن تكتب عدد الغرف أو تسيب الخانتين فاضيين. هنناقش تفاصيل المكان معاك لما نتواصل.", "Yes. The area is optional. You can enter the number of rooms or leave both fields blank. We will discuss your space when we call.")],
    [c("إزاي أختار الباقة المناسبة؟", "How do I choose a package?"), c("ابدأ بعدد النباتات والمساحة المقترحة لكل باقة. المساحة دليل مبدئي للاختيار. هنراجع الإضاءة والأثاث واستخدام المكان قبل الاتفاق على التوزيع.", "Start with the plant count and suggested area. These are a guide to choosing a package. We will review your lighting, furniture and use of the space before agreeing on the layout.")],
    [c("هل هتكون النباتات والأصص زي الصور؟", "Will my plants and pots look exactly like the photos?"), c("الصور أمثلة للتنسيق والأنواع. النباتات والأحجام والأصص والتوافر بيتأكدوا معاك في عرض السعر قبل تجهيز الطلب.", "The photos show examples of the plants and style. We will confirm the plants, sizes, pots and availability in your quote before preparing your order.")],
    [c("إزاي أطلب باقة؟", "How do I request a package?"), c("اضغط على اطلب عرض سعر في الباقة المناسبة واملأ تفاصيل نشاطك. هتظهر لك رسالة بتأكيد استلام الطلب، وفريق جنان هيتواصل معاك على الرقم اللي سجلته لمناقشة التفاصيل.", "Select Request a quote on your chosen package and fill in your business details. You will see a confirmation that we have received your request. Our team will then call you on the number you provided to discuss the details.")],
    [c("هل لازم أدفع على الموقع؟", "Do I need to pay on the website?"), c("لا. طلب عرض السعر لا يحتاج دفع. بنتفق معاك على السعر النهائي وطريقة السداد قبل تأكيد الطلب.", "No. There is no payment when you request a quote. We will agree on the final price and payment details before you confirm your order.")],
    [c("سعر الباقة بيشمل إيه؟", "What does the package price include?"), c("السعر المبدئي يشمل النباتات والأصص والتجهيز الأولي. التوصيل منفصل، والعناية السنوية اختيارية. عرض السعر بيوضح التفاصيل والتكلفة النهائية.", "Starting prices include plants, pots and initial setup. Delivery costs extra, and annual care is optional. Your quote will explain what is included and confirm the final price.")],
    [c("خدمة العناية السنوية بتكون إزاي؟", "How does annual plant care work?"), c("تقدر تختار زيارتين في السنة، بفاصل ٦ شهور، أو ٤ زيارات في السنة، بفاصل ٣ شهور. بنتابع حالة النباتات ونقدم إرشادات للعناية. السعر بيتأكد حسب عدد النباتات وموقعك، والري والعناية اليومية بيكونوا مسؤوليتك بين الزيارات.", "Choose two visits per year, every six months, or four visits per year, every three months. We check your plants and offer care advice. The fee depends on your plants and location. You will still need to water and care for them between visits.")],
    [c("ولو عندي مكان كبير أو أكتر من فرع؟", "Can you plan for a larger space or several branches?"), c("نعم. اختار الباقة المخصصة واحكي لنا عن المكان وعدد الفروع. هنناقش النباتات والأصص والتوزيع معاك ونجهز عرض سعر مناسب.", "Yes. Request a custom package and tell us about your space and branches. We will discuss the plants, pots and layout with you, then prepare a quote.")],
  ];
  return <section dir={isRTL ? "rtl" : "ltr"} className="mx-auto max-w-3xl px-5 py-16">
    <h1 className="mb-8 text-4xl font-bold">{c("الأسئلة الشائعة", "Common questions")}</h1>
    <div className="space-y-4">{questions.map(([q,a]) => <details key={q} className="rounded-2xl border border-[#d4ded7] bg-white p-5"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-4 text-sm leading-7 text-[#5f786c]">{a}</p></details>)}</div>
  </section>;
}
