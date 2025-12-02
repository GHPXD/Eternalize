"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEditorStore } from "@/store/editor-store";
import { useAuth } from "@/lib/supabase/auth-context";
import { createMemoryAction, updateMemoryAction, getMemoryByIdAction } from "@/app/actions/memories";
import { generateSlug } from "@/lib/utils";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Eye, EyeOff, PanelRightClose, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Components
import { EditorSidebar } from "@/components/editor/editor-sidebar";
import { EditorPreview } from "@/components/editor/editor-preview";
import { MediaGallery } from "@/components/editor/media-gallery";
import { EditorToolbar } from "@/components/editor/editor-toolbar";

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memoryId = searchParams.get("id");
  
  const { user, loading: authLoading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [loading, setLoading] = useState(!!memoryId);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [showPreviewPanel, setShowPreviewPanel] = useState(true);
  
  const {
    title,
    description,
    primaryColor,
    musicUrl,
    media,
    isValid,
    getContent,
    loadContent,
    reset,
  } = useEditorStore();

  // Load existing memory if editing
  useEffect(() => {
    async function loadMemory() {
      if (!memoryId) return;
      
      try {
        setLoading(true);
        const result = await getMemoryByIdAction(memoryId);
        
        if (result.error) {
          toast.error("Erro ao carregar memória", {
            description: result.error,
          });
          router.push("/dashboard");
          return;
        }
        
        if (result.memory) {
          loadContent(result.memory.content);
        }
      } catch (error) {
        logger.error("Failed to load memory", error);
        toast.error("Erro ao carregar memória");
      } finally {
        setLoading(false);
      }
    }
    
    loadMemory();
  }, [memoryId, loadContent, router]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/editor");
    }
  }, [user, authLoading, router]);

  const handleSave = useCallback(async (status: "DRAFT" | "PAID" = "DRAFT") => {
    if (!isValid()) {
      toast.error("Preencha todos os campos obrigatórios", {
        description: "Título e descrição são obrigatórios.",
      });
      return;
    }

    if (!user) {
      toast.error("Você precisa estar logado");
      return;
    }

    const isSaving = status === "DRAFT";
    isSaving ? setSaving(true) : setPublishing(true);

    try {
      const content = getContent();
      
      if (memoryId) {
        // Update existing memory
        const result = await updateMemoryAction(memoryId, { 
          content,
          status,
        });
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        toast.success(
          isSaving ? "Rascunho salvo!" : "Memória publicada!",
          { description: isSaving ? "Suas alterações foram salvas." : "Sua memória está online!" }
        );
      } else {
        // Create new memory
        const slug = generateSlug(title);
        const result = await createMemoryAction({
          ownerId: user.uid,
          slug,
          status,
          createdAt: Date.now(),
          content,
        });

        if (result.error) {
          throw new Error(result.error);
        }

        toast.success(
          isSaving ? "Rascunho criado!" : "Memória publicada!",
          { description: isSaving ? "Você pode continuar editando depois." : "Sua memória está online!" }
        );
        
        // Redirect to edit mode with ID
        if (result.id) {
          router.replace(`/editor?id=${result.id}`);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Falha ao salvar";
      toast.error("Erro ao salvar", { description: errorMessage });
      logger.error("Failed to save memory", error);
    } finally {
      setSaving(false);
      setPublishing(false);
    }
  }, [isValid, user, memoryId, getContent, title, router]);

  const handleCancel = useCallback(() => {
    if (title || description || media.length > 0) {
      if (confirm("Você tem alterações não salvas. Deseja sair mesmo assim?")) {
        reset();
        router.push("/dashboard");
      }
    } else {
      router.push("/dashboard");
    }
  }, [title, description, media.length, reset, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <DashboardHeader user={{ email: user?.email || undefined, name: user?.displayName || undefined }} />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500">Carregando editor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <DashboardHeader user={{ email: user?.email || undefined, name: user?.displayName || undefined }} />
      
      {/* Toolbar */}
      <EditorToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSave={() => handleSave("DRAFT")}
        onPublish={() => handleSave("PAID")}
        onCancel={handleCancel}
        saving={saving}
        publishing={publishing}
        isValid={isValid()}
        isEditing={!!memoryId}
      />
      
      {/* Main Content - Split View Layout */}
      <main className="h-[calc(100vh-120px)]">
        {activeTab === "edit" ? (
          <div className="flex h-full">
            {/* Left Side - Editor Controls */}
            <div className={cn(
              "flex-1 overflow-y-auto transition-all duration-300",
              showPreviewPanel ? "lg:pr-0" : ""
            )}>
              <div className="container mx-auto px-4 py-6 max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Form Fields */}
                  <div className="lg:col-span-1">
                    <EditorSidebar />
                  </div>
                  
                  {/* Media Gallery */}
                  <div className="lg:col-span-1">
                    <MediaGallery />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Live Preview Panel (Desktop) */}
            <div className={cn(
              "hidden lg:flex flex-col border-l bg-gray-50/50 dark:bg-gray-900/50 transition-all duration-300",
              showPreviewPanel ? "w-[340px] xl:w-[380px]" : "w-0 overflow-hidden"
            )}>
              {/* Preview Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-white dark:bg-gray-900">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreviewPanel(false)}
                  className="h-8 w-8 p-0"
                >
                  <PanelRightClose className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Preview Content */}
              <div className="flex-1 overflow-y-auto">
                <EditorPreview mode="sidebar" />
              </div>
            </div>
            
            {/* Toggle Preview Button (when hidden) */}
            {!showPreviewPanel && (
              <div className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreviewPanel(true)}
                  className="gap-2 shadow-lg bg-white dark:bg-gray-900"
                >
                  <PanelRight className="w-4 h-4" />
                  Preview
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* Full Preview Mode */
          <div className="h-full overflow-y-auto py-6">
            <EditorPreview mode="fullscreen" />
          </div>
        )}
      </main>
      
      {/* Mobile Preview Toggle */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setActiveTab(activeTab === "edit" ? "preview" : "edit")}
          size="lg"
          className="rounded-full shadow-xl gap-2 px-6"
          style={{ backgroundColor: primaryColor }}
        >
          {activeTab === "edit" ? (
            <>
              <Eye className="w-5 h-5" />
              Ver Preview
            </>
          ) : (
            <>
              <EyeOff className="w-5 h-5" />
              Editar
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Loading component for Suspense
function EditorLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Carregando editor...</p>
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<EditorLoading />}>
      <EditorContent />
    </Suspense>
  );
}
