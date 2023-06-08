class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 140;
    this.raySpread = Math.PI / 2; // 45 deg (180deg / 4)

    this.rays = [];
    this.readings = [];
  }

  /**
   * @param {{ x: number, y:number }[][]} roadBorders
   */
  update(roadBorders) {
    this.#castRays();

    this.readings = [];

    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBorders));
    }
  }

  /**
   * @param {[{ x: number, y:number }, { x: number, y:number }]} ray
   * @param {[{ x: number, y:number }, { x: number, y:number }][]} roadBorders
   */
  #getReading(ray, roadBorders) {
    const touches = [];

    for (let i = 0; i < roadBorders.length; i++) {
      const border = roadBorders[i];

      const touch = getIntersection(ray, border);

      if (touch) {
        touches.push(touch);
      }
    }

    if (touches.length === 0) {
      return null;
    }

    const allOffsets = touches.map((item) => item.offset);
    const minOffset = Math.min(...allOffsets);

    return touches.find((item) => item.offset === minOffset);
  }

  #castRays() {
    this.rays = [];

    for (let i = 0; i < this.rayCount; i++) {
      /**
       * I think that `raySpread` is in a 360deg representation
       * but we want to calculate in a unity circel format ([-180, 180])
       * So we divide by 2 because the 360 to 180 maximum degree,
       * and we pass on arg in negative format to represent the other extreme degree
       */
      const rayAngle = lerp(
        this.raySpread / 2,
        -this.raySpread / 2,
        this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
      );

      // Se the sensor turn around with the car
      const actualAngle = rayAngle + this.car.angle;

      const start = {
        x: this.car.x,
        y: this.car.y,
      };

      const end = {
        x: this.car.x - Math.sin(actualAngle) * this.rayLength,
        y: this.car.y - Math.cos(actualAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  /**
   * @param {any} ctx A canvas 2d context
   */
  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      const ray = this.rays[i];

      const rayStartPoint = ray[0];

      let rayEndPoint = ray[1];
      if (this.readings[i]) {
        rayEndPoint = this.readings[i];
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";

      ctx.moveTo(rayStartPoint.x, rayStartPoint.y);
      ctx.lineTo(rayEndPoint.x, rayEndPoint.y);

      ctx.stroke();

      // The rest of the ray that would exists if there were nothing in front of it

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";

      ctx.moveTo(ray[1].x, ray[1].y);
      ctx.lineTo(rayEndPoint.x, rayEndPoint.y);

      ctx.stroke();
    }
  }
}
