/**
 * @note About the canvas coordinates:
 * - 0, 0 point starts at the top left corner of the canvas;
 * - The X dimension increases to the right and decreases to the left (as normal in a cartesian plane)
 * - The Y dimension INCREASES to the bottom and DECREASES to the top (inverse of a cartesian plane)
 */

const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");

const road = new Road({
  x: canvas.width / 2,
  width: canvas.width * 0.9,
});

const car = new Car({
  x: road.getLaneCenter(1),
  y: 100,
  width: 30,
  height: 50,
  controlType: "ai",
});

const traffic = [
  new Car({
    x: road.getLaneCenter(1),
    y: -100,
    width: 30,
    height: 50,
    controlType: "dummy",
    maxSpeed: 2,
  }),
];

animate();

function animate() {
  canvas.height = window.innerHeight;

  ctx.save();

  const cartStartingPosition = -car.y + canvas.height * 0.7;
  // This is what makes the road move under the car instead of the car over the road
  ctx.translate(0, cartStartingPosition);

  road.draw(ctx);

  for (let i = 0; i < traffic.length; i++) {
    const trafficCar = traffic[i];
    trafficCar.update(road.borders, []);
    trafficCar.draw(ctx, "red");
  }

  car.update(road.borders, traffic);
  car.draw(ctx, "blue");

  ctx.restore();

  requestAnimationFrame(animate);
}
