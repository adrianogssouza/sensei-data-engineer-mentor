import Link from "next/link";
import type { ReactNode } from "react";

type WorkspaceCardProps = {
  description: string;
  href: string;
  title: string;
  children?: ReactNode;
};

export function WorkspaceCard({
  children,
  description,
  href,
  title,
}: WorkspaceCardProps) {
  return (
    <Link
      className="block border border-zinc-200 p-5 transition-colors hover:border-zinc-500 dark:border-zinc-800 dark:hover:border-zinc-500"
      href={href}
    >
      <h3 className="text-base font-medium text-zinc-950 dark:text-zinc-50">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
      {children ? <div className="mt-4">{children}</div> : null}
    </Link>
  );
}
