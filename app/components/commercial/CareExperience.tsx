"use client";
import Link from "next/link";
import { useI18n } from "../../lib/i18n-context";
import { CARE_PLANS, carePrice, type BusinessSettings } from "../../lib/commercial";

export function CareExperience({ settings }: { settings: BusinessSettings }) {
  const { isRTL } = useI18n();
  const c = (ar: string, en: string) => isRTL ? ar : en;
  return <section dir={isRTL ? "rtl" : "ltr"} className="mx-auto max-w-[1100px] px-5 py-16">
    <p className="text-xs tracking-widest text-[#5f786c]">{c("العناية السنوية", "ANNUAL PLANT CARE")}</p>
    <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">{c("عناية مستمرة بنباتات مكانك.", "Keep your plants looking their best.")}</h1>
    <p className="mt-5 max-w-2xl text-base leading-8 text-[#5f786c]">{c("أضف خطة عناية سنوية لباقتك. نزور مكانك في مواعيد متفق عليها لمتابعة النباتات وتقديم العناية والإرشادات المناسبة.", "Add annual care to your plant package. We visit your space at agreed intervals to check your plants, care for them and help you look after them between visits.")}</p>
    <div className="mt-10 grid gap-6 md:grid-cols-2">{CARE_PLANS.filter(plan => plan.visits > 0).map(plan => <article key={plan.value} className="flex flex-col rounded-3xl bg-white p-8">
      <h2 className="text-2xl font-bold">{plan.visits === 2 ? c("زيارتان في السنة", "Two visits a year") : c("أربع زيارات في السنة", "Four visits a year")}</h2>
      <p className="mt-3 text-sm leading-7 text-[#5f786c]">{plan.visits === 2 ? c("زيارة كل ستة شهور لمراجعة حالة النباتات واحتياجات العناية.", "A visit every six months to review your plants and their care needs.") : c("زيارة كل ثلاثة شهور لمتابعة حالة النباتات على مدار السنة.", "A visit every three months for more regular checks throughout the year.")}</p>
      <p className="my-6 text-xl font-semibold text-[#17583a]">{c("تبدأ من", "From")} {carePrice(settings,plan.value).toLocaleString(isRTL ? "ar-EG" : "en-EG")} {c("جنيه سنويًا", "EGP per year")}</p>
      <Link href="/packages" className="mt-auto inline-block rounded-xl bg-[#17583a] px-6 py-3 text-center text-sm font-semibold text-white">{c("اختار باقتك وأضف العناية", "Choose a package and add care")}</Link>
    </article>)}</div>
    <div className="mt-10 grid gap-8 md:grid-cols-2">
      <div><h2 className="text-2xl font-bold">{c("إيه اللي بيحصل في الزيارة؟", "What happens during a visit?")}</h2><p className="mt-4 text-sm leading-7 text-[#5f786c]">{c("نفحص النباتات والتربة، وننظف ونقلم حسب الحاجة، ونراجع احتياجات التغذية. ونوضح لك طريقة العناية المناسبة بين الزيارات.", "We check the plants and soil, clean and prune where needed, and review feeding needs. We also explain the care your plants need between visits.")}</p></div>
      <div><h2 className="text-2xl font-bold">{c("بين الزيارات", "Between visits")}</h2><p className="mt-4 text-sm leading-7 text-[#5f786c]">{c("الري والمتابعة المعتادة مسؤوليتك بين الزيارات. لو لاحظت أي تغير في النباتات، تواصل معنا واشرح المشكلة مع صورة لو متاحة.", "You will need to water and look after your plants between visits. If you notice a change, contact us with a description and a photo if you have one.")}</p></div>
    </div>
    <p className="mt-8 text-xs leading-6 text-[#5f786c]">{c("بنتفق على السعر السنوي حسب عدد النباتات وموقعك. التنقل والمواد الإضافية واستبدال النباتات بتتكلف بشكل منفصل، والتفاصيل بتتأكد في عرض السعر.", "We confirm the annual fee based on your plants and location. Travel, extra materials and plant replacements cost extra. Your quote will confirm the details.")}</p>
    <Link href="/contact" className="mt-6 inline-block font-semibold text-[#17583a] underline">{c("ناقش خطة العناية معنا", "Discuss a care plan with us")}</Link>
  </section>;
}
