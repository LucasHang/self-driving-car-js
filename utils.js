/**
 * @param {number} A Left limit
 * @param {number} B Right limit
 * @param {number} t Distance of the interpolation
 * @returns
 */
function lerp(A, B, t) {
  return A + (B - A) * t;
}

/**
 * @param {[{ x: number; y: number; }, { x: number; y: number; }]} p1
 * @param {[{ x: number; y: number; }, { x: number; y: number; }]} p2
 * @returns {{
 *  x: number;
 *  y: number;
 *  offset: number;
 * } | null}
 */
function getIntersection(segment1, segment2) {
  const s1p1 = segment1[0];
  const s1p2 = segment1[1];
  const s2p1 = segment2[0];
  const s2p2 = segment2[1];

  const tTop =
    (s2p2.x - s2p1.x) * (s1p1.y - s2p1.y) -
    (s2p2.y - s2p1.y) * (s1p1.x - s2p1.x);

  const uTop =
    (s2p1.y - s1p1.y) * (s1p1.x - s1p2.x) -
    (s2p1.x - s1p1.x) * (s1p1.y - s1p2.y);

  const bottom =
    (s2p2.y - s2p1.y) * (s1p2.x - s1p1.x) -
    (s2p2.x - s2p1.x) * (s1p2.y - s1p1.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(s1p1.x, s1p2.x, t),
        y: lerp(s1p1.y, s1p2.y, t),
        offset: t,
      };
    }
  }

  return null;
}
