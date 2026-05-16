export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      app_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      chat_threads: {
        Row: {
          id: string;
          title: string;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Relationships: [];
      };
      chat_messages: {
        Row: {
          id: string;
          thread_id: string;
          role: "user" | "assistant" | "system" | "tool";
          content: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          thread_id: string;
          role: "user" | "assistant" | "system" | "tool";
          content: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          thread_id?: string;
          role?: "user" | "assistant" | "system" | "tool";
          content?: string;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_thread_id_fkey";
            columns: ["thread_id"];
            isOneToOne: false;
            referencedRelation: "chat_threads";
            referencedColumns: ["id"];
          },
        ];
      };
      usage_events: {
        Row: {
          id: string;
          event_type: string;
          provider: string | null;
          model: string | null;
          input_tokens: number | null;
          output_tokens: number | null;
          total_tokens: number | null;
          cost_usd: number | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_type: string;
          provider?: string | null;
          model?: string | null;
          input_tokens?: number | null;
          output_tokens?: number | null;
          total_tokens?: number | null;
          cost_usd?: number | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_type?: string;
          provider?: string | null;
          model?: string | null;
          input_tokens?: number | null;
          output_tokens?: number | null;
          total_tokens?: number | null;
          cost_usd?: number | null;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          title: string;
          source_type: string;
          source_path: string | null;
          raw_content: string | null;
          content_char_count: number;
          content_hash: string | null;
          ingestion_status: string;
          ingestion_error: string | null;
          ingested_at: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          source_type?: string;
          source_path?: string | null;
          raw_content?: string | null;
          content_char_count?: number;
          content_hash?: string | null;
          ingestion_status?: string;
          ingestion_error?: string | null;
          ingested_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          source_type?: string;
          source_path?: string | null;
          raw_content?: string | null;
          content_char_count?: number;
          content_hash?: string | null;
          ingestion_status?: string;
          ingestion_error?: string | null;
          ingested_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      set_updated_at: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
