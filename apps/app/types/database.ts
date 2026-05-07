export type UserRole = "admin" | "instructor" | "student";

export type Database = {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string;
          name: string;
          slug: string;
          owner_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          owner_id: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
        };
      };
      memberships: {
        Row: {
          id: string;
          school_id: string;
          user_id: string;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          user_id: string;
          role: UserRole;
          created_at?: string;
        };
        Update: {
          role?: UserRole;
        };
      };
      students: {
        Row: {
          id: string;
          school_id: string;
          user_id: string | null;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          dni: string | null;
          status: "active" | "inactive" | "passed" | "failed";
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          user_id?: string | null;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          dni?: string | null;
          status?: "active" | "inactive" | "passed" | "failed";
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          dni?: string | null;
          status?: "active" | "inactive" | "passed" | "failed";
          notes?: string | null;
        };
      };
      invitations: {
        Row: {
          id: string;
          school_id: string;
          email: string;
          token: string;
          role: "instructor" | "admin";
          invited_by: string;
          status: "pending" | "accepted" | "revoked";
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          email: string;
          token?: string;
          role?: "instructor" | "admin";
          invited_by: string;
          status?: "pending" | "accepted" | "revoked";
          expires_at?: string;
          created_at?: string;
        };
        Update: {
          status?: "pending" | "accepted" | "revoked";
        };
      };
      classes: {
        Row: {
          id: string;
          school_id: string;
          instructor_id: string;
          student_id: string | null;
          start_time: string;
          duration_minutes: number;
          lesson_type: "práctica" | "teoría";
          status: "available" | "booked" | "completed" | "cancelled";
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          instructor_id: string;
          student_id?: string | null;
          start_time: string;
          duration_minutes?: number;
          lesson_type?: "práctica" | "teoría";
          status?: "available" | "booked" | "completed" | "cancelled";
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          student_id?: string | null;
          start_time?: string;
          duration_minutes?: number;
          lesson_type?: "práctica" | "teoría";
          status?: "available" | "booked" | "completed" | "cancelled";
          notes?: string | null;
        };
      };
      invoices: {
        Row: {
          id: string;
          school_id: string;
          student_id: string;
          number: string;
          status: "pending" | "paid" | "overdue" | "cancelled";
          issue_date: string;
          due_date: string | null;
          subtotal_cents: number;
          tax_rate: 0 | 10 | 21;
          tax_cents: number;
          total_cents: number;
          notes: string | null;
          payment_method: "cash" | "transfer" | "card" | null;
          paid_at: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          student_id: string;
          number: string;
          status?: "pending" | "paid" | "overdue" | "cancelled";
          issue_date?: string;
          due_date?: string | null;
          subtotal_cents: number;
          tax_rate?: 0 | 10 | 21;
          tax_cents: number;
          total_cents: number;
          notes?: string | null;
          payment_method?: "cash" | "transfer" | "card" | null;
          paid_at?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: {
          status?: "pending" | "paid" | "overdue" | "cancelled";
          due_date?: string | null;
          notes?: string | null;
          payment_method?: "cash" | "transfer" | "card" | null;
          paid_at?: string | null;
          subtotal_cents?: number;
          tax_rate?: 0 | 10 | 21;
          tax_cents?: number;
          total_cents?: number;
        };
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          school_id: string;
          description: string;
          quantity: number;
          unit_price_cents: number;
          total_cents: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          school_id: string;
          description: string;
          quantity: number;
          unit_price_cents: number;
          total_cents: number;
          created_at?: string;
        };
        Update: {
          description?: string;
          quantity?: number;
          unit_price_cents?: number;
          total_cents?: number;
        };
      };
      questions: {
        Row: {
          id: string;
          external_id: string;
          category: string;
          subcategory: string | null;
          text: string;
          image_url: string | null;
          option_a: string;
          option_b: string;
          option_c: string;
          correct_option: "a" | "b" | "c";
          created_at: string;
        };
        Insert: {
          id?: string;
          external_id: string;
          category: string;
          subcategory?: string | null;
          text: string;
          image_url?: string | null;
          option_a: string;
          option_b: string;
          option_c: string;
          correct_option: "a" | "b" | "c";
          created_at?: string;
        };
        Update: {
          subcategory?: string | null;
          text?: string;
          image_url?: string | null;
          option_a?: string;
          option_b?: string;
          option_c?: string;
          correct_option?: "a" | "b" | "c";
        };
      };
      test_sessions: {
        Row: {
          id: string;
          school_id: string;
          student_id: string;
          mode: "practice" | "exam";
          status: "in_progress" | "completed" | "abandoned";
          total_questions: number;
          correct_count: number;
          incorrect_count: number;
          unanswered_count: number;
          score_pct: number | null;
          passed: boolean | null;
          started_at: string;
          finished_at: string | null;
          time_limit_secs: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          student_id: string;
          mode: "practice" | "exam";
          status?: "in_progress" | "completed" | "abandoned";
          total_questions: number;
          correct_count?: number;
          incorrect_count?: number;
          unanswered_count?: number;
          score_pct?: number | null;
          passed?: boolean | null;
          started_at?: string;
          finished_at?: string | null;
          time_limit_secs?: number | null;
          created_at?: string;
        };
        Update: {
          status?: "in_progress" | "completed" | "abandoned";
          correct_count?: number;
          incorrect_count?: number;
          unanswered_count?: number;
          score_pct?: number | null;
          passed?: boolean | null;
          finished_at?: string | null;
        };
      };
      test_answers: {
        Row: {
          id: string;
          session_id: string;
          school_id: string;
          student_id: string;
          question_id: string;
          chosen_option: "a" | "b" | "c" | null;
          is_correct: boolean | null;
          answered_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          school_id: string;
          student_id: string;
          question_id: string;
          chosen_option?: "a" | "b" | "c" | null;
          is_correct?: boolean | null;
          answered_at?: string | null;
          created_at?: string;
        };
        Update: {
          chosen_option?: "a" | "b" | "c" | null;
          is_correct?: boolean | null;
          answered_at?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_random_questions: {
        Args: { p_category: string; p_count: number };
        Returns: string[];
      };
    };
    Enums: {
      user_role: UserRole;
    };
  };
};

export type InvoiceRow = Database["public"]["Tables"]["invoices"]["Row"];
export type InvoiceItemRow = Database["public"]["Tables"]["invoice_items"]["Row"];

export type InvoiceWithItems = InvoiceRow & {
  items: InvoiceItemRow[];
  student: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    dni: string | null;
  };
};

export type QuestionRow = Database["public"]["Tables"]["questions"]["Row"];
export type TestSessionRow = Database["public"]["Tables"]["test_sessions"]["Row"];
export type TestAnswerRow = Database["public"]["Tables"]["test_answers"]["Row"];

export type TestMode = "practice" | "exam";
export type SessionStatus = "in_progress" | "completed" | "abandoned";
export type AnswerOption = "a" | "b" | "c";

export type SessionWithAnswers = TestSessionRow & {
  test_answers: (TestAnswerRow & {
    questions: QuestionRow;
  })[];
};

export type StudentTestSummary = {
  totalSessions: number;
  totalExams: number;
  passedExams: number;
  avgScorePct: number;
  recentSessions: TestSessionRow[];
  mostFailedQuestions: {
    question: QuestionRow;
    failCount: number;
  }[];
};
