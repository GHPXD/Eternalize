/**
 * Supabase Database Types
 * Generated from your Supabase schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      memories: {
        Row: {
          id: string;
          owner_id: string;
          slug: string;
          status: "DRAFT" | "PAID" | "ARCHIVED";
          content: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          slug: string;
          status?: "DRAFT" | "PAID" | "ARCHIVED";
          content: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          slug?: string;
          status?: "DRAFT" | "PAID" | "ARCHIVED";
          content?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
