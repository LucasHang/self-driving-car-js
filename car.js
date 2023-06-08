const DEFAULT_ANGLE_INCREASE = 0.015;

class Car {
  /**
   * @param {{
   *  x: number;
   *  y: number;
   *  width: number;
   *  height: number;
   *  controlType: 'keys' | 'dummy';
   *  maxSpeed?: number;
   * }} params
   */
  constructor(params) {
    this.x = params.x;
    this.y = params.y;
    this.width = params.width;
    this.height = params.height;

    this.speed = 0;
    this.acceleration = 0.15;
    this.maxSpeed = params.maxSpeed || 3;
    this.friction = 0.05;
    this.angle = 0;
    this.damaged = false;

    if (params.controlType !== "dummy") {
      this.sensor = new Sensor(this);
    }
    this.controls = new Controls(params.controlType);
  }

  /**
   * @param {[{ x: number, y:number }, { x: number, y:number }][]} roadBorders
   * @param {any[]} traffic Array of Cars actually
   */
  update(roadBorders, traffic) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders, traffic);
    }

    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
    }
  }

  /**
   * @param {[{ x: number, y:number }, { x: number, y:number }][]} roadBorders
   * @param {any[]} traffic Array of Cars actually
   */
  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }

    return false;
  }

  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    const topRightCorner = {
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    };
    const bottomRightCorner = {
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    };
    const topLeftCorner = {
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    };
    const bottomLeftCorner = {
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    };

    points.push(
      topRightCorner,
      bottomRightCorner,
      topLeftCorner,
      bottomLeftCorner
    );

    return points;
  }

  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }

    const maxReverseSpeed = -this.maxSpeed / 2;

    if (this.speed < maxReverseSpeed) {
      this.speed = maxReverseSpeed;
    }

    const isMovingForward = this.speed > 0;

    if (isMovingForward) {
      this.speed -= this.friction;
    }

    const isMovingReverse = this.speed < 0;

    if (isMovingReverse) {
      this.speed += this.friction;
    }

    const isStoppedByFriction = Math.abs(this.speed) < this.friction;

    if (isStoppedByFriction) {
      this.speed = 0;
    }

    const isMoving = this.speed != 0;

    if (isMoving) {
      const flip = this.speed > 0 ? 1 : -1;

      if (this.controls.left) {
        this.angle += DEFAULT_ANGLE_INCREASE * flip;
      }

      if (this.controls.right) {
        this.angle -= DEFAULT_ANGLE_INCREASE * flip;
      }
    }

    /**
     * The horizontal progression in coordinates given the angle (`Math.sin(this.angle)`), enhanced by the speed
     * `Math.sin(this.angle)` is betweehn the interval [-1, 1], because it is based on a unity circle
     */
    this.x -= Math.sin(this.angle) * this.speed;
    /**
     * The vertical progression in coordinates given the angle (`Math.cos(this.angle)`), enhanced by the speed
     * `Math.cos(this.angle)` is betweehn the interval [-1, 1], because it is based on a unity circle
     */
    this.y -= Math.cos(this.angle) * this.speed;
  }

  /**
   * @param {any} ctx A canvas 2d context
   * @param {string | undefined} color The undameged color of the car
   */
  draw(ctx, color = "black") {
    ctx.fillStyle = this.damaged ? "gray" : color;

    ctx.beginPath();

    const firstPolygonPoint = this.polygon[0];
    ctx.moveTo(firstPolygonPoint.x, firstPolygonPoint.y);

    for (let i = 1; i < this.polygon.length; i++) {
      const polygonPoint = this.polygon[i];
      ctx.lineTo(polygonPoint.x, polygonPoint.y);
    }

    ctx.fill();

    if (this.sensor) {
      this.sensor.draw(ctx);
    }
  }
}
