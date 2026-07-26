-- ZEN AI World public Site Studio.
-- This is intentionally separate from public.content_overrides, which remains
-- the protected course-curriculum content boundary.

create table public.site_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  status text not null default 'draft',
  draft_document jsonb not null
    default '{"schemaVersion":1,"title":"Untitled page","summary":"","layout":"editorial","seo":{},"blocks":[]}'::jsonb,
  archived_at timestamptz,
  created_by uuid default auth.uid(),
  updated_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_pages_slug_check check (
    char_length(slug) between 1 and 120
    and slug = lower(slug)
    and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  ),
  constraint site_pages_status_check check (
    status in ('draft', 'published', 'archived')
  ),
  constraint site_pages_archive_state_check check (
    (status = 'archived') = (archived_at is not null)
  ),
  constraint site_pages_draft_document_check check (
    jsonb_typeof(draft_document) = 'object'
    and draft_document ? 'blocks'
    and jsonb_typeof(draft_document -> 'blocks') = 'array'
  )
);

create table public.site_revisions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null
    references public.site_pages(id) on delete cascade,
  version bigint not null check (version > 0),
  slug text not null,
  document jsonb not null,
  published_by uuid default auth.uid(),
  published_at timestamptz not null default now(),
  constraint site_revisions_page_version_key unique (page_id, version),
  constraint site_revisions_page_id_id_key unique (page_id, id),
  constraint site_revisions_document_check check (
    jsonb_typeof(document) = 'object'
    and document ? 'blocks'
    and jsonb_typeof(document -> 'blocks') = 'array'
  )
);

create table public.site_publications (
  page_id uuid primary key
    references public.site_pages(id) on delete cascade,
  revision_id uuid not null,
  slug text not null unique,
  document jsonb not null,
  is_active boolean not null default true,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_publications_revision_fk
    foreign key (page_id, revision_id)
    references public.site_revisions(page_id, id)
    on delete restrict,
  constraint site_publications_document_check check (
    jsonb_typeof(document) = 'object'
    and document ? 'blocks'
    and jsonb_typeof(document -> 'blocks') = 'array'
  )
);

create index site_pages_status_updated_idx
  on public.site_pages (status, updated_at desc);

create index site_revisions_page_history_idx
  on public.site_revisions (page_id, version desc);

create index site_publications_active_idx
  on public.site_publications (published_at desc)
  where is_active;

create trigger site_pages_set_updated_at
before update on public.site_pages
for each row execute function public.set_updated_at();

create trigger site_publications_set_updated_at
before update on public.site_publications
for each row execute function public.set_updated_at();

alter table public.site_pages enable row level security;
alter table public.site_revisions enable row level security;
alter table public.site_publications enable row level security;

revoke all on table public.site_pages from public, anon, authenticated;
revoke all on table public.site_revisions from public, anon, authenticated;
revoke all on table public.site_publications from public, anon, authenticated;

grant select on table public.site_pages to authenticated;
grant select on table public.site_revisions to authenticated;
grant select on table public.site_publications to anon, authenticated;

grant all on table public.site_pages to service_role;
grant all on table public.site_revisions to service_role;
grant all on table public.site_publications to service_role;

create policy "zen admins read site pages"
on public.site_pages
for select
to authenticated
using ((select public.is_zen_admin()));

create policy "zen admins read site revisions"
on public.site_revisions
for select
to authenticated
using ((select public.is_zen_admin()));

create policy "public reads active site publications"
on public.site_publications
for select
to anon, authenticated
using (is_active);

create policy "zen admins read all site publications"
on public.site_publications
for select
to authenticated
using ((select public.is_zen_admin()));

