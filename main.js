/**
 * @note About the canvas coordinates:
 * - 0, 0 point starts at the top left corner of the canvas;
 * - The X dimension increases to the right and decreases to the left (as normal in a cartesian plane)
 * - The Y dimension INCREASES to the bottom and DECREASES to the top (inverse of a cartesian plane)
 */

const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 400;

const carCtx = carCanvas.getContext("2d");

const networkCtx = networkCanvas.getContext("2d");

const road = new Road({
  x: carCanvas.width / 2,
  width: carCanvas.width * 0.9,
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

/**
 * @param {number | undefined} time Passed by `requestAnimationFrame`
 */
function animate(time) {
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();

  const cartStartingPosition = -car.y + carCanvas.height * 0.7;
  // This is what makes the road move under the car instead of the car over the road
  carCtx.translate(0, cartStartingPosition);

  road.draw(carCtx);

  for (let i = 0; i < traffic.length; i++) {
    const trafficCar = traffic[i];
    trafficCar.update(road.borders, []);
    trafficCar.draw(carCtx, "red");
  }

  car.update(road.borders, traffic);
  car.draw(carCtx, "blue");

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, car.brain);

  requestAnimationFrame(animate);
}
