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
      bookings: {
        Row: {
          assigned_agent: string | null
          booking_date: string
          booking_time: string
          created_at: string
          estimated_price: number | null
          id: string
          notes: string | null
          pickup_location: string | null
          rating: number | null
          review: string | null
          service_type: string
          status: string
          updated_at: string
          user_id: string
          vehicle_id: string | null
          vehicle_type: string
        }
        Insert: {
          assigned_agent?: string | null
          booking_date: string
          booking_time?: string
          created_at?: string
          estimated_price?: number | null
          id?: string
          notes?: string | null
          pickup_location?: string | null
          rating?: number | null
          review?: string | null
          service_type: string
          status?: string
          updated_at?: string
          user_id: string
          vehicle_id?: string | null
          vehicle_type?: string
        }
        Update: {
          assigned_agent?: string | null
          booking_date?: string
          booking_time?: string
          created_at?: string
          estimated_price?: number | null
          id?: string
          notes?: string | null
          pickup_location?: string | null
          rating?: number | null
          review?: string | null
          service_type?: string
          status?: string
          updated_at?: string
          user_id?: string
          vehicle_id?: string | null
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          id: string
          invoice_number: string
          invoice_pdf: string | null
          service_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invoice_number: string
          invoice_pdf?: string | null
          service_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invoice_number?: string
          invoice_pdf?: string | null
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service_records"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_points: {
        Row: {
          created_at: string
          id: string
          last_reset_date: string | null
          service_dots: number
          updated_at: string
          vehicle_id: string
          wash_dots: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_reset_date?: string | null
          service_dots?: number
          updated_at?: string
          vehicle_id: string
          wash_dots?: number
        }
        Update: {
          created_at?: string
          id?: string
          last_reset_date?: string | null
          service_dots?: number
          updated_at?: string
          vehicle_id?: string
          wash_dots?: number
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_points_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      parts: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          mobile_number: string | null
          name: string | null
          profile_photo: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          mobile_number?: string | null
          name?: string | null
          profile_photo?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          mobile_number?: string | null
          name?: string | null
          profile_photo?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      service_records: {
        Row: {
          after_image: string | null
          before_image: string | null
          created_at: string
          description: string | null
          id: string
          invoice_file: string | null
          parts_replaced: string | null
          service_cost: number | null
          service_date: string
          service_type: string
          technician_name: string | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          after_image?: string | null
          before_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          invoice_file?: string | null
          parts_replaced?: string | null
          service_cost?: number | null
          service_date?: string
          service_type: string
          technician_name?: string | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          after_image?: string | null
          before_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          invoice_file?: string | null
          parts_replaced?: string | null
          service_cost?: number | null
          service_date?: string
          service_type?: string
          technician_name?: string | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_reminders: {
        Row: {
          created_at: string
          id: string
          is_sent: boolean | null
          reminder_date: string
          reminder_type: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_sent?: boolean | null
          reminder_date: string
          reminder_type: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_sent?: boolean | null
          reminder_date?: string
          reminder_type?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_reminders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          price_bike: number
          price_car: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          price_bike?: number
          price_car?: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          price_bike?: number
          price_car?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          setting_group: string
          setting_key: string
          setting_label: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_group?: string
          setting_key: string
          setting_label?: string
          setting_value?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_group?: string
          setting_key?: string
          setting_label?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          brand: string | null
          created_at: string
          fuel_type: string | null
          id: string
          manufacturing_year: number | null
          model: string | null
          updated_at: string
          user_id: string
          vehicle_number: string
          vehicle_photo: string | null
          vehicle_type: string
        }
        Insert: {
          brand?: string | null
          created_at?: string
          fuel_type?: string | null
          id?: string
          manufacturing_year?: number | null
          model?: string | null
          updated_at?: string
          user_id: string
          vehicle_number: string
          vehicle_photo?: string | null
          vehicle_type: string
        }
        Update: {
          brand?: string | null
          created_at?: string
          fuel_type?: string | null
          id?: string
          manufacturing_year?: number | null
          model?: string | null
          updated_at?: string
          user_id?: string
          vehicle_number?: string
          vehicle_photo?: string | null
          vehicle_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "customer" | "staff" | "super_admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["customer", "staff", "super_admin"],
    },
  },
} as const
