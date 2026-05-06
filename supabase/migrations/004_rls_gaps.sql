-- Migration: RLS gaps — DELETE en students, UPDATE/DELETE en memberships y schools

-- Students: solo admin puede eliminar alumnos de su escuela
CREATE POLICY "Admin can delete students"
  ON public.students FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE school_id = students.school_id
        AND user_id = auth.uid()
        AND role = 'admin'
    )
  );

-- Memberships: solo el owner puede actualizar roles en su escuela
CREATE POLICY "Owner can update memberships"
  ON public.memberships FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.schools
      WHERE schools.id = memberships.school_id
        AND schools.owner_id = auth.uid()
    )
  );

-- Memberships: solo el owner puede eliminar memberships de su escuela
CREATE POLICY "Owner can delete memberships"
  ON public.memberships FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.schools
      WHERE schools.id = memberships.school_id
        AND schools.owner_id = auth.uid()
    )
  );

-- Schools: solo el owner puede actualizar su escuela
CREATE POLICY "Owner can update their school"
  ON public.schools FOR UPDATE
  USING (owner_id = auth.uid());

-- Schools: solo el owner puede eliminar su escuela
CREATE POLICY "Owner can delete their school"
  ON public.schools FOR DELETE
  USING (owner_id = auth.uid());
