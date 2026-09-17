// Gerado a partir do schema real do Supabase (introspecção via pg) — Etapa 3/4.
// Reexecutar sempre que o schema mudar (gen-types.js).

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      appointment_status: {
        Row: {
          code: string;
          label: string;
          color: string | null;
          sort_order: number;
        };
        Insert: {
          code: string;
          label: string;
          color?: string | null;
          sort_order?: number;
        };
        Update: {
          code?: string;
          label?: string;
          color?: string | null;
          sort_order?: number;
        };
        Relationships: [
        ];
      };
      appointments: {
        Row: {
          id: string;
          patient_id: string;
          doctor_id: string;
          specialty_id: string | null;
          exam_id: string | null;
          type: AppointmentType;
          status_code: string;
          scheduled_at: string;
          duration_minutes: number;
          insurance_plan_id: string | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          doctor_id: string;
          specialty_id?: string | null;
          exam_id?: string | null;
          type?: AppointmentType;
          status_code?: string;
          scheduled_at: string;
          duration_minutes?: number;
          insurance_plan_id?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          doctor_id?: string;
          specialty_id?: string | null;
          exam_id?: string | null;
          type?: AppointmentType;
          status_code?: string;
          scheduled_at?: string;
          duration_minutes?: number;
          insurance_plan_id?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_doctor_id_fkey";
            columns: ["doctor_id"];
            isOneToOne: false;
            referencedRelation: "doctors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_specialty_id_fkey";
            columns: ["specialty_id"];
            isOneToOne: false;
            referencedRelation: "specialties";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_exam_id_fkey";
            columns: ["exam_id"];
            isOneToOne: false;
            referencedRelation: "exams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_status_code_fkey";
            columns: ["status_code"];
            isOneToOne: false;
            referencedRelation: "appointment_status";
            referencedColumns: ["code"];
          },
          {
            foreignKeyName: "appointments_insurance_plan_id_fkey";
            columns: ["insurance_plan_id"];
            isOneToOne: false;
            referencedRelation: "insurance_plans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      doctors: {
        Row: {
          id: string;
          user_id: string;
          crm: string;
          specialty_id: string | null;
          bio: string | null;
          photo_url: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          crm: string;
          specialty_id?: string | null;
          bio?: string | null;
          photo_url?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          crm?: string;
          specialty_id?: string | null;
          bio?: string | null;
          photo_url?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "doctors_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "doctors_specialty_id_fkey";
            columns: ["specialty_id"];
            isOneToOne: false;
            referencedRelation: "specialties";
            referencedColumns: ["id"];
          },
        ];
      };
      exam_results: {
        Row: {
          id: string;
          patient_id: string;
          exam_id: string;
          doctor_id: string | null;
          appointment_id: string | null;
          exam_date: string;
          status: ExamResultStatus;
          notes: string | null;
          released_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          exam_id: string;
          doctor_id?: string | null;
          appointment_id?: string | null;
          exam_date: string;
          status?: ExamResultStatus;
          notes?: string | null;
          released_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          exam_id?: string;
          doctor_id?: string | null;
          appointment_id?: string | null;
          exam_date?: string;
          status?: ExamResultStatus;
          notes?: string | null;
          released_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "exam_results_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "exam_results_exam_id_fkey";
            columns: ["exam_id"];
            isOneToOne: false;
            referencedRelation: "exams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "exam_results_doctor_id_fkey";
            columns: ["doctor_id"];
            isOneToOne: false;
            referencedRelation: "doctors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "exam_results_appointment_id_fkey";
            columns: ["appointment_id"];
            isOneToOne: false;
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "exam_results_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      exams: {
        Row: {
          id: string;
          slug: string;
          name: string;
          summary: string | null;
          description: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          summary?: string | null;
          description?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          summary?: string | null;
          description?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [
        ];
      };
      insurance_plans: {
        Row: {
          id: string;
          name: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [
        ];
      };
      medical_documents: {
        Row: {
          id: string;
          exam_result_id: string;
          file_path: string;
          file_name: string;
          mime_type: string | null;
          size_bytes: number | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          exam_result_id: string;
          file_path: string;
          file_name: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          exam_result_id?: string;
          file_path?: string;
          file_name?: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "medical_documents_exam_result_id_fkey";
            columns: ["exam_result_id"];
            isOneToOne: false;
            referencedRelation: "exam_results";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "medical_documents_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: NotificationType;
          title: string;
          body: string | null;
          related_appointment_id: string | null;
          related_exam_result_id: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: NotificationType;
          title: string;
          body?: string | null;
          related_appointment_id?: string | null;
          related_exam_result_id?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: NotificationType;
          title?: string;
          body?: string | null;
          related_appointment_id?: string | null;
          related_exam_result_id?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_related_appointment_id_fkey";
            columns: ["related_appointment_id"];
            isOneToOne: false;
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_related_exam_result_id_fkey";
            columns: ["related_exam_result_id"];
            isOneToOne: false;
            referencedRelation: "exam_results";
            referencedColumns: ["id"];
          },
        ];
      };
      patients: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          cpf: string | null;
          birth_date: string | null;
          phone: string | null;
          email: string | null;
          insurance_plan_id: string | null;
          address: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          full_name: string;
          cpf?: string | null;
          birth_date?: string | null;
          phone?: string | null;
          email?: string | null;
          insurance_plan_id?: string | null;
          address?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          full_name?: string;
          cpf?: string | null;
          birth_date?: string | null;
          phone?: string | null;
          email?: string | null;
          insurance_plan_id?: string | null;
          address?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "patients_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "patients_insurance_plan_id_fkey";
            columns: ["insurance_plan_id"];
            isOneToOne: false;
            referencedRelation: "insurance_plans";
            referencedColumns: ["id"];
          },
        ];
      };
      prescriptions: {
        Row: {
          id: string;
          patient_id: string;
          doctor_id: string;
          appointment_id: string | null;
          description: string;
          file_path: string | null;
          issued_at: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          doctor_id: string;
          appointment_id?: string | null;
          description: string;
          file_path?: string | null;
          issued_at?: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          doctor_id?: string;
          appointment_id?: string | null;
          description?: string;
          file_path?: string | null;
          issued_at?: string;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "prescriptions_patient_id_fkey";
            columns: ["patient_id"];
            isOneToOne: false;
            referencedRelation: "patients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "prescriptions_doctor_id_fkey";
            columns: ["doctor_id"];
            isOneToOne: false;
            referencedRelation: "doctors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "prescriptions_appointment_id_fkey";
            columns: ["appointment_id"];
            isOneToOne: false;
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "prescriptions_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      site_content: {
        Row: {
          id: string;
          section_key: string;
          title: string | null;
          body: string | null;
          published: boolean;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_key: string;
          title?: string | null;
          body?: string | null;
          published?: boolean;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_key?: string;
          title?: string | null;
          body?: string | null;
          published?: boolean;
          updated_by?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "site_content_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      specialties: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [
        ];
      };
      staff: {
        Row: {
          id: string;
          user_id: string;
          job_title: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_title?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_title?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "staff_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      push_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          endpoint?: string;
          p256dh?: string;
          auth?: string;
          created_at?: string;
        };
        Relationships: [
        ];
      };
      users: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          active: boolean;
          must_change_password: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          active?: boolean;
          must_change_password?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          active?: boolean;
          must_change_password?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      claim_patient_record: {
        Args: { p_cpf: string; p_birth_date: string };
        Returns: boolean;
      };
      resolve_patient_login_email: {
        Args: { p_cpf: string };
        Returns: string | null;
      };
      claimed_patient_ids: {
        Args: Record<string, never>;
        Returns: string[];
      };
    };
    Enums: {
      appointment_type: "CONSULTA" | "RETORNO" | "EXAME";
      exam_result_status: "RASCUNHO" | "PUBLICADO";
      notification_type: "CONFIRMACAO_CONSULTA" | "LEMBRETE_CONSULTA" | "ALTERACAO_HORARIO" | "RESULTADO_DISPONIVEL" | "GERAL";
      user_role: "SUPER_ADMIN" | "ADMIN" | "RECEPCAO" | "MEDICO" | "PACIENTE";
    };
    CompositeTypes: Record<string, never>;
  };
}

