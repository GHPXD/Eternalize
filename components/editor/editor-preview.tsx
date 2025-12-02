"use client";

import { useEditorStore } from "@/store/editor-store";
import { 
  Heart, 
  Music, 
  Image as ImageIcon,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Share2,
  Smartphone,
  Monitor
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditorPreviewProps {
  mode?: "sidebar" | "fullscreen";
  className?: string;
}

export function EditorPreview({ mode = "fullscreen", className }: EditorPreviewProps) {
  const { title, description, primaryColor, musicUrl, media } = useEditorStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const images = media.filter(m => m.type === "image");
  const videos = media.filter(m => m.type === "video");

  useEffect(() => {
    if (musicUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, musicUrl]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev < images.length - 1 ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev > 0 ? prev - 1 : images.length - 1
    );
  };

  // Auto-advance images
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev < images.length - 1 ? prev + 1 : 0
      );
    }, 4000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  // Sidebar mode = compact preview for split view
  const isSidebar = mode === "sidebar";
  const phoneMaxWidth = isSidebar ? "280px" : "375px";

  return (
    <div className={cn(
      "flex flex-col h-full",
      isSidebar ? "sticky top-20" : "max-w-2xl mx-auto",
      className
    )}>
      {/* View Mode Toggle (only in fullscreen) */}
      {!isSidebar && (
        <div className="flex items-center justify-center gap-2 mb-4">
          <Button
            variant={viewMode === "mobile" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("mobile")}
            className="gap-2"
          >
            <Smartphone className="w-4 h-4" />
            Mobile
          </Button>
          <Button
            variant={viewMode === "desktop" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("desktop")}
            className="gap-2"
          >
            <Monitor className="w-4 h-4" />
            Desktop
          </Button>
        </div>
      )}

      {/* Preview Container */}
      <div className={cn(
        "flex-1 flex items-start justify-center",
        isSidebar ? "p-2" : "p-4"
      )}>
        {/* Phone Frame */}
        <div 
          className="relative mx-auto w-full transition-all duration-300"
          style={{ maxWidth: viewMode === "desktop" && !isSidebar ? "100%" : phoneMaxWidth }}
        >
          {/* Phone Border - frame do celular */}
          <div 
            className={cn(
              "shadow-2xl transition-all duration-300 overflow-hidden",
              isSidebar 
                ? "bg-gray-900 rounded-[1.75rem] p-[3px]" 
                : viewMode === "desktop" 
                  ? "bg-gray-900 rounded-xl p-1" 
                  : "bg-gray-900 rounded-[3rem] p-2"
            )}
          >
            {/* Screen */}
            <div 
              className={cn(
                "relative overflow-hidden bg-white transition-all duration-300",
                isSidebar ? "rounded-[1.5rem]" : ""
              )}
              style={{ 
                borderRadius: !isSidebar ? (viewMode === "desktop" ? "0.75rem" : "2.5rem") : undefined,
                aspectRatio: isSidebar ? "9/16" : (viewMode === "desktop" ? "16/10" : "9/19.5"),
              }}
            >
              {/* Dynamic Island / Notch */}
              {(viewMode === "mobile" || isSidebar) && (
                <div className={cn(
                  "absolute top-1 left-0 right-0 z-20 flex items-center justify-center",
                  isSidebar ? "top-1" : "top-2"
                )}>
                  <div 
                    className="bg-black rounded-full"
                    style={{ 
                      width: isSidebar ? "45px" : "90px", 
                      height: isSidebar ? "14px" : "26px" 
                    }} 
                  />
                </div>
              )}

              {/* Content */}
              <div 
                className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300"
                style={{ 
                  background: `linear-gradient(to bottom, ${primaryColor}22, white)` 
                }}
              >
                {/* Hero Image Slider */}
                {images.length > 0 ? (
                  <div className={cn(
                    "relative overflow-hidden",
                    viewMode === "desktop" && !isSidebar ? "aspect-[21/9]" : "aspect-[4/3]"
                  )}>
                    <img
                      src={images[currentImageIndex]?.url}
                      alt={images[currentImageIndex]?.caption || "Memória"}
                      className="w-full h-full object-cover transition-opacity duration-500"
                    />
                    
                    {/* Gradient Overlay */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to bottom, transparent 50%, ${primaryColor}99)`
                      }}
                    />

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className={cn(
                            "absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/50 transition-colors",
                            isSidebar ? "w-6 h-6" : "w-8 h-8"
                          )}
                        >
                          <ChevronLeft className={isSidebar ? "w-4 h-4 text-white" : "w-5 h-5 text-white"} />
                        </button>
                        <button
                          onClick={nextImage}
                          className={cn(
                            "absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/50 transition-colors",
                            isSidebar ? "w-6 h-6" : "w-8 h-8"
                          )}
                        >
                          <ChevronRight className={isSidebar ? "w-4 h-4 text-white" : "w-5 h-5 text-white"} />
                        </button>
                      </>
                    )}

                    {/* Dots Indicator */}
                    {images.length > 1 && (
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={cn(
                              "rounded-full transition-all",
                              isSidebar ? "w-1.5 h-1.5" : "w-2 h-2",
                              index === currentImageIndex
                                ? `bg-white ${isSidebar ? "w-3" : "w-4"}`
                                : "bg-white/50"
                            )}
                          />
                        ))}
                      </div>
                    )}

                    {/* Caption */}
                    {images[currentImageIndex]?.caption && !isSidebar && (
                      <div className="absolute bottom-8 left-4 right-4 text-center">
                        <p className="text-white text-sm font-medium drop-shadow-lg">
                          {images[currentImageIndex].caption}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Empty state placeholder
                  <div 
                    className={cn(
                      "flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200",
                      viewMode === "desktop" && !isSidebar ? "aspect-[21/9]" : "aspect-[4/3]"
                    )}
                  >
                    <div className="text-center text-gray-400">
                      <ImageIcon className={cn(
                        "mx-auto mb-2",
                        isSidebar ? "w-8 h-8" : "w-12 h-12"
                      )} />
                      <p className={isSidebar ? "text-xs" : "text-sm"}>
                        Adicione fotos
                      </p>
                    </div>
                  </div>
                )}

                {/* Content Section */}
                <div className={cn(
                  "space-y-3",
                  isSidebar ? "p-3" : "p-6 space-y-4"
                )}>
                  {/* Title */}
                  <div className="text-center">
                    <div 
                      className={cn(
                        "inline-flex items-center justify-center rounded-full mb-2",
                        isSidebar ? "w-8 h-8" : "w-12 h-12 mb-3"
                      )}
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Heart 
                        className={isSidebar ? "w-4 h-4 text-white" : "w-6 h-6 text-white"} 
                        fill="white" 
                      />
                    </div>
                    <h1 
                      className={cn(
                        "font-bold leading-tight",
                        isSidebar ? "text-base" : "text-2xl"
                      )}
                      style={{ color: primaryColor }}
                    >
                      {title || "Título da Memória"}
                    </h1>
                  </div>

                  {/* Description */}
                  <p className={cn(
                    "text-gray-600 leading-relaxed text-center",
                    isSidebar ? "text-xs line-clamp-3" : "text-sm"
                  )}>
                    {description || "A descrição da sua memória aparecerá aqui..."}
                  </p>

                  {/* Media Stats */}
                  <div className={cn(
                    "flex items-center justify-center gap-3 py-2",
                    isSidebar ? "text-xs" : "gap-4 py-4 text-sm"
                  )}>
                    {images.length > 0 && (
                      <div className="flex items-center gap-1 text-gray-500">
                        <ImageIcon className={isSidebar ? "w-3 h-3" : "w-4 h-4"} />
                        <span>{images.length}</span>
                      </div>
                    )}
                    {videos.length > 0 && (
                      <div className="flex items-center gap-1 text-gray-500">
                        <Play className={isSidebar ? "w-3 h-3" : "w-4 h-4"} />
                        <span>{videos.length}</span>
                      </div>
                    )}
                    {musicUrl && (
                      <div className="flex items-center gap-1 text-gray-500">
                        <Music className={isSidebar ? "w-3 h-3" : "w-4 h-4"} />
                      </div>
                    )}
                  </div>

                  {/* Additional Images Grid (compact in sidebar) */}
                  {images.length > 1 && !isSidebar && (
                    <div className="grid grid-cols-3 gap-2">
                      {images.slice(0, 6).map((img, index) => (
                        <div 
                          key={img.id}
                          className="aspect-square rounded-lg overflow-hidden cursor-pointer"
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img
                            src={img.url}
                            alt={img.caption || ""}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                      {images.length > 6 && (
                        <div 
                          className="aspect-square rounded-lg overflow-hidden flex items-center justify-center cursor-pointer"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <span className="text-white font-bold">+{images.length - 6}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Videos (hidden in sidebar mode) */}
                  {videos.length > 0 && !isSidebar && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-700">Vídeos</h3>
                      {videos.map((video) => (
                        <div key={video.id} className="rounded-xl overflow-hidden">
                          <video
                            src={video.url}
                            controls
                            className="w-full"
                            poster={images[0]?.url}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Share Button */}
                  {!isSidebar && (
                    <div className="pt-4">
                      <Button 
                        className="w-full"
                        style={{ 
                          backgroundColor: primaryColor,
                          color: 'white'
                        }}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartilhar Memória
                      </Button>
                    </div>
                  )}

                  {/* Footer */}
                  <div className={cn(
                    "text-center",
                    isSidebar ? "pt-2 pb-4" : "pt-4 pb-8"
                  )}>
                    <p className={cn(
                      "text-gray-400",
                      isSidebar ? "text-[10px]" : "text-xs"
                    )}>
                      Criado com ❤️ no Eternizale
                    </p>
                  </div>
                </div>
              </div>

              {/* Music Player (if music exists) */}
              {musicUrl && (
                <>
                  <audio ref={audioRef} src={musicUrl} loop />
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={cn(
                      "absolute right-2 rounded-full shadow-lg flex items-center justify-center z-10 transition-transform hover:scale-105",
                      isSidebar ? "bottom-6 w-7 h-7" : "bottom-24 right-4 w-12 h-12"
                    )}
                    style={{ backgroundColor: primaryColor }}
                  >
                    {isPlaying ? (
                      <Pause className={cn(isSidebar ? "w-3 h-3" : "w-5 h-5", "text-white")} fill="white" />
                    ) : (
                      <Play className={cn(isSidebar ? "w-3 h-3" : "w-5 h-5", "text-white ml-0.5")} fill="white" />
                    )}
                  </button>
                </>
              )}

              {/* Home Indicator */}
              {(viewMode === "mobile" || isSidebar) && (
                <div className={cn(
                  "absolute left-0 right-0 flex justify-center",
                  isSidebar ? "bottom-1" : "bottom-2"
                )}>
                  <div 
                    className="bg-gray-800 rounded-full"
                    style={{ 
                      width: isSidebar ? "40px" : "100px", 
                      height: isSidebar ? "3px" : "4px" 
                    }} 
                  />
                </div>
              )}
            </div>
          </div>

          {/* Preview Label */}
          {!isSidebar && (
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                {viewMode === "mobile" ? "Visualização no celular" : "Visualização no desktop"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                É assim que sua memória ficará quando compartilhada
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Label */}
      {isSidebar && (
        <div className="text-center py-2 border-t bg-gray-50/50">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <Smartphone className="w-3 h-3" />
            Preview em tempo real
          </p>
        </div>
      )}
    </div>
  );
}
