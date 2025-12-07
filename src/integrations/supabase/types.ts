export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      interview_sessions: {
        Row: {
          created_at: string
          duration_minutes: number | null
          expert_id: string
          expertise_area: Database["public"]["Enums"]["expertise_area"] | null
          id: string
          key_insights: Json | null
          status: string | null
          summary: string | null
          title: string
          topic: string | null
          transcript: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          expert_id: string
          expertise_area?: Database["public"]["Enums"]["expertise_area"] | null
          id?: string
          key_insights?: Json | null
          status?: string | null
          summary?: string | null
          title: string
          topic?: string | null
          transcript?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          expert_id?: string
          expertise_area?: Database["public"]["Enums"]["expertise_area"] | null
          id?: string
          key_insights?: Json | null
          status?: string | null
          summary?: string | null
          title?: string
          topic?: string | null
          transcript?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_sessions_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_items: {
        Row: {
          category: string | null
          content: string
          created_at: string
          expert_id: string
          id: string
          knowledge_type: string | null
          session_id: string | null
          tags: string[] | null
          title: string
          updated_at: string
          visual_aids: Json | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          expert_id: string
          id?: string
          knowledge_type?: string | null
          session_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          visual_aids?: Json | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          expert_id?: string
          id?: string
          knowledge_type?: string | null
          session_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          visual_aids?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_items_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_items_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "interview_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_progress: {
        Row: {
          bookmarked: boolean | null
          completed_at: string | null
          completion_percentage: number | null
          created_at: string
          id: string
          knowledge_item_id: string
          last_accessed_at: string | null
          learner_id: string
          notes: string | null
          status: string | null
        }
        Insert: {
          bookmarked?: boolean | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          id?: string
          knowledge_item_id: string
          last_accessed_at?: string | null
          learner_id: string
          notes?: string | null
          status?: string | null
        }
        Update: {
          bookmarked?: boolean | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          id?: string
          knowledge_item_id?: string
          last_accessed_at?: string | null
          learner_id?: string
          notes?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_progress_knowledge_item_id_fkey"
            columns: ["knowledge_item_id"]
            isOneToOne: false
            referencedRelation: "knowledge_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_progress_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          communication_preference: string | null
          created_at: string
          department: string | null
          email: string
          expertise_areas:
            | Database["public"]["Enums"]["expertise_area"][]
            | null
          full_name: string
          generation: string | null
          id: string
          job_title: string | null
          updated_at: string
          user_id: string
          years_of_experience: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          communication_preference?: string | null
          created_at?: string
          department?: string | null
          email: string
          expertise_areas?:
            | Database["public"]["Enums"]["expertise_area"][]
            | null
          full_name: string
          generation?: string | null
          id?: string
          job_title?: string | null
          updated_at?: string
          user_id: string
          years_of_experience?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          communication_preference?: string | null
          created_at?: string
          department?: string | null
          email?: string
          expertise_areas?:
            | Database["public"]["Enums"]["expertise_area"][]
            | null
          full_name?: string
          generation?: string | null
          id?: string
          job_title?: string | null
          updated_at?: string
          user_id?: string
          years_of_experience?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "expert" | "learner" | "admin"
      expertise_area:
        | "engineering"
        | "manufacturing"
        | "healthcare"
        | "finance"
        | "technology"
        | "operations"
        | "sales"
        | "marketing"
        | "hr"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["expert", "learner", "admin"],
      expertise_area: [
        "engineering",
        "manufacturing",
        "healthcare",
        "finance",
        "technology",
        "operations",
        "sales",
        "marketing",
        "hr",
        "other",
      ],
    },
  },
} as const
