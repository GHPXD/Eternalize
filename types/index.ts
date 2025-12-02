import { z } from "zod";
import { MEMORY_LIMITS } from "@/lib/constants";

// =====================
// ENUMS & TYPES
// =====================

export type MemoryStatus = "DRAFT" | "PAID" | "ARCHIVED";

export type MediaType = "image" | "video";

// =====================
// INTERFACES
// =====================

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string; // Cloudflare R2 Public URL
  caption?: string;
  order: number;
}

export interface MemoryContent {
  title: string;
  description: string;
  primaryColor: string;
  musicUrl?: string;
  voiceNoteUrl?: string; // Audio feature
  media: MediaItem[];
  metrics?: MemoryMetrics;
}

export interface MemoryMetrics {
  views: number;
}

export interface Memory {
  id: string;
  ownerId: string; // Supabase Auth UID
  slug: string; // Unique URL identifier
  status: MemoryStatus;
  createdAt: number; // Timestamp
  content: MemoryContent;
  metrics?: MemoryMetrics;
}

// =====================
// ZOD VALIDATION SCHEMAS
// =====================

export const mediaItemSchema = z.object({
  id: z.string(),
  type: z.enum(["image", "video"]),
  url: z.string().url("Invalid media URL"),
  caption: z.string().optional(),
  order: z.number().int().nonnegative(),
});

export const memoryContentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(MEMORY_LIMITS.TITLE_MAX_LENGTH, "Title is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(MEMORY_LIMITS.DESCRIPTION_MAX_LENGTH, "Description is too long"),
  primaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
  musicUrl: z.string().url("Invalid music URL").optional(),
  voiceNoteUrl: z.string().url("Invalid voice note URL").optional(),
  media: z
    .array(mediaItemSchema)
    .max(MEMORY_LIMITS.MEDIA_MAX_COUNT, `Maximum ${MEMORY_LIMITS.MEDIA_MAX_COUNT} media items allowed`),
});

export const memorySchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug is too long")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  status: z.enum(["DRAFT", "PAID", "ARCHIVED"]),
  createdAt: z.number(),
  content: memoryContentSchema,
  metrics: z
    .object({
      views: z.number().int().nonnegative(),
    })
    .optional(),
});

// =====================
// FORM SCHEMAS (for React Hook Form)
// =====================

export const createMemoryFormSchema = memoryContentSchema.extend({
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug is too long")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
});

export type CreateMemoryFormData = z.infer<typeof createMemoryFormSchema>;

// =====================
// HELPER TYPES
// =====================

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}
