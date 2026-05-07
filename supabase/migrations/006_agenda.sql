-- ============================================================
-- CLASSES — clases prácticas de la autoescuela
-- student_id NULL = disponible, con valor = reservada
-- ============================================================
create table if not exists public.classes (
  id               uuid primary key default gen_random_uuid(),
  school_id        uuid not null references public.schools(id) on delete cascade,
  instructor_id    uuid not null references auth.users(id) on delete cascade,
  student_id       uuid references public.students(id) on delete set null,
  start_time       timestamptz not null,
  duration_minutes integer not null default 60,
  lesson_type      text not null default 'práctica'
                   check (lesson_type in ('práctica', 'teoría')),
  status           text not null default 'available'
                   check (status in ('available', 'booked', 'completed', 'cancelled')),
  notes            text,
  created_at       timestamptz not null default now()
);

alter table public.classes enable row level security;

-- Admin e instructores de la escuela pueden ver todas las clases
create policy "Admin and instructors can view classes"
  on public.classes for select
  using (
    exists (
      select 1 from public.memberships
      where school_id = classes.school_id
        and user_id = auth.uid()
        and role in ('admin', 'instructor')
    )
  );

-- Alumnos solo ven las clases que tienen asignadas (via student.user_id)
create policy "Student can view own classes"
  on public.classes for select
  using (
    student_id in (
      select id from public.students
      where user_id = auth.uid()
        and school_id = classes.school_id
    )
  );

-- Admin e instructores pueden crear clases
create policy "Admin and instructors can insert classes"
  on public.classes for insert
  with check (
    exists (
      select 1 from public.memberships
      where school_id = classes.school_id
        and user_id = auth.uid()
        and role in ('admin', 'instructor')
    )
  );

-- Admin e instructores pueden actualizar clases
create policy "Admin and instructors can update classes"
  on public.classes for update
  using (
    exists (
      select 1 from public.memberships
      where school_id = classes.school_id
        and user_id = auth.uid()
        and role in ('admin', 'instructor')
    )
  );

-- Admin e instructores pueden eliminar clases
create policy "Admin and instructors can delete classes"
  on public.classes for delete
  using (
    exists (
      select 1 from public.memberships
      where school_id = classes.school_id
        and user_id = auth.uid()
        and role in ('admin', 'instructor')
    )
  );

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_classes_school_id     on public.classes(school_id);
create index if not exists idx_classes_instructor_id on public.classes(instructor_id);
create index if not exists idx_classes_student_id    on public.classes(student_id);
create index if not exists idx_classes_start_time    on public.classes(start_time);
