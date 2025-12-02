"use client";

import { Button } from "@/components/ui/button";
import { 
  Save, 
  Rocket, 
  X, 
  Eye, 
  Edit3,
  Loader2
} from "lucide-react";

interface EditorToolbarProps {
  activeTab: "edit" | "preview";
  onTabChange: (tab: "edit" | "preview") => void;
  onSave: () => void;
  onPublish: () => void;
  onCancel: () => void;
  saving: boolean;
  publishing: boolean;
  isValid: boolean;
  isEditing: boolean;
}

export function EditorToolbar({
  activeTab,
  onTabChange,
  onSave,
  onPublish,
  onCancel,
  saving,
  publishing,
  isValid,
  isEditing,
}: EditorToolbarProps) {
  return (
    <div className="sticky top-[57px] z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-3 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Left - Title */}
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEditing ? "Editar Memória" : "Nova Memória"}
            </h1>
            
            {/* Tab Switcher */}
            <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => onTabChange("edit")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "edit"
                    ? "bg-white dark:bg-gray-700 text-violet-600 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                }`}
              >
                <Edit3 className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => onTabChange("preview")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "preview"
                    ? "bg-white dark:bg-gray-700 text-violet-600 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                }`}
              >
                <Eye className="w-4 h-4" />
                Visualizar
              </button>
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={saving || publishing}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Cancelar</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              disabled={saving || publishing || !isValid}
              className="border-violet-200 text-violet-600 hover:bg-violet-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-1" />
              )}
              <span className="hidden sm:inline">
                {saving ? "Salvando..." : "Salvar Rascunho"}
              </span>
            </Button>
            
            <Button
              size="sm"
              onClick={onPublish}
              disabled={saving || publishing || !isValid}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25"
            >
              {publishing ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Rocket className="w-4 h-4 mr-1" />
              )}
              <span className="hidden sm:inline">
                {publishing ? "Publicando..." : "Publicar"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
