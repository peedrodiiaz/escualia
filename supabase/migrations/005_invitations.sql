-- ============================================================
-- INVITATIONS — invitaciones de instructores por email
-- ============================================================
create table if not exists public.invitations (
  id          uuid primary key default gen_random_uuid(),
  school_id   uuid not null references public.schools(id) on delete cascade,
  email       text not null,
  token       text not null unique default encode(gen_random_bytes(32), 'hex'),
  role        public.user_role not null default 'instructor',
  invited_by  uuid not null references auth.users(id) on delete cascade,
  status      text not null default 'pending'
              check (status in ('pending', 'accepted', 'revoked')),
  expires_at  timestamptz not null default now() + interval '7 days',
  created_at  timestamptz not null default now(),
  unique(school_id, email, status)
);

alter table public.invitations enable row level security;

-- Admins de la escuela pueden ver sus invitaciones
create policy "Admin can view invitations"
  on public.invitations for select
  using (
    exists (
      select 1 from public.memberships
      where school_id = invitations.school_id
        and user_id = auth.uid()
        and role = 'admin'
    )
  );

-- Admins pueden crear invitaciones
create policy "Admin can insert invitations"
  on public.invitations for insert
  with check (
    exists (
      select 1 from public.memberships
      where school_id = invitations.school_id
        and user_id = auth.uid()
        and role = 'admin'
    )
  );

-- Admins pueden actualizar invitaciones (revocar)
create policy "Admin can update invitations"
  on public.invitations for update
  using (
    exists (
      select 1 from public.memberships
      where school_id = invitations.school_id
        and user_id = auth.uid()
        and role = 'admin'
    )
  );

-- El usuario invitado puede leer su propia invitación por email
create policy "Invited user can read own invitation"
  on public.invitations for select
  using (email = (select email from auth.users where id = auth.uid()));

-- El usuario invitado puede aceptar su propia invitación
create policy "Invited user can accept own invitation"
  on public.invitations for update
  using (email = (select email from auth.users where id = auth.uid()));

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_invitations_school_id on public.invitations(school_id);
create index if not exists idx_invitations_token     on public.invitations(token);
create index if not exists idx_invitations_email     on public.invitations(email);
