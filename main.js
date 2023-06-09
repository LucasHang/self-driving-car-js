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

const N = 1000;
const cars = generateCars(N);

let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));

    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.12);
    }
  }
}

const traffic = [
  new Car({
    x: road.getLaneCenter(1),
    y: -100,
    width: 30,
    height: 50,
    controlType: "dummy",
    maxSpeed: 2,
  }),
  new Car({
    x: road.getLaneCenter(0),
    y: -300,
    width: 30,
    height: 50,
    controlType: "dummy",
    maxSpeed: 2,
  }),
  new Car({
    x: road.getLaneCenter(2),
    y: -300,
    width: 30,
    height: 50,
    controlType: "dummy",
    maxSpeed: 2,
  }),
  new Car({
    x: road.getLaneCenter(0),
    y: -500,
    width: 30,
    height: 50,
    controlType: "dummy",
    maxSpeed: 2,
  }),
  new Car({
    x: road.getLaneCenter(1),
    y: -500,
    width: 30,
    height: 50,
    controlType: "dummy",
    maxSpeed: 2,
  }),
  new Car({
    x: road.getLaneCenter(1),
    y: -750,
    width: 30,
    height: 50,
    controlType: "dummy",
    maxSpeed: 2,
  }),
  new Car({
    x: road.getLaneCenter(2),
    y: -700,
    width: 30,
    height: 50,
    controlType: "dummy",
    maxSpeed: 2,
  }),
  new Car({
    x: road.getLaneCenter(1),
    y: -900,
    width: 30,
    height: 50,
    controlType: "dummy",
    maxSpeed: 2,
  }),
  new Car({
    x: road.getLaneCenter(0),
    y: -1100,
    width: 30,
    height: 50,
    controlType: "dummy",
    maxSpeed: 2,
  }),
  new Car({
    x: road.getLaneCenter(2),
    y: -1100,
    width: 30,
    height: 50,
    controlType: "dummy",
    maxSpeed: 2,
  }),
];

function generateCars(N) {
  const cars = [];

  for (let i = 0; i < N; i++) {
    cars.push(
      new Car({
        x: road.getLaneCenter(1),
        y: 100,
        width: 30,
        height: 50,
        controlType: "ai",
      })
    );
  }

  return cars;
}

/**
 * @param {number | undefined} time Passed by `requestAnimationFrame`
 */
function animate(time) {
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();

  // The car with the minimun `y` of all
  bestCar = cars.find((c) => c.y === Math.min(...cars.map((c) => c.y)));

  const cartStartingPosition = -bestCar.y + carCanvas.height * 0.7;
  // This is what makes the road move under the car instead of the car over the road
  carCtx.translate(0, cartStartingPosition);

  road.draw(carCtx);

  for (let i = 0; i < traffic.length; i++) {
    const trafficCar = traffic[i];
    trafficCar.update(road.borders, []);
    trafficCar.draw(carCtx, "red");
  }

  carCtx.globalAlpha = 0.2;
  cars.forEach((car) => {
    car.update(road.borders, traffic);
    car.draw(carCtx, "blue");
  });
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  requestAnimationFrame(animate);
}

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

animate();
