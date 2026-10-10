"use client";
import { useI18n } from "../../lib/i18n-context";
export default function FAQPage() {
  const { isRTL } = useI18n();
  const c = (ar: string, en: string) => (isRTL ? ar : en);
  const questions = [
    [
      c(
        "هل مساحة الباقة تغطية فعلية؟",
        "Does the package cover every square metre?",
      ),
      c(
        "لا، المساحة دليل لتخطيط توزيع النباتات، وليست تغطية للأرضية. نراجع الإضاءة والأثاث والحركة قبل تثبيت التوزيع.",
        "No. Area ranges guide placement rather than floor coverage. Lighting, furniture and circulation are reviewed before the layout is confirmed.",
      ),
    ],
    [
      c("هل النباتات طبيعية أم صناعية؟", "Are the plants real or artificial?"),
      c(
        "يمكن مناقشة الخيار المناسب للمكان على واتساب. الأنواع والخامات تتحدد في عرض السعر، والصور توضيحية.",
        "Discuss the right option for your space on WhatsApp. Varieties and materials are agreed in the quote; images are illustrative.",
      ),
    ],
    [
      c("كيف أطلب الباقة؟", "How do I request a package?"),
      c(
        "اختار الباقة وأدخل تفاصيل نشاطك. نحفظ طلب عرض السعر ثم نجهز رسالة واتساب لتقوم بإرسالها. تأكيد التنفيذ يتم بعد الاتفاق معك.",
        "Choose a package and enter your business details. We save the quotation request and prepare a WhatsApp message for you to send. Fulfilment is confirmed after you agree the details.",
      ),
    ],
    [
      c("هل أحتاج الدفع على الموقع؟", "Do I pay on the website?"),
      c(
        "لا يوجد دفع إلكتروني على الموقع. السعر النهائي وطريقة السداد تتحدد خلال التواصل قبل تأكيد الطلب.",
        "No online payment is collected. The final price and payment arrangements are agreed during the conversation before confirmation.",
      ),
    ],
    [
      c(
        "هل التوصيل والتركيب والصيانة ضمن الباقة؟",
        "Are delivery, installation and care included?",
      ),
      c(
        "تتحدد الخدمات وتكلفتها حسب موقعك واحتياج المكان في عرض السعر. الصيانة الشهرية اختيارية، ولا تُعتبر مشمولة تلقائيًا.",
        "Services and costs depend on your location and needs and are specified in the quote. Monthly maintenance is optional and is not automatically included.",
      ),
    ],
    [
      c(
        "ماذا لو كان المكان أكبر أو له عدة فروع؟",
        "What if I have a larger space or multiple branches?",
      ),
      c(
        "تواصل معنا لباقة مخصصة، وشارك المساحة وصور المكان وعدد الفروع لمناقشة خطة مناسبة.",
        "Contact us for a custom package. Share the area, photos and branch count to discuss a suitable plan.",
      ),
    ],
  ];
  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="mx-auto max-w-3xl px-5 py-16"
    >
      <h1 className="mb-8 text-4xl font-bold">
        {c("أسئلة عن باقات جنان", "About Genaan packages")}
      </h1>
      <div className="space-y-4">
        {questions.map(([q, a]) => (
          <details
            key={q}
            className="rounded-2xl border border-[#d4ded7] bg-white p-5"
          >
            <summary className="cursor-pointer font-semibold">{q}</summary>
            <p className="mt-4 text-sm leading-7 text-[#5f786c]">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