export type AppointmentType = Database["public"]["Enums"]["appointment_type"];
export type ExamResultStatus = Database["public"]["Enums"]["exam_result_status"];
export type NotificationType = Database["public"]["Enums"]["notification_type"];
export type UserRole = Database["public"]["Enums"]["user_role"];
export type AppointmentStatus = Database["public"]["Tables"]["appointment_status"]["Row"];
export type Appointments = Database["public"]["Tables"]["appointments"]["Row"];
export type AuditLogs = Database["public"]["Tables"]["audit_logs"]["Row"];
export type Doctors = Database["public"]["Tables"]["doctors"]["Row"];
export type ExamResults = Database["public"]["Tables"]["exam_results"]["Row"];
export type Exams = Database["public"]["Tables"]["exams"]["Row"];
export type InsurancePlans = Database["public"]["Tables"]["insurance_plans"]["Row"];
export type MedicalDocuments = Database["public"]["Tables"]["medical_documents"]["Row"];
export type Notifications = Database["public"]["Tables"]["notifications"]["Row"];
export type Patients = Database["public"]["Tables"]["patients"]["Row"];
export type Prescriptions = Database["public"]["Tables"]["prescriptions"]["Row"];
export type SiteContent = Database["public"]["Tables"]["site_content"]["Row"];
export type Specialties = Database["public"]["Tables"]["specialties"]["Row"];
export type Staff = Database["public"]["Tables"]["staff"]["Row"];
export type Users = Database["public"]["Tables"]["users"]["Row"];
