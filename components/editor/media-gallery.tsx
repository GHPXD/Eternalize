"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useEditorStore } from "@/store/editor-store";
import { useMediaUpload } from "@/hooks/use-media-upload";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Image as ImageIcon, 
  Video, 
  Upload, 
  X, 
  GripVertical,
  Trash2,
  Plus,
  Loader2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { generateId } from "@/lib/utils";
import { MediaItem } from "@/types";
import { 
  UPLOAD_LIMITS, 
  validateFileSize, 
  formatFileSize,
  getFileType 
} from "@/lib/constants/upload";

export function MediaGallery() {
  const { media, addMedia, removeMedia, updateMedia, reorderMedia } = useEditorStore();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<Map<string, number>>(new Map());
  
  const { uploadImage, uploadFile, uploading } = useMediaUpload({
    onSuccess: () => {},
    onError: (error) => {
      toast.error("Erro no upload", { description: error });
    },
    folder: "memories",
  });

  const handleFilesSelected = useCallback(async (files: File[]) => {
    for (const file of files) {
      // Validate file size
      const validation = validateFileSize(file);
      if (!validation.valid) {
        toast.error("Arquivo muito grande", {
          description: validation.error,
          duration: 5000,
        });
        continue;
      }

      const uploadId = generateId();
      const fileType = getFileType(file);
      
      // Add to uploading state
      setUploadingFiles(prev => new Map(prev).set(uploadId, 0));

      try {
        let publicUrl: string | null = null;
        
        if (fileType === 'image') {
          publicUrl = await uploadImage(file);
        } else if (fileType === 'video') {
          publicUrl = await uploadFile(file);
        }

        if (publicUrl) {
          const mediaItem: MediaItem = {
            id: generateId(),
            type: fileType === 'video' ? 'video' : 'image',
            url: publicUrl,
            order: media.length,
          };
          addMedia(mediaItem);
          toast.success("Upload concluído!", {
            description: `${file.name} foi adicionado.`,
          });
        }
      } catch (error) {
        toast.error("Falha no upload", {
          description: `Erro ao enviar ${file.name}`,
        });
      } finally {
        setUploadingFiles(prev => {
          const newMap = new Map(prev);
          newMap.delete(uploadId);
          return newMap;
        });
      }
    }
  }, [uploadImage, uploadFile, addMedia, media.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFilesSelected,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif'],
      'video/*': ['.mp4', '.webm', '.mov', '.avi'],
    },
    multiple: true,
  });

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      reorderMedia(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleRemove = (id: string) => {
    removeMedia(id);
    toast.success("Mídia removida");
  };

  const handleCaptionChange = (id: string, caption: string) => {
    updateMedia(id, { caption });
  };

  const isUploading = uploadingFiles.size > 0 || uploading;

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ImageIcon className="w-5 h-5 text-violet-500" />
          Galeria de Mídia
        </CardTitle>
        <CardDescription>
          Adicione fotos e vídeos à sua memória. Arraste para reordenar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Zone */}
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-all duration-200 ease-in-out
            ${isDragActive 
              ? "border-violet-500 bg-violet-50 dark:bg-violet-950/20" 
              : "border-gray-200 dark:border-gray-700 hover:border-violet-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            }
            ${isUploading ? "pointer-events-none opacity-60" : ""}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center gap-3">
            {isUploading ? (
              <>
                <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enviando arquivos...
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="bg-violet-100 dark:bg-violet-900/30 p-3 rounded-full">
                    <ImageIcon className="w-6 h-6 text-violet-600" />
                  </div>
                  <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-full">
                    <Video className="w-6 h-6 text-pink-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {isDragActive ? "Solte os arquivos aqui..." : "Arraste fotos ou vídeos aqui"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ou clique para selecionar
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-gray-600 dark:text-gray-400">
                    Imagens até {UPLOAD_LIMITS.IMAGE_MAX_SIZE_MB}MB
                  </span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-gray-600 dark:text-gray-400">
                    Vídeos até {UPLOAD_LIMITS.VIDEO_MAX_SIZE_MB}MB
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Media Grid */}
        {media.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {media.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  group relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800
                  border-2 transition-all duration-200 cursor-move
                  ${draggedIndex === index 
                    ? "border-violet-500 scale-95 opacity-50" 
                    : "border-transparent hover:border-violet-300"
                  }
                `}
              >
                {/* Media Content */}
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.caption || "Memória"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                  />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Drag Handle */}
                  <div className="absolute top-2 left-2 bg-white/20 backdrop-blur-sm p-1 rounded">
                    <GripVertical className="w-4 h-4 text-white" />
                  </div>
                  
                  {/* Type Badge */}
                  <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1">
                    {item.type === "image" ? (
                      <ImageIcon className="w-3 h-3 text-white" />
                    ) : (
                      <Video className="w-3 h-3 text-white" />
                    )}
                    <span className="text-xs text-white font-medium">
                      {item.type === "image" ? "Foto" : "Vídeo"}
                    </span>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute bottom-2 right-2 bg-red-500 hover:bg-red-600 p-2 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>

                  {/* Order Number */}
                  <div className="absolute bottom-2 left-2 bg-violet-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                </div>

                {/* Caption Input (shown on hover or focus) */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <Input
                    placeholder="Adicionar legenda..."
                    value={item.caption || ""}
                    onChange={(e) => handleCaptionChange(item.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white/20 border-0 text-white placeholder:text-white/60 text-sm h-8"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {media.length === 0 && !isUploading && (
          <div className="text-center py-8 text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhuma mídia adicionada ainda</p>
            <p className="text-xs mt-1">Adicione fotos e vídeos para começar</p>
          </div>
        )}

        {/* Media Count */}
        {media.length > 0 && (
          <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
            <span>{media.length} {media.length === 1 ? 'item' : 'itens'}</span>
            <span className="text-xs">
              Arraste para reordenar
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
