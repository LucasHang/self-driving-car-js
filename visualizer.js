class Visualizer {
  /**
   *
   * @param {any} ctx A canvas 2d context
   * @param {any} network A network instance
   */
  static drawNetwork(ctx, network) {
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = ctx.canvas.width - margin * 2;
    const height = ctx.canvas.height - margin * 2;

    const levelHeight = height / network.levels.length;

    const lastIndex = network.levels.length - 1;

    // We draw the level from top to bottom, so the draws do not override each one biases
    for (let i = lastIndex; i >= 0; i--) {
      const maxHeight = height - levelHeight;
      const minHeight = 0;

      const levelTop =
        top + lerp(maxHeight, minHeight, lastIndex === 0 ? 0.5 : i / lastIndex);

      const isControlsOutput = i === lastIndex;
      const controlsLabels = ["🠉", "🠈", "🠊", "🠋"];

      ctx.setLineDash([7, 3]);

      Visualizer.drawLevel(
        ctx,
        network.levels[i],
        {
          left,
          top: levelTop,
          width,
          height: levelHeight,
        },
        isControlsOutput ? controlsLabels : []
      );
    }
  }

  /**
   * @param {any} ctx A canvas 2d context
   * @param {any[]} level A network level instance
   * @param {{ left: number; top: number; width: number; height: number; }} boundings
   * @param {string[]} labels
   */
  static drawLevel(ctx, level, { left, top, width, height }, labels) {
    const right = left + width;
    const bottom = top + height;

    const { inputs, outputs, weights, biases } = level;

    const nodeRadius = 18;

    // Draw connections between nodes
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        ctx.beginPath();
        ctx.moveTo(Visualizer.#getNodeX(inputs, i, left, right), bottom);
        ctx.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top);
        ctx.lineWidth = 2;

        const value = weights[i][j];

        ctx.strokeStyle = getRGBA(value);

        ctx.stroke();
      }
    }

    // Draw the input nodes
    for (let i = 0; i < inputs.length; i++) {
      const x = Visualizer.#getNodeX(inputs, i, left, right);

      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(inputs[i]);
      ctx.fill();
    }

    // Draw the output nodes
    for (let i = 0; i < outputs.length; i++) {
      const x = Visualizer.#getNodeX(outputs, i, left, right);

      ctx.beginPath();
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(outputs[i]);
      ctx.fill();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = getRGBA(biases[i]);
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (labels[i]) {
        ctx.beginPath();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.font = `${nodeRadius * 1.5}px Arial`;
        ctx.fillText(labels[i], x, top + nodeRadius * 0.1);
        ctx.lineWidth = 0.5;
        ctx.strokeText(labels[i], x, top + nodeRadius * 0.1);
      }
    }
  }

  /**
   * @param {any[]} nodes
   * @param {number} index
   * @param {number} left
   * @param {number} right
   */
  static #getNodeX(nodes, index, left, right) {
    const lastIndex = nodes.length - 1;
    const t = lastIndex === 0 ? 0.5 : index / lastIndex;

    return lerp(left, right, t);
  }
}
