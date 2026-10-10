-- Genaan commercial backend. Run only in the dedicated Genaan project.
begin;
create table if not exists public.genaan_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.genaan_admins enable row level security;
revoke all on public.genaan_admins from anon, authenticated;
grant select on public.genaan_admins to anon,authenticated;
create policy genaan_admin_self on public.genaan_admins for select to authenticated using (user_id = (select auth.uid()));
-- One-time bootstrap from existing database administrators, never JWT user_metadata.
insert into public.genaan_admins(user_id) select id from public.profiles where is_admin=true or role='admin' on conflict do nothing;

-- Stop legacy profile policies from allowing role escalation through self-editing.
create or replace function public.genaan_guard_profile_privileges() returns trigger
language plpgsql set search_path='' as $$
begin
 if current_user in ('anon','authenticated') then
  if tg_op='INSERT' and (coalesce(new.is_admin,false) or coalesce(new.role,'customer') in ('admin','subadmin') or coalesce(array_length(new.permissions,1),0)>0) then
   raise exception 'Administrator privileges cannot be assigned from a client';
  end if;
  if tg_op='UPDATE' and (new.id is distinct from old.id or new.is_admin is distinct from old.is_admin or new.role is distinct from old.role or new.permissions is distinct from old.permissions) then
   raise exception 'Administrator privileges cannot be edited from a client';
  end if;
 end if;
 return new;
end; $$;
drop trigger if exists genaan_profile_privileges on public.profiles;
create trigger genaan_profile_privileges before insert or update on public.profiles for each row execute function public.genaan_guard_profile_privileges();

create table if not exists public.genaan_packages (
 id uuid primary key default gen_random_uuid(), slug text unique not null,
 name_en text not null, name_ar text not null, description_en text not null default '', description_ar text not null default '',
 plant_count integer not null check(plant_count between 1 and 10000),
 area_min numeric not null check(area_min>=1),area_max numeric not null check(area_max>=area_min and area_max<=100000),
 price numeric check(price is null or price between 0 and 10000000), image_url text not null default '',
 includes_en text[] not null default '{}',includes_ar text[] not null default '{}',
 business_types text[] not null default '{}' check(business_types <@ array['clinic','restaurant','hotel','supermarket','office','other']::text[] and cardinality(business_types)>0),
 care_en text not null default '',care_ar text not null default '',
 is_active boolean not null default false,is_featured boolean not null default false,sort_order integer not null default 0,
 created_at timestamptz not null default now()
);
create table if not exists public.genaan_business_settings (
 key text primary key check(key in ('whatsapp','email','phone')), value text not null default ''
);
insert into public.genaan_business_settings(key,value)
select case key when 'contact_whatsapp' then 'whatsapp' when 'contact_email' then 'email' else 'phone' end, coalesce(value,'')
from public.settings where key in ('contact_whatsapp','contact_email','contact_phone') on conflict do nothing;
insert into public.genaan_business_settings(key) values ('whatsapp'),('email'),('phone') on conflict do nothing;
create table if not exists public.genaan_enquiries (
 id uuid primary key default gen_random_uuid(),request_id uuid unique not null,
 package_id uuid not null references public.genaan_packages(id) on delete restrict,
 package_snapshot jsonb not null,contact_name text not null,business_name text not null,phone text not null,
 business_type text not null check(business_type in ('clinic','restaurant','hotel','supermarket','office','other')),
 area numeric not null check(area between 1 and 100000),address text not null,notes text not null default '',
 status text not null default 'new' check(status in ('new','contacted','quoted','confirmed','completed','closed')),
 admin_notes text not null default '',created_at timestamptz not null default now()
);
create index if not exists genaan_enquiries_created on public.genaan_enquiries(created_at desc);
create index if not exists genaan_enquiries_phone_created on public.genaan_enquiries(phone,created_at desc);
create index if not exists genaan_enquiries_package_id on public.genaan_enquiries(package_id);
alter table public.genaan_packages enable row level security;
alter table public.genaan_business_settings enable row level security;
alter table public.genaan_enquiries enable row level security;
revoke all on public.genaan_packages,public.genaan_business_settings,public.genaan_enquiries from anon,authenticated;
grant select on public.genaan_packages,public.genaan_business_settings to anon,authenticated;
grant insert,update,delete on public.genaan_packages to authenticated;
grant insert,update on public.genaan_business_settings to authenticated;
grant select on public.genaan_enquiries to authenticated;
grant update(status,admin_notes) on public.genaan_enquiries to authenticated;
grant all on public.genaan_packages,public.genaan_business_settings,public.genaan_enquiries to service_role;
create policy genaan_packages_read on public.genaan_packages for select to anon,authenticated using(is_active or exists(select 1 from public.genaan_admins where user_id=(select auth.uid())));
create policy genaan_packages_admin on public.genaan_packages for all to authenticated using(exists(select 1 from public.genaan_admins where user_id=(select auth.uid()))) with check(exists(select 1 from public.genaan_admins where user_id=(select auth.uid())));
create policy genaan_settings_read on public.genaan_business_settings for select to anon,authenticated using(true);
create policy genaan_settings_admin on public.genaan_business_settings for all to authenticated using(exists(select 1 from public.genaan_admins where user_id=(select auth.uid()))) with check(exists(select 1 from public.genaan_admins where user_id=(select auth.uid())));
create policy genaan_enquiries_read on public.genaan_enquiries for select to authenticated using(exists(select 1 from public.genaan_admins where user_id=(select auth.uid())));
create policy genaan_enquiries_admin on public.genaan_enquiries for update to authenticated using(exists(select 1 from public.genaan_admins where user_id=(select auth.uid()))) with check(exists(select 1 from public.genaan_admins where user_id=(select auth.uid())));

