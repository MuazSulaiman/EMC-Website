// lucide-react dropped brand/logo icons; these two are hand-drawn minimal
// glyphs since Section 2.1's verified socials (X, Instagram) need an icon.
import type { SVGProps } from "react";

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.9 2.1h3.3l-7.2 8.2 8.5 11.6h-6.6l-5.2-6.8-5.9 6.8H1.5l7.7-8.8L1 2.1h6.8l4.7 6.2zm-1.2 17.8h1.8L7 4h-1.9z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
