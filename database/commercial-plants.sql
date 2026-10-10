begin;
create table public.genaan_plants (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null check(char_length(trim(name_ar)) between 1 and 120),
  name_en text not null check(char_length(trim(name_en)) between 1 and 120),
  image_url text not null check(char_length(image_url) between 1 and 1800 and image_url ~ '^(https://|/assets/)'),
  category text not null default 'plant' check(category in ('plant','palm')),
  is_active boolean not null default true,
  sort_order integer not null default 0 check(sort_order between 0 and 100000),
  created_at timestamptz not null default now()
);
alter table public.genaan_plants enable row level security;
revoke all on public.genaan_plants from anon,authenticated;
grant select on public.genaan_plants to anon,authenticated;
grant insert,update,delete on public.genaan_plants to authenticated;
grant all on public.genaan_plants to service_role;
create policy genaan_plants_public_read on public.genaan_plants for select to anon,authenticated using(is_active);
create policy genaan_plants_admin on public.genaan_plants for all to authenticated
using(exists(select 1 from public.genaan_admins where user_id=(select auth.uid())))
with check(exists(select 1 from public.genaan_admins where user_id=(select auth.uid())));
create index genaan_plants_display on public.genaan_plants(is_active,sort_order,created_at);
-- Preserve the 17 existing gallery entries once; database records are authoritative afterwards.
insert into public.genaan_plants(name_ar,name_en,image_url,category,is_active,sort_order) values
('أجلونيما','Aglaonema','https://images.unsplash.com/photo-1620803366004-119b57f54cd6?auto=format&fit=max&w=1200&q=80','plant',true,1),
('شيفليرا ارتفاع متر','1 metre Schefflera','https://images.unsplash.com/photo-1747641567564-e318a88cf1b0?auto=format&fit=max&w=1200&q=80','plant',true,2),
('كلاسيا','Clusia','https://images.unsplash.com/photo-1682414270154-15ea28c62554?auto=format&fit=max&w=1200&q=80','plant',true,3),
('ديفنباخيا','Dieffenbachia','https://images.unsplash.com/photo-1695952835952-f8975fbb28ec?auto=format&fit=max&w=1200&q=80','plant',true,4),
('زنبق السلام','Peace lily','https://images.unsplash.com/photo-1575805501150-e064fbd815dd?auto=format&fit=max&w=1200&q=80','plant',true,5),
('فوجير','Fern','https://images.unsplash.com/photo-1520599829573-20c1b374c0a4?auto=format&fit=max&w=1200&q=80','plant',true,6),
('إمبريال','Imperial','https://images.unsplash.com/photo-1630393178216-7a0bd27bc990?auto=format&fit=max&w=1200&q=80','plant',true,7),
('ببروميا خضراء','Green Peperomia','https://images.unsplash.com/photo-1631038093177-b709a7048b44?auto=format&fit=max&w=1200&q=80','plant',true,8),
('سانسيفيريا (تعبان)','Snake plant','https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?auto=format&fit=max&w=1200&q=80','plant',true,9),
('ألوكاسيا','Alocasia','https://images.unsplash.com/photo-1757912157676-590e84bfd5ea?auto=format&fit=max&w=1200&q=80','plant',true,10),
('سنجونيوم','Syngonium','https://images.unsplash.com/photo-1688370180849-a7c39f49edf1?auto=format&fit=max&w=1200&q=80','plant',true,11),
('بوتس إنجوي معلّق','Hanging N''Joy Pothos','https://images.unsplash.com/photo-1579834873725-bef2c4c3ed84?auto=format&fit=max&w=1200&q=80','plant',true,12),
('نخيل أريكا','Areca palm','https://images.unsplash.com/photo-1696339565183-8f17a4b029bb?auto=format&fit=max&w=1200&q=80','palm',true,13),
('نخيل شمدوريا','Chamaedorea palm','https://images.unsplash.com/photo-1745327656782-30099136da9c?auto=format&fit=max&w=1200&q=80','palm',true,14),
('نخيل رابس','Rhapis palm','https://images.unsplash.com/photo-1648806091298-463d085ad8b1?auto=format&fit=max&w=1200&q=80','palm',true,15),
('نخيل ماجستي','Majesty palm','https://images.unsplash.com/photo-1536008905557-cc918940960c?auto=format&fit=max&w=1200&q=80','palm',true,16),
('نخيل ذيل السمكة','Fishtail palm','https://images.unsplash.com/photo-1589449104511-b2c8a9e1b7f6?auto=format&fit=max&w=1200&q=80','palm',true,17);
commit;
