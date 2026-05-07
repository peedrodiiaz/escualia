-- ============================================================
-- INVOICES — facturas emitidas por la autoescuela a sus alumnos
-- ============================================================
create table if not exists public.invoices (
  id               uuid primary key default gen_random_uuid(),
  school_id        uuid not null references public.schools(id) on delete cascade,
  student_id       uuid not null references public.students(id) on delete restrict,
  number           text not null,
  status           text not null default 'pending'
                   check (status in ('pending', 'paid', 'overdue', 'cancelled')),
  issue_date       date not null default current_date,
  due_date         date,
  subtotal_cents   integer not null default 0,
  tax_rate         integer not null default 21
                   check (tax_rate in (0, 10, 21)),
  tax_cents        integer not null default 0,
  total_cents      integer not null default 0,
  notes            text,
  payment_method   text
                   check (payment_method in ('cash', 'transfer', 'card')),
  paid_at          timestamptz,
  created_by       uuid not null references auth.users(id),
  created_at       timestamptz not null default now(),
  unique (school_id, number)
);

-- ============================================================
-- INVOICE_ITEMS — líneas de cada factura
-- ============================================================
create table if not exists public.invoice_items (
  id                 uuid primary key default gen_random_uuid(),
  invoice_id         uuid not null references public.invoices(id) on delete cascade,
  school_id          uuid not null references public.schools(id) on delete cascade,
  description        text not null,
  quantity           integer not null default 1
                     check (quantity > 0),
  unit_price_cents   integer not null
                     check (unit_price_cents >= 0),
  total_cents        integer not null,
  created_at         timestamptz not null default now()
);

alter table public.invoices      enable row level security;
alter table public.invoice_items enable row level security;

-- ────────────────────────────────────────────────────────────
-- RLS: invoices
-- ────────────────────────────────────────────────────────────

create policy "Admin can select invoices"
  on public.invoices for select
  using (
    exists (
      select 1 from public.memberships
      where school_id = invoices.school_id
        and user_id = auth.uid()
        and role = 'admin'
    )
  );

create policy "Admin can insert invoices"
  on public.invoices for insert
  with check (
    exists (
      select 1 from public.memberships
      where school_id = invoices.school_id
        and user_id = auth.uid()
        and role = 'admin'
    )
  );

create policy "Admin can update invoices"
  on public.invoices for update
  using (
    exists (
      select 1 from public.memberships
      where school_id = invoices.school_id
        and user_id = auth.uid()
        and role = 'admin'
    )
  );

create policy "Admin can delete invoices"
  on public.invoices for delete
  using (
    exists (
      select 1 from public.memberships
      where school_id = invoices.school_id
        and user_id = auth.uid()
        and role = 'admin'
    )
  );

create policy "Student can select own invoices"
  on public.invoices for select
  using (
    student_id in (
      select id from public.students
      where user_id = auth.uid()
        and school_id = invoices.school_id
    )
  );

-- ────────────────────────────────────────────────────────────
-- RLS: invoice_items
-- ────────────────────────────────────────────────────────────

create policy "Admin can select invoice_items"
  on public.invoice_items for select
  using (
    exists (
      select 1 from public.memberships
      where school_id = invoice_items.school_id
        and user_id = auth.uid()
        and role = 'admin'
    )
  );

create policy "Admin can insert invoice_items"
  on public.invoice_items for insert
  with check (
    exists (
      select 1 from public.memberships
      where school_id = invoice_items.school_id
        and user_id = auth.uid()
        and role = 'admin'
    )
  );

create policy "Admin can delete invoice_items"
  on public.invoice_items for delete
  using (
    exists (
      select 1 from public.memberships
      where school_id = invoice_items.school_id
        and user_id = auth.uid()
        and role = 'admin'
    )
  );

create policy "Student can select own invoice_items"
  on public.invoice_items for select
  using (
    invoice_id in (
      select inv.id from public.invoices inv
      join public.students st on st.id = inv.student_id
      where st.user_id = auth.uid()
        and inv.school_id = invoice_items.school_id
    )
  );

-- ────────────────────────────────────────────────────────────
-- INDEXES
-- ────────────────────────────────────────────────────────────
create index if not exists idx_invoices_school_id    on public.invoices(school_id);
create index if not exists idx_invoices_student_id   on public.invoices(student_id);
create index if not exists idx_invoices_status       on public.invoices(status);
create index if not exists idx_invoices_number       on public.invoices(school_id, number);
create index if not exists idx_invoice_items_invoice on public.invoice_items(invoice_id);
create index if not exists idx_invoice_items_school  on public.invoice_items(school_id);
