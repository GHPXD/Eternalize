"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Music, 
  Upload, 
  X, 
  Loader2,
  Play,
  Pause,
  Link as LinkIcon
} from "lucide-react";
import { toast } from "sonner";
import { useMediaUpload } from "@/hooks/use-media-upload";
import { 
  UPLOAD_LIMITS, 
  validateFileSize, 
  formatFileSize 
} from "@/lib/constants/upload";

interface MusicUploaderProps {
  currentUrl: string;
  onUrlChange: (url: string) => void;
}

export function MusicUploader({ currentUrl, onUrlChange }: MusicUploaderProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const { uploadFile, uploading, progress } = useMediaUpload({
    onSuccess: (publicUrl) => {
      onUrlChange(publicUrl);
      toast.success("Música adicionada!");
    },
    onError: (error) => {
      toast.error("Erro no upload", { description: error });
    },
    folder: "music",
  });

  const handleFileDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    // Validate file size
    const validation = validateFileSize(file);
    if (!validation.valid) {
      toast.error("Arquivo muito grande", {
        description: validation.error,
        duration: 5000,
      });
      return;
    }

    await uploadFile(file);
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg', '.aac', '.m4a'],
    },
    multiple: false,
    disabled: uploading,
  });

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast.error("Digite uma URL válida");
      return;
    }
    
    // Basic URL validation
    try {
      new URL(urlInput);
      onUrlChange(urlInput);
      setUrlInput("");
      toast.success("Música adicionada!");
    } catch {
      toast.error("URL inválida", {
        description: "Digite uma URL válida para um arquivo de áudio",
      });
    }
  };

  const handleRemove = () => {
    onUrlChange("");
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    }
    toast.success("Música removida");
  };

  const togglePlay = () => {
    if (!audioElement) {
      const audio = new Audio(currentUrl);
      audio.onended = () => setIsPlaying(false);
      setAudioElement(audio);
      audio.play();
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // If music is already set, show player
  if (currentUrl) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <button
            onClick={togglePlay}
            className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" fill="white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-700 dark:text-green-300 truncate">
              Música adicionada
            </p>
            <p className="text-xs text-green-600/70 dark:text-green-400/70 truncate">
              {currentUrl.split('/').pop() || "audio"}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mode Switcher */}
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setMode("upload")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            mode === "upload"
              ? "bg-white dark:bg-gray-700 text-green-600 shadow-sm"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload
        </button>
        <button
          onClick={() => setMode("url")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            mode === "url"
              ? "bg-white dark:bg-gray-700 text-green-600 shadow-sm"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          URL
        </button>
      </div>

      {mode === "upload" ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
            ${isDragActive 
              ? "border-green-500 bg-green-50 dark:bg-green-950/20" 
              : "border-gray-200 dark:border-gray-700 hover:border-green-300"
            }
            ${uploading ? "pointer-events-none opacity-60" : ""}
          `}
        >
          <input {...getInputProps()} />
          
          {uploading ? (
            <div className="space-y-2">
              <Loader2 className="w-8 h-8 mx-auto text-green-500 animate-spin" />
              <p className="text-sm text-gray-600">Enviando... {progress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <Music className="w-8 h-8 mx-auto text-green-500 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isDragActive ? "Solte o arquivo aqui..." : "Arraste um arquivo de áudio"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                MP3, WAV, OGG (máx {UPLOAD_LIMITS.AUDIO_MAX_SIZE_MB}MB)
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="https://exemplo.com/musica.mp3"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
              className="bg-green-500 hover:bg-green-600"
            >
              Adicionar
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Cole a URL direta de um arquivo de áudio
          </p>
        </div>
      )}
    </div>
  );
}
