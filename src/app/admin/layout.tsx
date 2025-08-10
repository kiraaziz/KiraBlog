import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // const isAdmin = cookies().get("admin")?.value === "1";
  // if (!isAdmin) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b bg-white sticky top-0">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/">Home</Link>
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/posts">Posts</Link>
            <Link href="/admin/settings">Settings</Link>
            <Link href="/admin/gallery">Gallery</Link>
            <Link href="/admin/newsletter">Newsletter</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-4 pt-16">{children}</main>
    </div>
  );
}
