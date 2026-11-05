export type LogoProps = {
  size?: number;
  /** Optional surface behind the transparent mark. */
  bg?: string;
  /** Override both mark colors for monochrome uses. */
  fg?: string;
  decorative?: boolean;
  className?: string;
};

const wing = "M30 99 C43 72 59 63 90 63 H270 L255 94 C241 123 221 136 191 136 H17 Z";
const stem = "M116 146 H188 L125 274 C118 288 107 294 91 294 H34 L93 164 C98 152 104 146 116 146 Z";

export function Logo({ size = 28, bg, fg, decorative = false, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "Traiv"}
      aria-hidden={decorative || undefined}
    >
      {bg ? <rect width="300" height="300" rx="60" fill={bg} /> : null}
      <path fill={fg ?? "#2459B8"} d={wing} />
      <path fill={fg ?? "#182D4B"} d={stem} />
    </svg>
  );
}

export type WordmarkProps = { size?: number; className?: string };

/** Original supplied wordmark; size controls its height. */
export function Wordmark({ size = 26, className }: WordmarkProps) {
  return (
    <svg
      width={(size * 1040) / 310}
      height={size}
      viewBox="0 0 1040 310"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Traiv"
      className={className}
    >
      <path fill="#2459B8" d={wing} />
      <path fill="#182D4B" d={stem} />
      <text
        x="313"
        y="236"
        fill="#182D4B"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="205"
        fontWeight="800"
        letterSpacing="-10"
      >
        Traiv
      </text>
    </svg>
  );
}
