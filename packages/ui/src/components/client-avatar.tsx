/**
 * A client's face: an organic blob with two eyes, generated from their id.
 *
 * Every client gets a shape and a colour that are theirs and nobody else's, and they
 * get the same one every time — the id is the only input, so the avatar is stable
 * across devices, sessions and renders with nothing stored and nothing fetched.
 *
 * Initials were the alternative and they fail in the two cases that matter here: a
 * roster full of "S" clients is a roster you cannot scan, and a client who has not
 * filled in their name has no initials at all. A shape is recognisable before it is
 * read, which is the whole job of an avatar in a list.
 */

/**
 * Deterministic 32-bit hash. FNV-1a: small, no dependency, and spreads adjacent ids
 * (which UUID v7 produces by the thousand) into unrelated buckets.
 */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 — a tiny seeded PRNG, so one id always yields the same sequence. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Hand-picked rather than generated from the hue wheel.
 *
 * A random hue produces yellows that vanish on white and navies that vanish on the
 * dark rail. These all hold their own against both grounds and all take the same
 * near-black eyes, which is what keeps a roster of thirty looking like one family.
 */
const PALETTE = [
  "#3f9e8c", // teal
  "#4a8fd4", // cornflower
  "#e0784a", // terracotta
  "#7c6bd1", // violet
  "#d46b8a", // rose
  "#5a9e4a", // moss
  "#d9a441", // ochre
  "#4fa3a8", // lagoon
  "#b5635f", // brick
  "#6f8bbf", // slate blue
  "#c2708f", // mallow
  "#55a06d", // fern
] as const;

/**
 * A closed, smooth, irregular loop.
 *
 * Points are placed around a circle at jittered radii, then joined with cubic beziers
 * whose control points come from each point's neighbours (Catmull-Rom). Joining them
 * with straight lines or arcs gives a polygon or a flower; this gives the lopsided,
 * hand-drawn look the shape is supposed to have.
 */
function blobPath(random: () => number, points: number, radius: number, cx: number, cy: number) {
  const spin = random() * Math.PI * 2;
  // Independent squash on each axis. Smoothing pulls any set of jittered points back
  // toward a circle, so radius jitter alone gives a row of near-identical ovals —
  // this is what actually makes one avatar read as wide and the next as tall.
  const sx = 0.88 + random() * 0.24;
  const sy = 0.88 + random() * 0.24;
  const pts = Array.from({ length: points }, (_, i) => {
    const angle = spin + (i / points) * Math.PI * 2;
    // 0.70–1.04 of the base radius. Tuned against a grid of 32 seeds: a narrower
    // range gives a row of eggs, and below about 0.65 the lobes pinch into points
    // and the blob starts reading as a leaf rather than a pebble.
    const r = radius * (0.7 + random() * 0.34);
    return [cx + Math.cos(angle) * r * sx, cy + Math.sin(angle) * r * sy] as const;
  });

  const at = (i: number) => pts[(i + points) % points] as readonly [number, number];
  let d = `M ${at(0)[0].toFixed(2)} ${at(0)[1].toFixed(2)}`;

  for (let i = 0; i < points; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }

  return `${d} Z`;
}

export function ClientAvatar({
  id,
  name,
  size = 34,
}: {
  /** The stable identity. Anything unique per client works; the client id is ideal. */
  id: string;
  /** Used only as the accessible label — never drawn. */
  name?: string;
  size?: number;
}) {
  const random = rng(hash(id));

  const colour = PALETTE[Math.floor(random() * PALETTE.length)] as string;
  // Five to seven. Four produces a triangle with one dominant lobe; eight smooths
  // back toward a circle and the variety disappears.
  const lobes = 5 + Math.floor(random() * 3);
  const path = blobPath(random, lobes, 40, 50, 51);

  // Eyes sit in the upper half and lean slightly, because two identical pupils dead
  // centre reads as a machine and the point of this is that it does not.
  const gap = 16 + random() * 6;
  const eyeY = 44 + random() * 5;
  const eyeW = 8.5 + random() * 2.5;
  const eyeH = 20 + random() * 7;
  const tilt = -8 + random() * 16;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={name ? `${name}'s avatar` : "Client avatar"}
      className="shrink-0 overflow-visible"
    >
      <title>{name ? `${name}'s avatar` : "Client avatar"}</title>
      <path d={path} fill={colour} />
      <g transform={`rotate(${tilt.toFixed(1)} 50 ${eyeY.toFixed(1)})`} fill="#141414">
        <rect
          x={50 - gap / 2 - eyeW}
          y={eyeY - eyeH / 2}
          width={eyeW}
          height={eyeH}
          rx={eyeW / 2}
        />
        <rect
          x={50 + gap / 2}
          y={eyeY - eyeH / 2 + (random() * 3 - 1.5)}
          width={eyeW}
          height={eyeH * (0.85 + random() * 0.3)}
          rx={eyeW / 2}
        />
      </g>
    </svg>
  );
}
