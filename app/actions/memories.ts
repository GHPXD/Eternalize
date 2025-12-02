"use server";

import {
  createMemory as createMemoryDb,
  getMemoryById,
  getMemoryBySlug,
  getMemoriesByOwner,
  updateMemory as updateMemoryDb,
  deleteMemory as deleteMemoryDb,
  incrementMemoryViews,
  archiveOldDrafts,
} from "@/lib/supabase/database";
import type { Memory } from "@/types";
import { logger } from "@/lib/logger";

/**
 * Server Actions for Memory operations
 * These wrap database functions and can be called from Client Components
 */

export async function createMemoryAction(
  memory: Omit<Memory, "id">
): Promise<{ id?: string; error?: string }> {
  try {
    const id = await createMemoryDb(memory);
    return { id };
  } catch (error) {
    logger.error("Create memory action failed", error);
    return { error: error instanceof Error ? error.message : "Failed to create memory" };
  }
}

export async function getMemoryByIdAction(
  id: string
): Promise<{ memory?: Memory; error?: string }> {
  try {
    const memory = await getMemoryById(id);
    return { memory: memory || undefined };
  } catch (error) {
    logger.error("Get memory action failed", error);
    return { error: error instanceof Error ? error.message : "Failed to get memory" };
  }
}

export async function getMemoryBySlugAction(
  slug: string
): Promise<{ memory?: Memory; error?: string }> {
  try {
    const memory = await getMemoryBySlug(slug);
    return { memory: memory || undefined };
  } catch (error) {
    logger.error("Get memory by slug action failed", error);
    return { error: error instanceof Error ? error.message : "Failed to get memory" };
  }
}

export async function getMemoriesByOwnerAction(
  ownerId: string
): Promise<{ memories?: Memory[]; error?: string }> {
  try {
    const memories = await getMemoriesByOwner(ownerId);
    return { memories };
  } catch (error) {
    logger.error("Get memories action failed", error);
    return { error: error instanceof Error ? error.message : "Failed to get memories" };
  }
}

export async function updateMemoryAction(
  id: string,
  updates: Partial<Memory>
): Promise<{ success?: boolean; error?: string }> {
  try {
    await updateMemoryDb(id, updates);
    return { success: true };
  } catch (error) {
    logger.error("Update memory action failed", error);
    return { error: error instanceof Error ? error.message : "Failed to update memory" };
  }
}

export async function deleteMemoryAction(
  id: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    await deleteMemoryDb(id);
    return { success: true };
  } catch (error) {
    logger.error("Delete memory action failed", error);
    return { error: error instanceof Error ? error.message : "Failed to delete memory" };
  }
}

export async function incrementMemoryViewsAction(
  id: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    await incrementMemoryViews(id);
    return { success: true };
  } catch (error) {
    logger.error("Increment views action failed", error);
    return { error: error instanceof Error ? error.message : "Failed to increment views" };
  }
}

export async function archiveOldDraftsAction(
  daysOld: number = 30
): Promise<{ count?: number; error?: string }> {
  try {
    const count = await archiveOldDrafts(daysOld);
    return { count };
  } catch (error) {
    logger.error("Archive drafts action failed", error);
    return { error: error instanceof Error ? error.message : "Failed to archive drafts" };
  }
}
