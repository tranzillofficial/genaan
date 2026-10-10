"use client";
import Link from "next/link";
import { useI18n } from "../../lib/i18n-context";
export default function PrivacyPage() {
  const { isRTL } = useI18n();
  const c = (ar: string, en: string) => (isRTL ? ar : en);
  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="mx-auto max-w-3xl px-5 py-16"
    >
      <h1 className="mb-6 text-4xl font-bold">
        {c("بيانات طلب عرض السعر", "Your quotation request data")}
      </h1>
      <div className="space-y-5 rounded-3xl bg-white p-8 text-sm leading-8 text-[#5f786c]">
        <p>
          {c(
            "عند طلب عرض سعر، يحفظ الموقع اسمك ورقم هاتفك واسم النشاط ونوعه والمدينة ومساحة المكان أو عدد الغرف إذا أدخلتهما والعنوان والملاحظات والباقة وخطة العناية المختارة وسعرها المبدئي وقت الطلب. يستخدم فريق جنان هذه البيانات لمناقشة احتياجك ومتابعة الطلب.",
            "When you request a quotation, the website stores your name, phone number, business name and type, city, optional area or room count, address, notes, selected package and care plan with its starting price at request time. Genaan uses these details to discuss your needs and follow up on the request.",
          )}
        </p>
        <p>
          {c(
            "هذه البيانات محفوظة في قاعدة بيانات جنان على Supabase، وقراءة الطلبات متاحة لحسابات إدارة جنان فقط. لا يجمع هذا التدفق بيانات البطاقات أو مدفوعات إلكترونية.",
            "These records are stored in Genaan's Supabase database. Reading request records is restricted to Genaan administrators. This flow does not collect card details or online payments.",
          )}
        </p>
        <p>
          {c(
            "فتح واتساب يجهز رسالة تحتوي على التفاصيل التي أدخلتها. لا يتم إرسالها تلقائيًا؛ أنت تختار إرسالها، وبعد الإرسال تكون المحادثة أيضًا لدى واتساب وحساب جنان المستقبِل.",
            "Opening WhatsApp prepares a message with the details you entered. It is not sent automatically. If you send it, the conversation is also held by WhatsApp and the receiving Genaan account.",
          )}
        </p>
        <p>
          {c(
            "نموذج الباقة المخصصة في صفحة التواصل يحفظ طلب عرض السعر بنفس طريقة طلب الباقات الجاهزة. دخول الأدمن يستخدم خدمة المصادقة في Supabase، وقد يحفظ المتصفح جلسة تسجيل الدخول وإعداد اللغة.",
            "The bespoke-package form on the contact page saves a quotation request in the same way as the ready-made packages. Admin login uses Supabase authentication; the browser may store the login session and language preference.",
          )}
        </p>
        <p>
          {c(
            "للاستفسار عن بيانات طلبك أو طلب تصحيحها أو حذفها، تواصل مع جنان واذكر مرجع الطلب.",
            "To ask about your request data or request a correction or deletion, contact Genaan and include the request reference.",
          )}{" "}
          <Link className="font-semibold underline" href="/contact">
            {c("تواصل معنا", "Contact us")}
          </Link>
        </p>
      </div>
    </section>
  );
}