-- Invoker function; executable only by the trusted Edge Function service role.
-- Lock per phone prevents concurrent requests from bypassing rate limits.
create or replace function public.submit_genaan_enquiry(p_request_id uuid,p_package_id uuid,p_name text,p_business text,p_phone text,p_type text,p_area numeric,p_address text,p_notes text)
returns uuid language plpgsql set search_path='' as $$
declare result_id uuid; snapshot jsonb;
begin
 if length(trim(p_name)) not between 1 and 120 or length(trim(p_business)) not between 1 and 160
 or p_phone !~ '^[1-9][0-9]{7,14}$' or p_area not between 1 and 100000 or length(trim(p_address)) not between 1 and 500 or length(p_notes)>1500 then raise exception 'Invalid enquiry'; end if;
 perform pg_advisory_xact_lock(hashtextextended(p_phone,0));
 select id into result_id from public.genaan_enquiries where request_id=p_request_id and phone=p_phone;
 if result_id is not null then return result_id; end if;
 if (select count(*) from public.genaan_enquiries where phone=p_phone and created_at>now()-interval '1 hour')>=3
 or (select count(*) from public.genaan_enquiries where created_at>now()-interval '1 day')>=1000 then raise exception 'Too many requests'; end if;
 select jsonb_build_object('name_en',name_en,'name_ar',name_ar,'plant_count',plant_count,'price',price,'area_min',area_min,'area_max',area_max,'includes_en',includes_en,'includes_ar',includes_ar)
 into snapshot from public.genaan_packages where id=p_package_id and is_active;
 if snapshot is null then raise exception 'Package unavailable'; end if;
 insert into public.genaan_enquiries(request_id,package_id,package_snapshot,contact_name,business_name,phone,business_type,area,address,notes)
 values(p_request_id,p_package_id,snapshot,trim(p_name),trim(p_business),p_phone,p_type,p_area,trim(p_address),p_notes) returning id into result_id;
 return result_id;
end; $$;
revoke all on function public.submit_genaan_enquiry(uuid,uuid,text,text,text,text,numeric,text,text) from public,anon,authenticated;
grant execute on function public.submit_genaan_enquiry(uuid,uuid,text,text,text,text,numeric,text,text) to service_role;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('genaan-packages','genaan-packages',true,5242880,array['image/jpeg','image/png','image/webp','image/avif']) on conflict(id) do nothing;
create policy genaan_package_images_read on storage.objects for select to anon,authenticated using(bucket_id='genaan-packages');
create policy genaan_package_images_admin on storage.objects for all to authenticated using(bucket_id='genaan-packages' and exists(select 1 from public.genaan_admins where user_id=(select auth.uid()))) with check(bucket_id='genaan-packages' and exists(select 1 from public.genaan_admins where user_id=(select auth.uid())));

