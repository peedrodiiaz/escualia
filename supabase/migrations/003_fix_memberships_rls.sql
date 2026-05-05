-- Fix: infinite recursion in memberships SELECT policy
-- The old policy queried memberships from within memberships → infinite loop.
-- New approach: a user can see a membership row if it's their own row,
-- OR if they are the owner of the school (via schools.owner_id).
-- This avoids any self-referential subquery on memberships.

drop policy if exists "Members can view memberships of their school" on public.memberships;

create policy "Members can view memberships of their school"
  on public.memberships for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.schools
      where schools.id = memberships.school_id
        and schools.owner_id = auth.uid()
    )
  );
