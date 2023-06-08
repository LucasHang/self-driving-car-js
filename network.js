class NeuralNetwork {
  /**
   * @param {number[]} neuronCounts
   */
  constructor(neuronCounts) {
    this.levels = [];

    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(
        new Level({
          inputCount: neuronCounts[i],
          outputCount: neuronCounts[i + 1],
        })
      );
    }
  }

  /**
   * @param {number[]} givenInputs Should have the same length of `inputCount`
   * @param {NeuralNetwork} network
   */
  static feedForward(givenInputs, network) {
    const firstLevel = network.levels[0];

    let outputs = Level.feedForward(givenInputs, firstLevel);

    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }

    return outputs;
  }
}

class Level {
  /**
   * For the car situation we will use the sensors as inputs so they generate outputs for the controls.
   * Very similar as a brain, tha receives information through the eyes (sensors), for example,
   * and triggers a movement on the hands (controls).
   * Notice that the outputs for the car controls will be just the output of the last level,
   * given that can exists a lot of levels in a network.
   * @param {{
   *    inputCount: number;
   *    outputCount: number;
   * }} params
   */
  constructor({ inputCount, outputCount }) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount);

    this.weights = [];
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }

    Level.#randomize(this);
  }

  /**
   * @param {Level} level
   */
  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = generateRandomWeight();
      }
    }

    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = generateRandomWeight();
    }
  }

  /**
   * Turns the inputs we are getting from the sensors into outputs in binary,
   * indicating whether the respective control should be activated or not.
   * @param {number[]} givenInputs Should have the same length of `inputCount`
   * @param {Level} level
   */
  static feedForward(givenInputs, level) {
    for (let i = 0; i < givenInputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }

    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;

      for (let j = 0; j < level.inputs.length; j++) {
        const currentInput = level.inputs[j];
        const respectiveWeight = level.weights[j][i];

        sum += currentInput * respectiveWeight;
      }

      const respectiveBias = level.biases[i];

      if (sum > respectiveBias) {
        level.outputs[i] = 1;
      } else {
        level.outputs[i] = 0;
      }
    }

    return level.outputs;
  }
}

/**
 * @returns A value between -1 and 1 `[-1, 1]`
 */
function generateRandomWeight() {
  return Math.random() * 2 - 1;
}
