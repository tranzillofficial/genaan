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
        {c("سياسة الخصوصية", "Privacy policy")}
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
            "Your request is stored in Genaan's database, hosted by Supabase. Only authorised Genaan administrators can read these requests. The quote form does not collect card details or payments.",
          )}
        </p>
        <p>
          {c(
            "إرسال الفورم يحفظ الطلب في لوحة الإدارة، ثم يتواصل معك فريق جنان على رقم الهاتف المسجل. إذا استخدمت رابط واتساب للتواصل مباشرة، تكون المحادثة أيضًا لدى واتساب وحساب جنان المستقبِل.",
            "We save your request so our team can contact you on the number you provide. If you contact us through WhatsApp, your messages are also handled by WhatsApp and our WhatsApp account.",
          )}
        </p>
        <p>
          {c(
            "نموذج الباقة المخصصة في صفحة التواصل يحفظ طلب عرض السعر بنفس طريقة طلب الباقات الجاهزة. دخول الأدمن يستخدم خدمة المصادقة في Supabase، وقد يحفظ المتصفح جلسة تسجيل الدخول وإعداد اللغة.",
            "The custom package form uses the same process as our other quote forms. Account sign-in uses Supabase authentication. Your browser may save your sign-in session and language preference.",
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
