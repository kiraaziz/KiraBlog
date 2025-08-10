"use client";

import { useCallback, useState } from "react";
import { supabase } from "@/utils/server/supabase";
import { useCreateMedia } from "@/utils/hooks/useMedia";

export type UploadResult = {
  path: string;
  publicUrl: string | null;
};

export function useUploadFile(bucket: string) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createMedia = useCreateMedia;

  const upload = useCallback(
    async (file: File, path?: string): Promise<UploadResult> => {
      setIsUploading(true);
      setError(null);
      try {
        const filePath = path ?? `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        const publicUrl = data?.publicUrl ?? null;

        await createMedia({
          url: publicUrl,
          type: file.type,
          title: file.name,
          size: file.size,
          path: filePath
        });

        return { path: filePath, publicUrl };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [bucket, createMedia]
  );

  return { upload, isUploading, error };
}
