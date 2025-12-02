import { useState, useCallback } from "react";
import { uploadToR2 } from "@/lib/r2/upload";
import { compressImageToWebP, validateImageFile } from "@/lib/media/compression";

interface UseMediaUploadOptions {
  onSuccess?: (publicUrl: string) => void;
  onError?: (error: string) => void;
  folder?: string;
}

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
}

interface PresignedUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  key: string;
  error?: string;
}

async function getPresignedUrl(
  fileName: string, 
  fileType: string, 
  folder: string
): Promise<PresignedUrlResponse> {
  const response = await fetch("/api/upload/presigned-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName, fileType, folder }),
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to get presigned URL");
  }
  
  return response.json();
}

export function useMediaUpload(options: UseMediaUploadOptions = {}) {
  const { onSuccess, onError, folder = "memories" } = options;

  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
  });

  const uploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        setState({ uploading: true, progress: 0, error: null });

        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
          throw new Error(validation.error);
        }

        // OPTIMIZED: Compress and convert to WebP format
        // This reduces storage costs and improves performance
        setState((prev) => ({ ...prev, progress: 10 }));
        const webpFile = await compressImageToWebP(file);

        // Get presigned URL from API (WebP filename)
        setState((prev) => ({ ...prev, progress: 20 }));
        const { uploadUrl, publicUrl } = await getPresignedUrl(
          webpFile.name,      // Now ends with .webp
          webpFile.type,      // Now 'image/webp'
          folder
        );

        // Upload WebP file to R2
        await uploadToR2(uploadUrl, webpFile, (progress) => {
          setState((prev) => ({ ...prev, progress: 20 + progress * 0.8 }));
        });

        setState({ uploading: false, progress: 100, error: null });
        onSuccess?.(publicUrl);
        return publicUrl;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        setState({ uploading: false, progress: 0, error: errorMessage });
        onError?.(errorMessage);
        return null;
      }
    },
    [folder, onSuccess, onError]
  );

  const uploadFile = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        setState({ uploading: true, progress: 0, error: null });

        // Get presigned URL from API
        setState((prev) => ({ ...prev, progress: 10 }));
        const { uploadUrl, publicUrl } = await getPresignedUrl(
          file.name,
          file.type,
          folder
        );

        // Upload to R2
        await uploadToR2(uploadUrl, file, (progress) => {
          setState((prev) => ({ ...prev, progress: 10 + progress * 0.9 }));
        });

        setState({ uploading: false, progress: 100, error: null });
        onSuccess?.(publicUrl);
        return publicUrl;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        setState({ uploading: false, progress: 0, error: errorMessage });
        onError?.(errorMessage);
        return null;
      }
    },
    [folder, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({ uploading: false, progress: 0, error: null });
  }, []);

  return {
    uploadImage,
    uploadFile,
    uploading: state.uploading,
    progress: state.progress,
    error: state.error,
    reset,
  };
}
