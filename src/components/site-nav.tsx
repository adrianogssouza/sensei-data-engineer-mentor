import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/workspace", label: "Workspace" },
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Signup" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteNav() {
  return (
    <nav className="mb-10 flex flex-wrap gap-3 text-sm text-zinc-600 dark:text-zinc-400">
      {links.map((link) => (
        <Link
          className="border border-zinc-200 px-3 py-2 transition-colors hover:border-zinc-500 hover:text-foreground dark:border-zinc-800 dark:hover:border-zinc-500"
          href={link.href}
          key={link.href}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
