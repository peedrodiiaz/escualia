-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- SCHOOLS — cada autoescuela es un tenant
-- ============================================================
create table if not exists public.schools (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  owner_id   uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ============================================================
-- MEMBERSHIPS — qué rol tiene cada usuario en cada escuela
-- ============================================================
create type public.user_role as enum ('admin', 'instructor', 'student');

create table if not exists public.memberships (
  id         uuid primary key default gen_random_uuid(),
  school_id  uuid not null references public.schools(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       public.user_role not null default 'student',
  created_at timestamptz not null default now(),
  unique(school_id, user_id)
);

-- ============================================================
-- STUDENTS — ficha del alumno
-- ============================================================
create table if not exists public.students (
  id         uuid primary key default gen_random_uuid(),
  school_id  uuid not null references public.schools(id) on delete cascade,
  user_id    uuid references auth.users(id) on delete set null,
  first_name text not null,
  last_name  text not null,
  email      text not null,
  phone      text,
  dni        text,
  status     text not null default 'active'
             check (status in ('active','inactive','passed','failed')),
  notes      text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.schools     enable row level security;
alter table public.memberships enable row level security;
alter table public.students    enable row level security;

-- Schools: visible solo a miembros
create policy "Members can view their school"
  on public.schools for select
  using (
    exists (
      select 1 from public.memberships
      where school_id = schools.id
      and user_id = auth.uid()
    )
  );

-- Memberships: visible solo a miembros de la misma escuela
create policy "Members can view memberships of their school"
  on public.memberships for select
  using (
    exists (
      select 1 from public.memberships m2
      where m2.school_id = memberships.school_id
      and m2.user_id = auth.uid()
    )
  );

-- Students: visible solo a admin e instructores de la escuela
create policy "Admin and instructors can view students"
  on public.students for select
  using (
    exists (
      select 1 from public.memberships
      where school_id = students.school_id
      and user_id = auth.uid()
      and role in ('admin', 'instructor')
    )
  );

create policy "Admin can insert students"
  on public.students for insert
  with check (
    exists (
      select 1 from public.memberships
      where school_id = students.school_id
      and user_id = auth.uid()
      and role = 'admin'
    )
  );

create policy "Admin can update students"
  on public.students for update
  using (
    exists (
      select 1 from public.memberships
      where school_id = students.school_id
      and user_id = auth.uid()
      and role = 'admin'
    )
  );

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_memberships_user_id   on public.memberships(user_id);
create index if not exists idx_memberships_school_id on public.memberships(school_id);
create index if not exists idx_students_school_id    on public.students(school_id);
