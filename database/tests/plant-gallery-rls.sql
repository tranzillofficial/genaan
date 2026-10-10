-- Transactional permission and CRUD checks. No catalog changes remain after rollback.
begin;
select set_config('genaan.test_id', gen_random_uuid()::text, true);
select set_config('genaan.initial_count', (select count(*)::text from public.genaan_plants), true);
select set_config('genaan.test_admin_claims', json_build_object('sub',(select user_id from public.genaan_admins limit 1),'role','authenticated')::text,true);
select set_config('request.jwt.claims',current_setting('genaan.test_admin_claims'),true);
set local role authenticated;
do $$ begin
 insert into public.genaan_plants(id,name_ar,name_en,image_url,category,is_active,sort_order)
 values(current_setting('genaan.test_id')::uuid,'اختبار المعرض','Gallery QA','/assets/icon.png','plant',false,100000);
 update public.genaan_plants set name_en='Updated Gallery QA',category='palm',image_url='/assets/hero_image.png' where id=current_setting('genaan.test_id')::uuid;
 if not exists(select 1 from public.genaan_plants where id=current_setting('genaan.test_id')::uuid and name_en='Updated Gallery QA' and category='palm' and image_url='/assets/hero_image.png') then raise exception 'Admin create/update/read failed'; end if;
end $$;
reset role;
select set_config('request.jwt.claims','{"role":"anon"}',true);
set local role anon;
do $$ begin
 if exists(select 1 from public.genaan_plants where id=current_setting('genaan.test_id')::uuid) then raise exception 'Hidden row leaked to anon'; end if;
 begin insert into public.genaan_plants(name_ar,name_en,image_url) values('اختبار','QA','/assets/icon.png'); raise exception 'Anon insert allowed'; exception when insufficient_privilege then null; end;
 begin update public.genaan_plants set name_en='Unauthorized' where id=current_setting('genaan.test_id')::uuid; raise exception 'Anon update allowed'; exception when insufficient_privilege then null; end;
 begin delete from public.genaan_plants where id=current_setting('genaan.test_id')::uuid; raise exception 'Anon delete allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;
select set_config('request.jwt.claims',current_setting('genaan.test_admin_claims'),true);
set local role authenticated;
update public.genaan_plants set is_active=true where id=current_setting('genaan.test_id')::uuid;
reset role;
select set_config('request.jwt.claims','{"role":"anon"}',true);
set local role anon;
do $$ begin
 if not exists(select 1 from public.genaan_plants where id=current_setting('genaan.test_id')::uuid) then raise exception 'Active plant not publicly readable'; end if;
end $$;
reset role;
select set_config('request.jwt.claims',json_build_object('sub',gen_random_uuid(),'role','authenticated')::text,true);
set local role authenticated;
do $$ begin
 update public.genaan_plants set name_en='Unauthorized' where id=current_setting('genaan.test_id')::uuid;
 if found then raise exception 'Non-admin update allowed'; end if;
 delete from public.genaan_plants where id=current_setting('genaan.test_id')::uuid;
 if found then raise exception 'Non-admin delete allowed'; end if;
 begin insert into public.genaan_plants(name_ar,name_en,image_url) values('اختبار','QA','/assets/icon.png'); raise exception 'Non-admin insert allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;
select set_config('request.jwt.claims',current_setting('genaan.test_admin_claims'),true);
set local role authenticated;
do $$ begin
 delete from public.genaan_plants where id=current_setting('genaan.test_id')::uuid;
 if not found then raise exception 'Admin delete failed'; end if;
end $$;
reset role;
do $$ begin
 if (select count(*) from public.genaan_plants) <> current_setting('genaan.initial_count')::integer then raise exception 'Test changed catalog count'; end if;
end $$;
rollback;
select 'Admin CRUD, public visibility, anonymous and non-admin write denial: passed' as result;
