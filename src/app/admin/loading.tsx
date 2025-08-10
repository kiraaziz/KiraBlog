export default function AdminLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex items-center gap-3 text-neutral-700">
        <span className="h-3 w-3 animate-ping rounded-full bg-primary" />
        <span className="h-3 w-3 animate-ping rounded-full bg-primary [animation-delay:150ms]" />
        <span className="h-3 w-3 animate-ping rounded-full bg-primary [animation-delay:300ms]" />
        <span className="ml-2">Loading admin…</span>
      </div>
    </div>
  );
}


