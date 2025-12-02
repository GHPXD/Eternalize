"use client";

import { useEditorStore } from "@/store/editor-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Type, 
  FileText, 
  Palette, 
  Music, 
  Mic,
  Info
} from "lucide-react";
import { MusicUploader } from "./music-uploader";

// Preset colors for quick selection
const PRESET_COLORS = [
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
  "#6366f1", // Indigo
  "#a855f7", // Purple
];

export function EditorSidebar() {
  const {
    title,
    description,
    primaryColor,
    musicUrl,
    setTitle,
    setDescription,
    setPrimaryColor,
    setMusicUrl,
  } = useEditorStore();

  return (
    <div className="space-y-4">
      {/* Basic Info Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="w-5 h-5 text-violet-500" />
            Informações Básicas
          </CardTitle>
          <CardDescription>
            Preencha o título e descrição da sua memória
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <Type className="w-4 h-4 text-gray-500" />
              Título <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Dê um título especial..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="focus:ring-violet-500 focus:border-violet-500"
            />
            <p className="text-xs text-gray-500 text-right">
              {title.length}/100
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              Descrição <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Conte a história por trás desta memória..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              maxLength={2000}
              className="resize-none focus:ring-violet-500 focus:border-violet-500"
            />
            <p className="text-xs text-gray-500 text-right">
              {description.length}/2000
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="w-5 h-5 text-pink-500" />
            Aparência
          </CardTitle>
          <CardDescription>
            Personalize as cores da sua memória
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Color Picker */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              Cor Principal
            </Label>
            
            {/* Preset Colors */}
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setPrimaryColor(color)}
                  className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${
                    primaryColor === color
                      ? "ring-2 ring-offset-2 ring-violet-500"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            
            {/* Custom Color */}
            <div className="flex items-center gap-3 pt-2">
              <div className="relative">
                <Input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
              </div>
              <Input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#8b5cf6"
                className="font-mono text-sm flex-1"
                maxLength={7}
              />
            </div>
          </div>
          
          {/* Preview */}
          <div 
            className="h-20 rounded-lg flex items-center justify-center text-white font-medium shadow-inner"
            style={{ backgroundColor: primaryColor }}
          >
            Preview da cor
          </div>
        </CardContent>
      </Card>

      {/* Music Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Music className="w-5 h-5 text-green-500" />
            Música de Fundo
          </CardTitle>
          <CardDescription>
            Adicione uma música para tocar na sua memória
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MusicUploader
            currentUrl={musicUrl}
            onUrlChange={setMusicUrl}
          />
        </CardContent>
      </Card>
    </div>
  );
}
