
import UploadMedia, { MediaAction } from "@/components/Media/Upload";
import { useGetMedia } from "@/utils/hooks/useMedia";

function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  const decimals = i < 2 ? 0 : 1;
  return `${value.toFixed(decimals)} ${sizes[i]}`;
}

export default async function AdminGalleryPage() {
  const media = await useGetMedia();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <UploadMedia />
      {media.length === 0 ? (
        <p className="text-sm text-neutral-600">No media yet. Upload your first file.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {media.map((m: any) => (
            <li key={m.id} className="group relative overflow-hidden rounded border bg-white">
              <img src={m.url} alt={m.path} className="h-40 w-full object-cover" />
              <div className="absolute inset-0 flex flex-col justify-end gap-2 bg-gradient-to-t from-black to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                <a className="truncate text-xs text-white underline" href={m.url} target="_blank" rel="noreferrer">
                  ({formatSize(m.size)}) {m.url}
                </a>
                <MediaAction id={m.id} url={m.url} path={m.path} bucket="images" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
