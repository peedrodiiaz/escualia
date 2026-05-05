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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
    };
  };
};
