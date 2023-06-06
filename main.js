/**
 * @note About the canvas coordinates:
 * - 0, 0 point starts at the top left corner of the canvas;
 * - The X dimension increases to the right and decreases to the left (as normal in a cartesian plane)
 * - The Y dimension INCREASES to the bottom and DECREASES to the top (inverse of a cartesian plane)
 */

const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");
const car = new Car({
  x: 100,
  y: 100,
  width: 30,
  height: 50,
});

animate();

function animate() {
  canvas.height = window.innerHeight;

  car.update();
  car.draw(ctx);
  requestAnimationFrame(animate);
}
