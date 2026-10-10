-- Existing policies use these helpers. Membership is immutable from public clients.
-- Invoker functions enforce RLS and never inspect user-editable JWT metadata.
create or replace function public.is_admin() returns boolean
language sql stable security invoker set search_path='' as $$
 select auth.uid() is not null and exists(select 1 from public.genaan_admins where user_id=auth.uid());
$$;
create or replace function public.check_user_is_admin(user_id uuid) returns boolean
language sql stable security invoker set search_path='' as $$
 select auth.uid() is not null and user_id=auth.uid() and exists(select 1 from public.genaan_admins a where a.user_id=auth.uid());
$$;
alter function public.toggle_space_like(integer) set search_path='public';
alter function public.set_consultation_requests_updated_at() set search_path='public';
revoke execute on function public.toggle_space_like(integer) from public,anon,authenticated;
