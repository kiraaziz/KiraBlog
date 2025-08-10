"use client"
import { useRef, useState } from "react";
import { useUploadFile } from "@/utils/hooks/useUploadFile";
import { useRouter } from "next/navigation";
import { useDeleteMedia } from "@/utils/hooks/useMedia";

type MediaActionProps = {
    id: number;
    url: string;
    path?: string;
    bucket?: string;
};

const UploadMedia = () => {

    const inputRef = useRef<any>(null)

    const router = useRouter()
    const { upload, isUploading, error } = useUploadFile("images");
    const onPick = () => inputRef.current?.click();

    const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await upload(file);

        if (inputRef.current) {
            inputRef.current.value = "";
        }

        router.refresh()
    };

    return (
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Gallery</h1>
            <div className="flex items-center gap-3">
                <input ref={inputRef} type="file" accept="image/*,video/*" className="hidden" onChange={onChange} />
                <button onClick={onPick} disabled={isUploading} className="rounded bg-primary px-4 py-2 font-medium text-white disabled:opacity-50">
                    {isUploading ? "Uploading…" : "Upload File"}
                </button>
                {error && <span className="text-sm text-red-600">{error}</span>}
            </div>
        </div>
    )
}

const MediaAction = ({ id, url, path, bucket = "images" }: MediaActionProps) => {
    const [loading, setLoading] = useState<"delete" | "copy" | null>(null);
    const [copied, setCopied] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setLoading("delete");
        try {
            await useDeleteMedia(id, path, bucket);
            router.refresh();
        } catch (e) {
            // handle error if needed
        } finally {
            setLoading(null);
        }
    };

    const handleCopy = async () => {
        setLoading("copy");
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch (e) {
            // handle error if needed
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={handleCopy}
                disabled={loading === "copy"}
                className={`rounded bg-blue-600 px-2 py-1 text-xs text-white transition hover:cursor-pointer hover:bg-blue-700 flex items-center gap-1 disabled:opacity-50`}
                title="Copy URL"
            >
                {loading === "copy" ? (
                    <span className="loader border-white border-t-transparent border-2 rounded-full w-3 h-3 inline-block animate-spin"></span>
                ) : (
                    <svg width="14" height="14" fill="none" viewBox="0 0 20 20"><path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><rect x="3" y="9" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" /></svg>
                )}
                {copied ? "Copied!" : "Copy URL"}
            </button>
            <button
                onClick={handleDelete}
                disabled={loading === "delete"}
                className={`rounded bg-red-600 px-2 py-1 text-xs text-white transition hover:cursor-pointer hover:bg-red-700 flex items-center gap-1 disabled:opacity-50`}
                title="Delete"
            >
                {loading === "delete" ? (
                    <span className="loader border-white border-t-transparent border-2 rounded-full w-3 h-3 inline-block animate-spin"></span>
                ) : (
                    <svg width="14" height="14" fill="none" viewBox="0 0 20 20"><path d="M6 6l8 8M6 14L14 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                )}
                Delete
            </button>
        </div>
    );
};

export { MediaAction };
export default UploadMedia