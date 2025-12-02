import { createClient } from "@/lib/supabase/server";
import { Memory, MemoryStatus, MemoryContent } from "@/types";
import { COLLECTIONS, TIME } from "@/lib/constants";
import { DatabaseError } from "@/lib/errors";
import { logger } from "@/lib/logger";

/**
 * Supabase Database Operations for Memories
 * Replaces Firebase Firestore
 */

// =====================
// CREATE
// =====================

export async function createMemory(
  memory: Omit<Memory, "id">
): Promise<string> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("memories")
      .insert({
        owner_id: memory.ownerId,
        slug: memory.slug,
        status: memory.status,
        content: memory.content,
      })
      .select("id")
      .single();

    if (error) throw error;

    return data!.id;
  } catch (error) {
    logger.error("Failed to create memory", error);
    throw new DatabaseError("Failed to create memory");
  }
}

// =====================
// READ
// =====================

export async function getMemoryById(id: string): Promise<Memory | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Not found
      throw error;
    }

    return {
      id: data.id,
      ownerId: data.owner_id,
      slug: data.slug,
      status: data.status as MemoryStatus,
      createdAt: new Date(data.created_at).getTime(),
      content: data.content as MemoryContent,
    };
  } catch (error) {
    logger.error("Failed to get memory by ID", error);
    return null;
  }
}

export async function getMemoryBySlug(slug: string): Promise<Memory | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Not found
      throw error;
    }

    return {
      id: data.id,
      ownerId: data.owner_id,
      slug: data.slug,
      status: data.status as MemoryStatus,
      createdAt: new Date(data.created_at).getTime(),
      content: data.content as MemoryContent,
    };
  } catch (error) {
    logger.error("Failed to get memory by slug", error);
    return null;
  }
}

export async function getMemoriesByOwner(
  ownerId: string,
  status?: MemoryStatus
): Promise<Memory[]> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("memories")
      .select("*")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map((item) => ({
      id: item.id,
      ownerId: item.owner_id,
      slug: item.slug,
      status: item.status as MemoryStatus,
      createdAt: new Date(item.created_at).getTime(),
      content: item.content as MemoryContent,
    }));
  } catch (error) {
    logger.error("Failed to get memories by owner", error);
    return [];
  }
}

export async function checkSlugAvailability(slug: string): Promise<boolean> {
  const memory = await getMemoryBySlug(slug);
  return memory === null;
}

// =====================
// UPDATE
// =====================

export async function updateMemory(
  id: string,
  data: Partial<Memory>
): Promise<void> {
  try {
    const supabase = await createClient();

    const updateData: {
      slug?: string;
      status?: MemoryStatus;
      content?: MemoryContent;
    } = {};
    if (data.slug) updateData.slug = data.slug;
    if (data.status) updateData.status = data.status;
    if (data.content) updateData.content = data.content;

    const { error } = await supabase
      .from("memories")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    logger.error("Failed to update memory", error);
    throw new DatabaseError("Failed to update memory");
  }
}

export async function updateMemoryStatus(
  id: string,
  status: MemoryStatus
): Promise<void> {
  await updateMemory(id, { status });
}

export async function incrementMemoryViews(id: string): Promise<void> {
  try {
    const supabase = await createClient();

    // Get current memory
    const memory = await getMemoryById(id);
    if (!memory) throw new Error("Memory not found");

    // Update views count in content
    const content = memory.content;
    const currentViews = content.metrics?.views || 0;

    const { error } = await supabase
      .from("memories")
      .update({
        content: {
          ...content,
          metrics: {
            ...content.metrics,
            views: currentViews + 1,
          },
        },
      })
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    logger.error("Failed to increment memory views", error);
  }
}

// =====================
// DELETE
// =====================

export async function deleteMemory(id: string): Promise<void> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("memories").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    logger.error("Failed to delete memory", error);
    throw new DatabaseError("Failed to delete memory");
  }
}

// =====================
// BATCH OPERATIONS
// =====================

export async function archiveOldDrafts(daysOld: number = 30): Promise<number> {
  try {
    const supabase = await createClient();
    const cutoffDate = new Date(Date.now() - daysOld * TIME.DAY).toISOString();

    const { data, error } = await supabase
      .from("memories")
      .update({ status: "ARCHIVED" })
      .eq("status", "DRAFT")
      .lt("created_at", cutoffDate)
      .select("id");

    if (error) throw error;

    return data?.length ?? 0;
  } catch (error) {
    logger.error("Failed to archive old drafts", error);
    return 0;
  }
}
