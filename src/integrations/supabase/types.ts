export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
          password: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          password?: string
          username?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          created_at: string
          date: string
          id: string
          patient_id: string | null
          status: string | null
          time: string
          type: string | null
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          patient_id?: string | null
          status?: string | null
          time: string
          type?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          patient_id?: string | null
          status?: string | null
          time?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      health_tracking: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          patient_id: string | null
          recorded_at: string
          tracking_type: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          recorded_at?: string
          tracking_type: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          recorded_at?: string
          tracking_type?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "health_tracking_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      medication_schedules: {
        Row: {
          created_at: string
          dosage: string
          end_date: string | null
          frequency: string
          id: string
          is_active: boolean
          medication_name: string
          notes: string | null
          patient_id: string | null
          reminder_times: string[]
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dosage: string
          end_date?: string | null
          frequency: string
          id?: string
          is_active?: boolean
          medication_name: string
          notes?: string | null
          patient_id?: string | null
          reminder_times?: string[]
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dosage?: string
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          medication_name?: string
          notes?: string | null
          patient_id?: string | null
          reminder_times?: string[]
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_schedules_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_schedules: {
        Row: {
          appointment_id: string | null
          created_at: string
          delivery_method: string
          id: string
          medication_schedule_id: string | null
          message_content: string
          notification_type: string
          patient_id: string | null
          scheduled_time: string
          sent_at: string | null
          status: string
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          delivery_method: string
          id?: string
          medication_schedule_id?: string | null
          message_content: string
          notification_type: string
          patient_id?: string | null
          scheduled_time: string
          sent_at?: string | null
          status?: string
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          delivery_method?: string
          id?: string
          medication_schedule_id?: string | null
          message_content?: string
          notification_type?: string
          patient_id?: string | null
          scheduled_time?: string
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_schedules_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_schedules_medication_schedule_id_fkey"
            columns: ["medication_schedule_id"]
            isOneToOne: false
            referencedRelation: "medication_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_schedules_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_surveys: {
        Row: {
          appointment_id: string | null
          completed_at: string | null
          created_at: string
          id: string
          patient_id: string | null
          questions: Json
          responses: Json | null
          survey_type: string
          updated_at: string
        }
        Insert: {
          appointment_id?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          patient_id?: string | null
          questions: Json
          responses?: Json | null
          survey_type: string
          updated_at?: string
        }
        Update: {
          appointment_id?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          patient_id?: string | null
          questions?: Json
          responses?: Json | null
          survey_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_surveys_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_surveys_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          code_number: string
          condition: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          risk_level: string | null
        }
        Insert: {
          code_number: string
          condition?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          risk_level?: string | null
        }
        Update: {
          code_number?: string
          condition?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          risk_level?: string | null
        }
        Relationships: []
      }
      rewards: {
        Row: {
          action: string | null
          date: string
          id: string
          patient_id: string | null
          points: number | null
        }
        Insert: {
          action?: string | null
          date?: string
          id?: string
          patient_id?: string | null
          points?: number | null
        }
        Update: {
          action?: string | null
          date?: string
          id?: string
          patient_id?: string | null
          points?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rewards_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
