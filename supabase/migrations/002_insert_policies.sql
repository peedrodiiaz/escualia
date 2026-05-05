-- Cualquier usuario autenticado puede crear su propia escuela
create policy "Authenticated users can create a school"
  on public.schools for insert
  with check (auth.uid() = owner_id);

-- El owner puede insertar memberships en su propia escuela
create policy "Owner can insert memberships"
  on public.memberships for insert
  with check (
    exists (
      select 1 from public.schools
      where id = memberships.school_id
      and owner_id = auth.uid()
    )
  );
