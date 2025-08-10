import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/newsletter", label: "Newsletter" },
];

export default function AdminHome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2">
      {links.map((link) => (
        <Link
          className="bg-background/20 w-full max-w-xl p-3 border border-black/10"
          key={link.href}
          href={link.href}
        >
          <span className="relative z-10 text-lg">{link.label}</span>
        </Link>
      ))}
    </div>
  );
}
