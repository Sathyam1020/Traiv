import { ImageResponse } from "next/og";

/**
 * A rendered PNG, not the old static `icon.svg`.
 *
 * Google's own favicon guidelines (developers.google.com/search/docs/appearance/favicon-in-search)
 * list BMP/GIF/ICO/PNG/JPEG/PPM/TIFF as supported — SVG is not on that list, which is why
 * Search kept showing a generic globe instead of this mark even though every browser tab
 * rendered the SVG file correctly. Same paths as the old icon.svg, rendered through
 * ImageResponse so the file Google actually indexes is a PNG.
 */
export const size = { width: 256, height: 256 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <svg
      width={256}
      height={256}
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Traiv symbol"
    >
      <path
        fill="#2459B8"
        d="M30 99 C43 72 59 63 90 63 H270 L255 94 C241 123 221 136 191 136 H17 Z"
      />
      <path
        fill="#182D4B"
        d="M116 146 H188 L125 274 C118 288 107 294 91 294 H34 L93 164 C98 152 104 146 116 146 Z"
      />
    </svg>,
    { ...size },
  );
}
