-- Apply after commercial-backend.sql. Keep existing enquiries and admin access.
begin;
alter table public.genaan_packages add column if not exists is_custom boolean not null default false;
alter table public.genaan_packages drop constraint if exists genaan_packages_plant_count_check;
alter table public.genaan_packages add constraint genaan_packages_plant_count_check check ((not is_custom and plant_count between 1 and 10000) or (is_custom and plant_count=0));
alter table public.genaan_packages add constraint genaan_custom_quote_only check (not is_custom or price is null);
alter table public.genaan_business_settings drop constraint if exists genaan_business_settings_key_check;
alter table public.genaan_business_settings add constraint genaan_business_settings_key_check check(key in ('whatsapp','email','phone','care_biannual_price','care_quarterly_price'));
alter table public.genaan_business_settings add constraint genaan_care_setting_price check(key not in ('care_biannual_price','care_quarterly_price') or value ~ '^[0-9]{1,7}([.][0-9]{1,2})?$');
insert into public.genaan_business_settings(key,value) values('care_biannual_price','1200'),('care_quarterly_price','2200') on conflict do nothing;
alter table public.genaan_enquiries alter column area drop not null;
alter table public.genaan_enquiries add column if not exists city text not null default '';
alter table public.genaan_enquiries add column if not exists rooms integer check(rooms between 1 and 10000);
alter table public.genaan_enquiries add column if not exists care_plan text not null default 'none' check(care_plan in ('none','biannual','quarterly'));
alter table public.genaan_enquiries add column if not exists care_price numeric not null default 0 check(care_price between 0 and 10000000);

create or replace function public.submit_genaan_enquiry_v2(p_request_id uuid,p_package_id uuid,p_name text,p_business text,p_phone text,p_type text,p_area numeric,p_address text,p_notes text,p_city text,p_rooms integer,p_care_plan text)
returns uuid language plpgsql security invoker set search_path='' as $$
declare result_id uuid; snapshot jsonb; annual_price numeric:=0;
begin
 if p_request_id is null or p_package_id is null or p_name is null or p_business is null or p_phone is null
 or length(trim(p_name)) not between 1 and 120 or length(trim(p_business)) not between 1 and 160
 or p_phone !~ '^[1-9][0-9]{7,14}$' or (p_area is not null and p_area not between 1 and 100000)
 or (p_rooms is not null and p_rooms not between 1 and 10000)
 or coalesce(p_type,'') not in ('clinic','restaurant','hotel','supermarket','office','other')
 or coalesce(p_care_plan,'') not in ('none','biannual','quarterly')
 or p_city is null or length(p_city)>120 or p_address is null or length(p_address)>500
 or p_notes is null or length(p_notes)>1500 then raise exception 'Invalid enquiry'; end if;
 perform pg_advisory_xact_lock(hashtextextended(p_phone,0));
 select id into result_id from public.genaan_enquiries where request_id=p_request_id and phone=p_phone;
 if result_id is not null then return result_id; end if;
 if (select count(*) from public.genaan_enquiries where phone=p_phone and created_at>now()-interval '1 hour')>=3
 or (select count(*) from public.genaan_enquiries where created_at>now()-interval '1 day')>=1000 then raise exception 'Too many requests'; end if;
 select jsonb_build_object('name_en',name_en,'name_ar',name_ar,'is_custom',is_custom,'plant_count',plant_count,'price',price,'area_min',area_min,'area_max',area_max,'includes_en',includes_en,'includes_ar',includes_ar)
 into snapshot from public.genaan_packages where id=p_package_id and is_active;
 if snapshot is null then raise exception 'Package unavailable'; end if;
 if p_care_plan<>'none' then
  select value::numeric into annual_price from public.genaan_business_settings where key=case p_care_plan when 'quarterly' then 'care_quarterly_price' else 'care_biannual_price' end;
  if annual_price is null then raise exception 'Care plan unavailable'; end if;
 end if;
 insert into public.genaan_enquiries(request_id,package_id,package_snapshot,contact_name,business_name,phone,business_type,area,address,notes,city,rooms,care_plan,care_price)
 values(p_request_id,p_package_id,snapshot,trim(p_name),trim(p_business),p_phone,p_type,p_area,trim(p_address),p_notes,trim(p_city),p_rooms,p_care_plan,annual_price) returning id into result_id;
 return result_id;
end; $$;
revoke all on function public.submit_genaan_enquiry_v2(uuid,uuid,text,text,text,text,numeric,text,text,text,integer,text) from public,anon,authenticated;
grant execute on function public.submit_genaan_enquiry_v2(uuid,uuid,text,text,text,text,numeric,text,text,text,integer,text) to service_role;
-- Compatibility for old clients while the new release is being deployed.
create or replace function public.submit_genaan_enquiry(p_request_id uuid,p_package_id uuid,p_name text,p_business text,p_phone text,p_type text,p_area numeric,p_address text,p_notes text)
returns uuid language sql security invoker set search_path='' as $$
 select public.submit_genaan_enquiry_v2(p_request_id,p_package_id,p_name,p_business,p_phone,p_type,p_area,p_address,p_notes,'',null,'none');
$$;
revoke all on function public.submit_genaan_enquiry(uuid,uuid,text,text,text,text,numeric,text,text) from public,anon,authenticated;
grant execute on function public.submit_genaan_enquiry(uuid,uuid,text,text,text,text,numeric,text,text) to service_role;
commit;
