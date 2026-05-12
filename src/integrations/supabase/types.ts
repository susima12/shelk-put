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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          admin_notes: string | null
          age_category: string | null
          attachment_path: string | null
          city: string | null
          competition_id: string
          country: string | null
          created_at: string
          duration_minutes: number | null
          email: string
          id: string
          invite_link: string | null
          leader_full_name: string
          nomination: string | null
          notes: string | null
          organization: string | null
          participant_name: string
          participants_count: number | null
          payment_receipt_path: string | null
          performance_title: string | null
          phone: string
          status: Database["public"]["Enums"]["application_status"]
          user_id: string | null
          video_url: string | null
        }
        Insert: {
          admin_notes?: string | null
          age_category?: string | null
          attachment_path?: string | null
          city?: string | null
          competition_id: string
          country?: string | null
          created_at?: string
          duration_minutes?: number | null
          email: string
          id?: string
          invite_link?: string | null
          leader_full_name: string
          nomination?: string | null
          notes?: string | null
          organization?: string | null
          participant_name: string
          participants_count?: number | null
          payment_receipt_path?: string | null
          performance_title?: string | null
          phone: string
          status?: Database["public"]["Enums"]["application_status"]
          user_id?: string | null
          video_url?: string | null
        }
        Update: {
          admin_notes?: string | null
          age_category?: string | null
          attachment_path?: string | null
          city?: string | null
          competition_id?: string
          country?: string | null
          created_at?: string
          duration_minutes?: number | null
          email?: string
          id?: string
          invite_link?: string | null
          leader_full_name?: string
          nomination?: string | null
          notes?: string | null
          organization?: string | null
          participant_name?: string
          participants_count?: number | null
          payment_receipt_path?: string | null
          performance_title?: string | null
          phone?: string
          status?: Database["public"]["Enums"]["application_status"]
          user_id?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_members: {
        Row: {
          banned: boolean
          competition_id: string
          display_name: string | null
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          banned?: boolean
          competition_id: string
          display_name?: string | null
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          banned?: boolean
          competition_id?: string
          display_name?: string | null
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_members_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          author_name: string | null
          competition_id: string
          content: string
          created_at: string
          id: string
          is_admin: boolean
          user_id: string
        }
        Insert: {
          author_name?: string | null
          competition_id: string
          content: string
          created_at?: string
          id?: string
          is_admin?: boolean
          user_id: string
        }
        Update: {
          author_name?: string | null
          competition_id?: string
          content?: string
          created_at?: string
          id?: string
          is_admin?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      competitions: {
        Row: {
          accepting_applications: boolean
          age_categories: string[]
          cover_url: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          name: string
          nominations: string[]
          short_description: string | null
          slug: string
        }
        Insert: {
          accepting_applications?: boolean
          age_categories?: string[]
          cover_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name: string
          nominations?: string[]
          short_description?: string | null
          slug: string
        }
        Update: {
          accepting_applications?: boolean
          age_categories?: string[]
          cover_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name?: string
          nominations?: string[]
          short_description?: string | null
          slug?: string
        }
        Relationships: []
      }
      dm_conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string
          user_a: string
          user_b: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string
          user_a: string
          user_b: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string
          user_a?: string
          user_b?: string
        }
        Relationships: []
      }
      dm_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          deleted_at: string | null
          edited_at: string | null
          id: string
          pinned_at: string | null
          reply_to: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          pinned_at?: string | null
          reply_to?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          pinned_at?: string | null
          reply_to?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dm_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "dm_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dm_messages_reply_to_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "dm_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      jury_members: {
        Row: {
          bio: string | null
          display_order: number
          full_name: string
          id: string
          photo_url: string | null
          title: string | null
        }
        Insert: {
          bio?: string | null
          display_order?: number
          full_name: string
          id?: string
          photo_url?: string | null
          title?: string | null
        }
        Update: {
          bio?: string | null
          display_order?: number
          full_name?: string
          id?: string
          photo_url?: string | null
          title?: string | null
        }
        Relationships: []
      }
      news: {
        Row: {
          body: string | null
          cover_url: string | null
          excerpt: string | null
          id: string
          published_at: string
          title: string
        }
        Insert: {
          body?: string | null
          cover_url?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string
          title: string
        }
        Update: {
          body?: string | null
          cover_url?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          competition_id: string | null
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          competition_id?: string | null
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          competition_id?: string | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_competition: { Args: { _user_id: string }; Returns: string }
      can_dm: { Args: { _from: string; _to: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_of: {
        Args: { _competition: string; _user_id: string }
        Returns: boolean
      }
      is_chat_member: {
        Args: { _competition: string; _user_id: string }
        Returns: boolean
      }
      is_dm_participant: {
        Args: { _conv: string; _user: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      application_status: "new" | "reviewing" | "approved" | "rejected"
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
      app_role: ["admin", "user"],
      application_status: ["new", "reviewing", "approved", "rejected"],
    },
  },
} as const
