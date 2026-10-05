/**
 * The Traiv mark: a T with downward tabs at the arms, inside a rounded square.
 *
 * Four rounded rectangles on one radius, on a 24-unit grid — no curves to get wrong at
 * small sizes, and the whole thing stays legible at 16px where a favicon lives. The
 * container is deliberately part of the mark rather than an app-icon wrapper, because
 * that is what makes it read at a glance in a sidebar next to the wordmark.
 *
 * Both colours come from props, not tokens, so the mark can sit on a light surface, on
 * `bg-contrast`, or inside an OS app icon without the palette following the theme
 * somewhere it should not. See `.ai/design/colors.md`.
 */
export type LogoProps = {
  /** Edge length in px. 16 is the favicon floor; 28 is the sidebar size. */
  size?: number;
  /** The rounded square. */
  bg?: string;
  /** The glyph. */
  fg?: string;
  /** Paired with visible text, so the mark itself should announce nothing. */
  decorative?: boolean;
  className?: string;
};

export function Logo({
  size = 28,
  bg = "currentColor",
  fg = "var(--color-surface)",
  decorative = false,
  className,
}: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": "Traiv" })}
    >
      <rect width="24" height="24" rx="5.4" fill={bg} />
      {/* crossbar */}
      <rect x="5.6" y="7" width="12.8" height="2.8" rx="1.4" fill={fg} />
      {/* the two tabs that turn a plain T into the mark */}
      <rect x="5.6" y="7" width="2.8" height="5.4" rx="1.4" fill={fg} />
      <rect x="15.6" y="7" width="2.8" height="5.4" rx="1.4" fill={fg} />
      {/* stem — 7 units of margin above and below, so the glyph sits optically centred */}
      <rect x="10.6" y="7" width="2.8" height="10" rx="1.4" fill={fg} />
    </svg>
  );
}

export type WordmarkProps = {
  size?: number;
  className?: string;
};

/**
 * Mark plus name. The name is live text in Inter rather than part of the SVG — it stays
 * selectable, it is read by a screen reader, and it never ships a second copy of the
 * typeface. The mark's own label is hidden here so the pair announces once.
 */
export function Wordmark({ size = 26, className }: WordmarkProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <Logo size={size} decorative />
      <span className="text-subheading font-semibold tracking-[-0.02em]">Traiv</span>
    </span>
  );
}
