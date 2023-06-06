const INFINITY = 1_000_000;
const DEFAULT_LANE_COUNT = 3;

class Road {
  /**
   * @param {{
   *  x: number; // The horizontal coordinate the lane will be positioned
   *  width: number;
   *  laneCount?: number;
   * }} params
   */
  constructor(params) {
    this.x = params.x;
    this.width = params.width;
    this.laneCount = params.laneCount || DEFAULT_LANE_COUNT;

    this.left = params.x - this.width / 2;
    this.right = params.x + this.width / 2;

    this.top = -INFINITY;
    this.bottom = INFINITY;

    /** @todo maybe add courves to the road someday */

    const topLeft = { x: this.left, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const topRight = { x: this.right, y: this.top };
    const bottomRight = { x: this.right, y: this.bottom };

    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  /**
   * @param {number} laneIndex
   */
  getLaneCenter(laneIndex) {
    const baseLaneWith = this.width / this.laneCount;
    const laneIndexWidth = laneIndex * baseLaneWith;
    const laneCenter = this.left + baseLaneWith / 2 + laneIndexWidth;

    return laneCenter;
  }

  /**
   * @param {any} ctx A canvas 2d context
   */
  draw(ctx) {
    this.#drawInnerLanes(ctx);

    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
  }

  /**
   * @param {any} ctx A canvas 2d context
   */
  #drawInnerLanes(ctx) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    for (let i = 1; i <= this.laneCount - 1; i++) {
      // Goes from 0 to 1 varying as percentage vales (similar to `Math.random()`)
      const distanceBetweenLanes = i / this.laneCount;

      const x = lerp(this.left, this.right, distanceBetweenLanes);

      ctx.setLineDash([20, 20]);

      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    ctx.setLineDash([]);
  }
}
