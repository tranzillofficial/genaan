-- Public contact setting; existing administrator-only write policies remain unchanged.
alter table public.genaan_business_settings drop constraint if exists genaan_business_settings_key_check;
alter table public.genaan_business_settings add constraint genaan_business_settings_key_check
check(key in ('whatsapp','email','phone','instagram','care_biannual_price','care_quarterly_price'));
insert into public.genaan_business_settings(key,value)
select 'instagram', replace(value, 'http://', 'https://') from public.settings
where key = 'social_instagram' and value ~ '^https?://(www[.])?instagram[.]com/[^ ]+$'
on conflict (key) do nothing;
