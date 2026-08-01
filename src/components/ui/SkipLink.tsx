import { cn } from "@/lib/cn";

export interface SkipLinkProps {
  href?: string;
}

/**
 * The first focusable thing on every page.
 *
 * Hidden until focused, then painted over the sticky nav so a keyboard user can
 * see where they are before they press Enter. The outline comes from the global
 * `:focus-visible` rule and is deliberately not transitioned.
 */
export function SkipLink({ href = "#main" }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "sr-only",
        "focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50",
        "focus-visible:inline-flex focus-visible:h-11 focus-visible:items-center",
        "focus-visible:rounded-pill focus-visible:bg-action-primary focus-visible:px-5",
        "focus-visible:text-sm-btn focus-visible:text-action-primary-fg focus-visible:no-underline",
      )}
    >
      Skip to main content
    </a>
  );
}
