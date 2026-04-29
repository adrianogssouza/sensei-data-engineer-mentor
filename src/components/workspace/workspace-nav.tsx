import Link from "next/link";

const workspaceLinks = [
  { href: "/workspace", label: "Overview" },
  { href: "/workspace/chat", label: "Chat" },
  { href: "/workspace/documents", label: "Documents" },
  { href: "/workspace/usage", label: "Usage" },
  { href: "/workspace/settings", label: "Settings" },
];

export function WorkspaceNav() {
  return (
    <nav className="flex flex-col gap-2 text-sm">
      {workspaceLinks.map((link) => (
        <Link
          className="border border-zinc-200 px-3 py-2 text-zinc-700 transition-colors hover:border-zinc-500 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-50"
          href={link.href}
          key={link.href}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
