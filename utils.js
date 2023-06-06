/**
 * @param {number} A Left limit
 * @param {number} B Right limit
 * @param {number} t Distance of the interpolation
 * @returns
 */
function lerp(A, B, t) {
  return A + (B - A) * t;
}