insert into public.genaan_packages(slug,name_en,name_ar,description_en,description_ar,plant_count,area_min,area_max,price,image_url,includes_en,includes_ar,business_types,care_en,care_ar,is_active,is_featured,sort_order) values
('green-corner','Green Corner','ركن أخضر','A considered first touch of greenery for reception desks and small waiting rooms.','لمسة خضراء موزعة بعناية للاستقبال وغرف الانتظار الصغيرة.',5,15,30,null,'/assets/hero_image.png',array['1 floor plant + 4 tabletop plants','5 coordinated pots','Placement plan and care guide']::text[],array['نبات أرضي + ٤ نباتات مكتبية','٥ أصص متناسقة','خطة توزيع ودليل عناية']::text[],array['clinic','office']::text[],'Low-maintenance selection; optional monthly care.','اختيارات سهلة العناية؛ صيانة شهرية اختيارية.',true,false,1),
('welcoming-space','Welcoming Space','مساحة ترحيب','Create a calm arrival experience across a clinic, office or neighbourhood café.','استقبال مريح للعيادات والمكاتب والكافيهات الصغيرة.',10,30,60,null,'/assets/hero_image.png',array['3 floor plants + 7 tabletop plants','10 coordinated pots','Reception and seating layout']::text[],array['٣ نباتات أرضية + ٧ نباتات مكتبية','١٠ أصص متناسقة','توزيع للاستقبال ومناطق الجلوس']::text[],array['clinic','restaurant','office']::text[],'Care schedule tailored to light and opening hours.','جدول عناية مناسب للإضاءة ومواعيد العمل.',true,false,2),
('living-business','Living Business','نشاط ينبض بالحياة','A balanced mix of statement plants and small accents for busier commercial spaces.','مزيج من النباتات البارزة واللمسات الصغيرة للمساحات التجارية المتوسطة.',18,60,100,null,'/assets/hero_image.png',array['6 floor plants + 12 accent plants','18 coordinated pots','Zoning for entrances, corners and seating']::text[],array['٦ نباتات أرضية + ١٢ نباتًا للمسات الديكور','١٨ أصيصًا متناسقًا','توزيع للمداخل والأركان والجلوس']::text[],array['restaurant','supermarket','clinic','office']::text[],'Optional monthly maintenance quoted separately.','صيانة شهرية اختيارية بعرض سعر منفصل.',true,true,3),
('signature-space','Signature Space','مساحة مميزة','A cohesive green identity for a restaurant, larger store or boutique hotel lobby.','هوية خضراء متكاملة للمطاعم والمحلات الكبيرة واستقبال الفنادق الصغيرة.',30,100,180,null,'/assets/hero_image.png',array['10 floor plants + 20 accent plants','30 coordinated pots','Layout proposal for multiple zones']::text[],array['١٠ نباتات أرضية + ٢٠ نباتًا للديكور','٣٠ أصيصًا متناسقًا','اقتراح توزيع لعدة مناطق']::text[],array['restaurant','hotel','supermarket','office']::text[],'Maintenance and replacement options available in the quote.','خيارات الصيانة والاستبدال تُحدد في عرض السعر.',true,false,4),
('green-destination','Green Destination','وجهة خضراء','A larger planting concept for hotel common areas and expansive commercial floors.','تصور نباتي للمناطق المشتركة بالفنادق والمساحات التجارية الواسعة.',50,180,300,null,'/assets/hero_image.png',array['18 floor plants + 32 accent plants','50 coordinated pots','Multi-zone planting and care proposal']::text[],array['١٨ نباتًا أرضيًا + ٣٢ نباتًا للديكور','٥٠ أصيصًا متناسقًا','اقتراح توزيع وعناية لعدة مناطق']::text[],array['hotel','supermarket','restaurant','office']::text[],'Scheduled care can be included in a separate service agreement.','يمكن إضافة زيارات عناية باتفاق خدمة منفصل.',true,false,5)
on conflict(slug) do nothing;
commit;