create or replace function public.create_site_page(
  _slug text,
  _document jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_page_id uuid;
begin
  if not public.is_zen_admin() then
    raise exception 'ZEN administrator access is required';
  end if;

  insert into public.site_pages (
    slug,
    draft_document,
    created_by,
    updated_by
  )
  values (
    lower(btrim(_slug)),
    _document,
    (select auth.uid()),
    (select auth.uid())
  )
  returning id into new_page_id;

  return new_page_id;
end;
$$;

create or replace function public.rename_site_page(
  _page_id uuid,
  _slug text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_zen_admin() then
    raise exception 'ZEN administrator access is required';
  end if;

  update public.site_pages
  set
    slug = lower(btrim(_slug)),
    updated_by = (select auth.uid())
  where id = _page_id;

  if not found then
    raise exception 'Site page not found';
  end if;

  return _page_id;
end;
$$;

create or replace function public.save_site_page_draft(
  _page_id uuid,
  _document jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_zen_admin() then
    raise exception 'ZEN administrator access is required';
  end if;

  update public.site_pages
  set
    draft_document = _document,
    updated_by = (select auth.uid()),
    status = case when status = 'archived' then 'draft' else status end,
    archived_at = null
  where id = _page_id;

  if not found then
    raise exception 'Site page not found';
  end if;

  return _page_id;
end;
$$;

create or replace function public.publish_site_page(_page_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  page_record public.site_pages%rowtype;
  next_version bigint;
  new_revision_id uuid;
begin
  if not public.is_zen_admin() then
    raise exception 'ZEN administrator access is required';
  end if;

  select *
  into page_record
  from public.site_pages
  where id = _page_id
  for update;

  if page_record.id is null then
    raise exception 'Site page not found';
  end if;

  select coalesce(max(version), 0) + 1
  into next_version
  from public.site_revisions
  where page_id = _page_id;

  insert into public.site_revisions (
    page_id,
    version,
    slug,
    document,
    published_by
  )
  values (
    page_record.id,
    next_version,
    page_record.slug,
    page_record.draft_document,
    (select auth.uid())
  )
  returning id into new_revision_id;

  insert into public.site_publications (
    page_id,
    revision_id,
    slug,
    document,
    is_active,
    published_at
  )
  values (
    page_record.id,
    new_revision_id,
    page_record.slug,
    page_record.draft_document,
    true,
    now()
  )
  on conflict (page_id) do update
  set
    revision_id = excluded.revision_id,
    slug = excluded.slug,
    document = excluded.document,
    is_active = true,
    published_at = excluded.published_at;

  update public.site_pages
  set
    status = 'published',
    archived_at = null,
    updated_by = (select auth.uid())
  where id = page_record.id;

  return new_revision_id;
end;
$$;

create or replace function public.archive_site_page(_page_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_zen_admin() then
    raise exception 'ZEN administrator access is required';
  end if;

  update public.site_pages
  set
    status = 'archived',
    archived_at = now(),
    updated_by = (select auth.uid())
  where id = _page_id;

  if not found then
    raise exception 'Site page not found';
  end if;

  update public.site_publications
  set is_active = false
  where page_id = _page_id;

  return _page_id;
end;
$$;

create or replace function public.restore_site_page(_page_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_zen_admin() then
    raise exception 'ZEN administrator access is required';
  end if;

  update public.site_publications
  set is_active = true
  where page_id = _page_id;

  if not found then
    raise exception 'This page has no published revision to restore';
  end if;

  update public.site_pages
  set
    status = 'published',
    archived_at = null,
    updated_by = (select auth.uid())
  where id = _page_id;

  return _page_id;
end;
$$;

create or replace function public.restore_site_revision(_revision_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  revision_record public.site_revisions%rowtype;
begin
  if not public.is_zen_admin() then
    raise exception 'ZEN administrator access is required';
  end if;

  select *
  into revision_record
  from public.site_revisions
  where id = _revision_id;

  if revision_record.id is null then
    raise exception 'Site revision not found';
  end if;

  update public.site_pages
  set
    draft_document = revision_record.document,
    updated_by = (select auth.uid()),
    status = case when status = 'archived' then 'draft' else status end,
    archived_at = null
  where id = revision_record.page_id;

  return revision_record.page_id;
end;
$$;

revoke all on function public.create_site_page(text, jsonb) from public, anon;
revoke all on function public.rename_site_page(uuid, text) from public, anon;
revoke all on function public.save_site_page_draft(uuid, jsonb) from public, anon;
revoke all on function public.publish_site_page(uuid) from public, anon;
revoke all on function public.archive_site_page(uuid) from public, anon;
revoke all on function public.restore_site_page(uuid) from public, anon;
revoke all on function public.restore_site_revision(uuid) from public, anon;

grant execute on function public.create_site_page(text, jsonb) to authenticated;
grant execute on function public.rename_site_page(uuid, text) to authenticated;
grant execute on function public.save_site_page_draft(uuid, jsonb) to authenticated;
grant execute on function public.publish_site_page(uuid) to authenticated;
grant execute on function public.archive_site_page(uuid) to authenticated;
grant execute on function public.restore_site_page(uuid) to authenticated;
grant execute on function public.restore_site_revision(uuid) to authenticated;

notify pgrst, 'reload schema';
