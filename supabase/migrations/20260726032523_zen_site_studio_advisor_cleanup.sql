drop policy if exists "public reads active site publications"
  on public.site_publications;

drop policy if exists "zen admins read all site publications"
  on public.site_publications;

create policy "anonymous reads active site publications"
  on public.site_publications
  for select
  to anon
  using (is_active);

create policy "signed in users read active or admin site publications"
  on public.site_publications
  for select
  to authenticated
  using (is_active or (select public.is_zen_admin()));

create index if not exists site_publications_revision_idx
  on public.site_publications (page_id, revision_id);

notify pgrst, 'reload schema';
