import Link from "next/link"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

async function checkAdminAccess() {
  const adminSecret = process.env.ADMIN_SECRET

  if (!adminSecret) {
    console.warn("ADMIN_SECRET not configured")
    return false
  }

  const headersList: any = headers()
  const adminAuth = headersList.get('x-admin-auth') ||
    headersList.get('cookie')?.includes(`admin_auth=${adminSecret}`)

  return adminAuth === adminSecret ||
    headersList.get('cookie')?.includes(`admin_auth=${adminSecret}`)
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const hasAccess = await checkAdminAccess()

  if (!hasAccess) {
    redirect('/admin/login')
  }

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
          <div className="flex items-center gap-4">
            <span className="text-xs text-green-600">Admin</span>
            <form action="/admin/logout" method="POST">
              <button
                type="submit"
                className="text-xs text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-4 pt-16">{children}</main>
    </div>
  )
}