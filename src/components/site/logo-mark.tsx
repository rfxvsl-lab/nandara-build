import { useId } from "react";

/**
 * Ikon logo Nandara Build (atap + gedung) sebagai SVG tajam di semua ukuran.
 * Digambar ulang dari logo asli. Ganti dengan file vektor resmi bila sudah tersedia.
 */
export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  const g = `nb-gold-${id}`;
  return (
    <svg
      viewBox="0 0 60 44"
      width={size}
      height={(size * 44) / 60}
      className={className}
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0dfa8" />
          <stop offset="0.5" stopColor="#c9a35a" />
          <stop offset="1" stopColor="#9a7a3c" />
        </linearGradient>
      </defs>
      {/* Atap: dua garis sejajar */}
      <path
        d="M2 34 L21 15.5 L47 40"
        fill="none"
        stroke={`url(#${g})`}
        strokeWidth="2.6"
        strokeLinejoin="miter"
        strokeLinecap="butt"
      />
      <path
        d="M7 35 L21 21.5 L41.5 40"
        fill="none"
        stroke={`url(#${g})`}
        strokeWidth="1.6"
        strokeLinejoin="miter"
        strokeLinecap="butt"
      />
      {/* Gedung: batang vertikal */}
      <rect x="39" y="12" width="2.6" height="28" fill={`url(#${g})`} />
      <rect x="43" y="6" width="2.6" height="34" fill={`url(#${g})`} />
      <rect x="47" y="2" width="2.6" height="38" fill={`url(#${g})`} />
      <rect x="51" y="8" width="2.6" height="32" fill={`url(#${g})`} />
      <rect x="55" y="18" width="2.6" height="22" fill={`url(#${g})`} />
    </svg>
  );
}
