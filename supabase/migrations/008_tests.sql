-- questions: banco de preguntas DGT (datos globales, sin tenant)
CREATE TABLE public.questions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id    text UNIQUE NOT NULL,
  category       text NOT NULL,
  subcategory    text,
  text           text NOT NULL,
  image_url      text,
  option_a       text NOT NULL,
  option_b       text NOT NULL,
  option_c       text NOT NULL,
  correct_option text NOT NULL CHECK (correct_option IN ('a', 'b', 'c')),
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Cualquier usuario autenticado puede leer preguntas (dominio público DGT)
CREATE POLICY "Authenticated users can read questions"
  ON public.questions FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- test_sessions: una sesión = un test completo (por tenant)
CREATE TABLE public.test_sessions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id        uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id       uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  mode             text NOT NULL CHECK (mode IN ('practice', 'exam')),
  status           text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  total_questions  integer NOT NULL,
  correct_count    integer NOT NULL DEFAULT 0,
  incorrect_count  integer NOT NULL DEFAULT 0,
  unanswered_count integer NOT NULL DEFAULT 0,
  score_pct        numeric(5, 2),
  passed           boolean,
  started_at       timestamptz NOT NULL DEFAULT now(),
  finished_at      timestamptz,
  time_limit_secs  integer,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.test_sessions ENABLE ROW LEVEL SECURITY;

-- Alumno ve/crea/actualiza sus propias sesiones
CREATE POLICY "Student can select own sessions"
  ON public.test_sessions FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM public.students
      WHERE user_id = auth.uid() AND school_id = test_sessions.school_id
    )
  );

CREATE POLICY "Student can insert own sessions"
  ON public.test_sessions FOR INSERT
  WITH CHECK (
    student_id IN (
      SELECT id FROM public.students
      WHERE user_id = auth.uid() AND school_id = test_sessions.school_id
    )
  );

CREATE POLICY "Student can update own sessions"
  ON public.test_sessions FOR UPDATE
  USING (
    student_id IN (
      SELECT id FROM public.students
      WHERE user_id = auth.uid() AND school_id = test_sessions.school_id
    )
  );

-- Admin e instructor ven todas las sesiones de su escuela
CREATE POLICY "Admin and instructor can select school sessions"
  ON public.test_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE school_id = test_sessions.school_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'instructor')
    )
  );

-- test_answers: una fila por pregunta por sesión
CREATE TABLE public.test_answers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    uuid NOT NULL REFERENCES public.test_sessions(id) ON DELETE CASCADE,
  school_id     uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id    uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  question_id   uuid NOT NULL REFERENCES public.questions(id),
  chosen_option text CHECK (chosen_option IN ('a', 'b', 'c')),
  is_correct    boolean,
  answered_at   timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, question_id)
);

ALTER TABLE public.test_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Student can select own answers"
  ON public.test_answers FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM public.students
      WHERE user_id = auth.uid() AND school_id = test_answers.school_id
    )
  );

CREATE POLICY "Student can insert own answers"
  ON public.test_answers FOR INSERT
  WITH CHECK (
    student_id IN (
      SELECT id FROM public.students
      WHERE user_id = auth.uid() AND school_id = test_answers.school_id
    )
  );

CREATE POLICY "Student can update own answers"
  ON public.test_answers FOR UPDATE
  USING (
    student_id IN (
      SELECT id FROM public.students
      WHERE user_id = auth.uid() AND school_id = test_answers.school_id
    )
  );

CREATE POLICY "Admin and instructor can select school answers"
  ON public.test_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE school_id = test_answers.school_id
        AND user_id = auth.uid()
        AND role IN ('admin', 'instructor')
    )
  );

-- Índices
CREATE INDEX idx_questions_category        ON public.questions(category);
CREATE INDEX idx_questions_external_id     ON public.questions(external_id);
CREATE INDEX idx_test_sessions_school_id   ON public.test_sessions(school_id);
CREATE INDEX idx_test_sessions_student_id  ON public.test_sessions(student_id);
CREATE INDEX idx_test_sessions_status      ON public.test_sessions(status);
CREATE INDEX idx_test_sessions_started_at  ON public.test_sessions(started_at);
CREATE INDEX idx_test_answers_session_id   ON public.test_answers(session_id);
CREATE INDEX idx_test_answers_student_id   ON public.test_answers(student_id);
CREATE INDEX idx_test_answers_question_id  ON public.test_answers(question_id);

-- Función para selección aleatoria de preguntas (evita traer todo al cliente)
CREATE OR REPLACE FUNCTION public.get_random_questions(p_category text, p_count integer)
RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT id FROM public.questions
  WHERE category = p_category
  ORDER BY random()
  LIMIT p_count;
$$;
