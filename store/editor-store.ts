import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MediaItem, MemoryContent } from "@/types";
import { generateId } from "@/lib/utils";
import { DEFAULTS } from "@/lib/constants";

interface UploadingMedia {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "error" | "success";
  error?: string;
}

interface EditorState {
  // Memory content
  title: string;
  description: string;
  primaryColor: string;
  musicUrl: string;
  voiceNoteUrl: string;
  media: MediaItem[];

  // Upload state
  uploadingMedia: UploadingMedia[];
  
  // Actions
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setPrimaryColor: (color: string) => void;
  setMusicUrl: (url: string) => void;
  setVoiceNoteUrl: (url: string) => void;
  
  // Media management
  addMedia: (item: MediaItem) => void;
  removeMedia: (id: string) => void;
  updateMedia: (id: string, updates: Partial<MediaItem>) => void;
  reorderMedia: (startIndex: number, endIndex: number) => void;
  
  // Upload management
  addUploadingMedia: (file: File) => string;
  updateUploadProgress: (id: string, progress: number) => void;
  setUploadSuccess: (id: string, mediaItem: MediaItem) => void;
  setUploadError: (id: string, error: string) => void;
  removeUploadingMedia: (id: string) => void;
  
  // Bulk actions
  loadContent: (content: MemoryContent) => void;
  getContent: () => MemoryContent;
  reset: () => void;
  
  // Validation
  isValid: () => boolean;
}

export const useEditorStore = create<EditorState>()(persist(
  (set, get) => ({
  // Initial state
  title: "",
  description: "",
  primaryColor: DEFAULTS.PRIMARY_COLOR,
  musicUrl: "",
  voiceNoteUrl: "",
  media: [],
  uploadingMedia: [],

  // Basic setters
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setPrimaryColor: (primaryColor) => set({ primaryColor }),
  setMusicUrl: (musicUrl) => set({ musicUrl }),
  setVoiceNoteUrl: (voiceNoteUrl) => set({ voiceNoteUrl }),

  // Media management
  addMedia: (item) =>
    set((state) => ({
      media: [...state.media, item].map((m, i) => ({ ...m, order: i })),
    })),

  removeMedia: (id) =>
    set((state) => ({
      media: state.media
        .filter((m) => m.id !== id)
        .map((m, i) => ({ ...m, order: i })),
    })),

  updateMedia: (id, updates) =>
    set((state) => ({
      media: state.media.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),

  reorderMedia: (startIndex, endIndex) =>
    set((state) => {
      const result = Array.from(state.media);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return {
        media: result.map((m, i) => ({ ...m, order: i })),
      };
    }),

  // Upload management
  addUploadingMedia: (file) => {
    const id = generateId();
    set((state) => ({
      uploadingMedia: [
        ...state.uploadingMedia,
        { id, file, progress: 0, status: "uploading" },
      ],
    }));
    return id;
  },

  updateUploadProgress: (id, progress) =>
    set((state) => ({
      uploadingMedia: state.uploadingMedia.map((u) =>
        u.id === id ? { ...u, progress } : u
      ),
    })),

  setUploadSuccess: (id, mediaItem) =>
    set((state) => ({
      uploadingMedia: state.uploadingMedia.map((u) =>
        u.id === id ? { ...u, status: "success" as const, progress: 100 } : u
      ),
    })),

  setUploadError: (id, error) =>
    set((state) => ({
      uploadingMedia: state.uploadingMedia.map((u) =>
        u.id === id ? { ...u, status: "error" as const, error } : u
      ),
    })),

  removeUploadingMedia: (id) =>
    set((state) => ({
      uploadingMedia: state.uploadingMedia.filter((u) => u.id !== id),
    })),

  // Bulk actions
  loadContent: (content) =>
    set({
      title: content.title,
      description: content.description,
      primaryColor: content.primaryColor,
      musicUrl: content.musicUrl || "",
      voiceNoteUrl: content.voiceNoteUrl || "",
      media: content.media,
    }),

  getContent: () => {
    const state = get();
    return {
      title: state.title,
      description: state.description,
      primaryColor: state.primaryColor,
      musicUrl: state.musicUrl || undefined,
      voiceNoteUrl: state.voiceNoteUrl || undefined,
      media: state.media,
    };
  },

  reset: () =>
    set({
      title: "",
      description: "",
      primaryColor: DEFAULTS.PRIMARY_COLOR,
      musicUrl: "",
      voiceNoteUrl: "",
      media: [],
      uploadingMedia: [],
    }),

  // Validation
  isValid: () => {
    const state = get();
    return (
      state.title.trim().length > 0 &&
      state.description.trim().length > 0 &&
      state.uploadingMedia.filter((u) => u.status === "uploading").length === 0
    );
  },
}),
  {
    name: "editor-storage",
    partialize: (state) => ({
      title: state.title,
      description: state.description,
      primaryColor: state.primaryColor,
      musicUrl: state.musicUrl,
      voiceNoteUrl: state.voiceNoteUrl,
      media: state.media,
    }),
  }
));
