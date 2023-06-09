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
 * Actually the `lerp` function is the base here, for 2 segments we have 4 points,
 * and an intersection would be a point where all lerp function for these 4 points converge.
 * The lerp function receveis a `t` value, and since we have 2 segments there would be one equivalent `t` value for each.
 * So all the math done here is to write the first segment `t` in function of the second segment `t`
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

/**
 * @param {{ x: number; y: number; }[]} poly1
 * @param {{ x: number; y: number; }[]} poly2
 */
function polysIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const point1 = poly1[i];
      // in the last index, the module operator will return 0
      const iNextIndex = (i + 1) % poly1.length;
      const point2 = poly1[iNextIndex];

      const point3 = poly2[j];
      // in the last index, the module operator will return 0
      const jNextIndex = (j + 1) % poly2.length;
      const point4 = poly2[jNextIndex];

      const touch = getIntersection([point1, point2], [point3, point4]);

      if (touch) {
        return true;
      }
    }
  }

  return false;
}

/**
 * @param {number} value Between -1 and 1
 */
function getRGBA(value) {
  const alpha = Math.abs(value);
  // Making so that we have yellow for connections with positive value and blue for negative values
  const R = value < 0 ? 0 : 255;
  const G = R;
  const B = value > 0 ? 0 : 255;

  return `rgba(${R}, ${G}, ${B}, ${alpha})`;
}
