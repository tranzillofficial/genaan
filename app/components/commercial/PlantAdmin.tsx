"use client";
import { useEffect, useState } from "react";
import { useI18n } from "../../lib/i18n-context";
import { getAdminAuthHeaders, getAdminUploadHeaders } from "../../lib/admin-auth";
import { type PlantVariety } from "../../lib/commercial";

type Draft = Omit<PlantVariety, "id"> & { id?: string };

export function PlantAdmin() {
  const { isRTL } = useI18n();
  const c = (ar: string, en: string) => isRTL ? ar : en;
  const [plants, setPlants] = useState<PlantVariety[]>([]);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const busy = saving || uploading;
  const input = "w-full rounded-xl border border-[#d4ded7] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#17583a]";

  async function load() {
    const response = await fetch("/api/admin/plants", { headers: await getAdminAuthHeaders(), cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    setPlants(data.data);
  }
  useEffect(() => {
    void load().catch(e => setError(e instanceof Error ? e.message : "Could not load plants.")).finally(() => setLoading(false));
  }, []);

  function edit(plant?: PlantVariety) {
    setEditing(plant ? { ...plant } : { name_ar: "", name_en: "", image_url: "", category: "plant", is_active: true, sort_order: Math.min(100000, Math.max(0, ...plants.map(p => p.sort_order)) + 1) });
    setDeleting(null); setError(""); setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function mutate(method: "POST" | "DELETE", body: Draft | { id: string }) {
    setSaving(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/admin/plants", { method, headers: await getAdminAuthHeaders(), body: JSON.stringify(body) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setEditing(null); setDeleting(null); setQuery("");
      await load();
      setMessage(method === "DELETE" ? c("تم حذف النبات من المعرض.", "Plant removed from the gallery.") : c("تم الحفظ. التغييرات تظهر في معرض الموقع عند تحديث الصفحة.", "Saved. Refresh the website to see the gallery changes."));
    } catch (e) { setError(e instanceof Error ? e.message : c("تعذر حفظ التغييرات.", "Could not save changes.")); }
    finally { setSaving(false); }
  }
  async function upload(file?: File) {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type) || file.size === 0 || file.size > 4 * 1024 * 1024) {
      setError(c("اختار صورة JPG أو PNG أو WebP أو AVIF بحجم أقل من ٤ ميجا.", "Choose a JPG, PNG, WebP or AVIF image under 4 MB.")); return;
    }
    setUploading(true); setError("");
    try {
      const body = new FormData(); body.set("file", file); body.set("target", "plants");
      const response = await fetch("/api/admin/business/upload", { method: "POST", headers: await getAdminUploadHeaders(), body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setEditing(p => p ? { ...p, image_url: data.url } : p);
    } catch (e) { setError(e instanceof Error ? e.message : c("تعذر رفع الصورة.", "Image upload failed.")); }
    finally { setUploading(false); }
  }
  const visible = plants.filter(p => `${p.name_ar} ${p.name_en}`.toLowerCase().includes(query.trim().toLowerCase()));

  return <div dir={isRTL ? "rtl" : "ltr"} className="space-y-6 text-[#0d3a24]">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-3xl font-bold">{c("النباتات والصور", "Plants & photos")}</h1><p className="mt-2 text-sm leading-7 text-[#5f786c]">{c("إدارة الأنواع المعروضة في الصفحة الرئيسية وصفحة الباقات. أضف نباتًا، غيّر صورته، أو احذفه من المعرض.", "Manage varieties shown on the home and packages pages. Add a plant, replace its photo or remove it from the gallery.")}</p></div>
      <button type="button" disabled={loading || busy} onClick={() => edit()} className="rounded-xl bg-[#17583a] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{c("+ إضافة نبات", "+ Add plant")}</button>
    </div>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    {message && <p role="status" className="rounded-xl bg-[#e8f3ec] p-4 text-sm">{message}</p>}
    {editing && <form onSubmit={e => { e.preventDefault(); if (!busy) void mutate("POST", editing); }} className="rounded-2xl border border-[#d4ded7] bg-white p-5 md:p-8">
      <h2 className="mb-5 text-xl font-bold">{editing.id ? c("تعديل النبات والصورة", "Edit plant & photo") : c("إضافة نبات جديد", "Add a new plant")}</h2>
      <fieldset disabled={busy} className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm"><span className="block font-semibold">{c("الاسم بالعربي", "Arabic name")}</span><input required maxLength={120} value={editing.name_ar} onChange={e => setEditing({ ...editing, name_ar: e.target.value })} className={input}/></label>
        <label className="space-y-2 text-sm"><span className="block font-semibold">{c("الاسم بالإنجليزي (اختياري)", "English name (optional)")}</span><input maxLength={120} value={editing.name_en} onChange={e => setEditing({ ...editing, name_en: e.target.value })} className={input} dir="ltr" placeholder={c("لو فاضي، هنستخدم الاسم العربي", "Leave blank to use the Arabic name")}/></label>
        <label className="space-y-2 text-sm"><span className="block font-semibold">{c("التصنيف", "Category")}</span><select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value as Draft["category"] })} className={input}><option value="plant">{c("نبات", "Plant")}</option><option value="palm">{c("نخيل", "Palm")}</option></select></label>
        <label className="space-y-2 text-sm"><span className="block font-semibold">{c("ترتيب الظهور (الأقل يظهر أولًا)", "Display order (lower appears first)")}</span><input type="number" required min={0} max={100000} step={1} value={Number.isFinite(editing.sort_order) ? editing.sort_order : ""} onChange={e => setEditing({ ...editing, sort_order: e.target.value === "" ? NaN : Number(e.target.value) })} className={input}/></label>
        <label className="space-y-2 text-sm md:col-span-2"><span className="block font-semibold">{c("رابط الصورة", "Image URL")}</span><input required maxLength={1800} value={editing.image_url} onChange={e => setEditing({ ...editing, image_url: e.target.value })} className={input} dir="ltr" placeholder="https://…"/><span className="block text-xs text-[#5f786c]">{c("ارفع صورة من جهازك، أو أضف رابط صورة يبدأ بـ https://.", "Upload a photo below, or paste an image URL starting with https://.")}</span></label>
        <label className="space-y-2 text-sm"><span className="block font-semibold">{c("رفع أو استبدال الصورة", "Upload or replace photo")}</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e => { const file = e.target.files?.[0]; e.target.value = ""; void upload(file); }} className={input}/><span className="block text-xs text-[#5f786c]">JPG / PNG / WebP / AVIF · {c("حتى ٤ ميجا", "Up to 4 MB")}</span></label>
        <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={editing.is_active} onChange={e => setEditing({ ...editing, is_active: e.target.checked })}/>{c("ظاهر في الموقع", "Visible on website")}</label>
      </fieldset>
      {uploading && <p role="status" className="mt-4 text-sm">{c("جارٍ رفع الصورة…", "Uploading photo…")}</p>}
      {editing.image_url && <div className="mt-5 max-w-sm rounded-2xl bg-[#e8f3ec] p-3"><img src={editing.image_url} alt={editing.name_ar || c("معاينة الصورة", "Photo preview")} className="h-52 w-full rounded-xl object-contain"/></div>}
      <div className="mt-6 flex gap-3"><button disabled={busy} className="rounded-xl bg-[#17583a] px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{saving ? c("جارٍ الحفظ…", "Saving…") : c("حفظ النبات", "Save plant")}</button><button type="button" disabled={busy} onClick={() => setEditing(null)} className="rounded-xl border border-[#d4ded7] px-6 py-3 text-sm disabled:opacity-50">{c("إلغاء", "Cancel")}</button></div>
    </form>}
    <label className="block max-w-md text-sm"><span className="mb-2 block font-semibold">{c("البحث باسم النبات", "Search plants by name")}</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} className={input}/></label>
    {loading ? <p role="status">{c("جارٍ تحميل النباتات…", "Loading plants…")}</p> : <>
      <p className="text-sm text-[#5f786c]">{c(`${plants.length} نوع · ${plants.filter(p => p.is_active).length} ظاهر في الموقع`, `${plants.length} varieties · ${plants.filter(p => p.is_active).length} visible on website`)}</p>
      {visible.length === 0 && <p className="rounded-2xl border border-dashed border-[#d4ded7] p-8 text-center text-sm">{c("لا توجد نباتات مطابقة. يمكنك إضافة نبات جديد.", "No matching plants. You can add a new variety.")}</p>}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{visible.map(p => <article key={p.id} className="overflow-hidden rounded-2xl border border-[#d4ded7] bg-white">
        <img src={p.image_url} alt={isRTL ? p.name_ar : p.name_en} loading="lazy" className="h-44 w-full bg-[#e8f3ec] object-contain"/>
        <div className="space-y-3 p-5"><h2 className="text-lg font-bold">{isRTL ? p.name_ar : p.name_en}</h2><p className="text-xs text-[#5f786c]">{p.category === "palm" ? c("نخيل", "Palm") : c("نبات", "Plant")} · {p.is_active ? c("ظاهر", "Visible") : c("مخفي", "Hidden")} · {c("الترتيب", "Order")} {p.sort_order}</p>
          <div className="flex gap-3"><button type="button" disabled={busy} onClick={() => edit(p)} className="rounded-lg border border-[#17583a] px-4 py-2 text-sm font-semibold disabled:opacity-50">{c("تعديل", "Edit")}</button><button type="button" disabled={busy} onClick={() => { setDeleting(p.id); setMessage(""); }} className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-700 disabled:opacity-50">{c("حذف", "Delete")}</button></div>
          {deleting === p.id && <div className="rounded-xl bg-red-50 p-4"><p className="mb-3 text-sm text-red-700">{c(`تحذف «${p.name_ar}» وصورته من المعرض؟`, `Remove “${p.name_en}” and its photo from the gallery?`)}</p><div className="flex gap-3"><button type="button" disabled={busy} onClick={() => void mutate("DELETE", { id: p.id })} className="rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{c("تأكيد الحذف", "Confirm removal")}</button><button type="button" disabled={busy} onClick={() => setDeleting(null)} className="text-sm underline">{c("إلغاء", "Cancel")}</button></div></div>}
        </div>
      </article>)}</div>
    </>}
  </div>;
}
