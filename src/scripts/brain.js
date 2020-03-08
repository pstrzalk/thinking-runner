const BRAIN_INPUT_SIZE = 4;
const BRAIN_OUTPUT_SIZE = 3;

class Brain {
  constructor(model = null, id = null) {
    this.model = model instanceof tf.Sequential ? model : this.createModel();
    this.id = id || this.randomId();
  };

  randomId() {
    return Date.now() + Math.random();
  };

  copy() {
    return tf.tidy(() => {
      const modelCopy = this.createModel();
      const weights = this.model.getWeights();
      const weightCopies = [];

      for (let i = 0; i < weights.length; i++) {
        weightCopies[i] = weights[i].clone();
      }
      modelCopy.setWeights(weightCopies);

      return new Brain(modelCopy, this.id);
    });
  };

  mutate(sigma, rate = 0.1) {
    tf.tidy(() => {
      const weights = this.model.getWeights();
      const mutatedWeights = [];

      for (let i = 0; i < weights.length; i++) {
        let tensor = weights[i];
        let shape = weights[i].shape;
        let values = tensor.dataSync().slice();

        for (let j = 0; j < values.length; j++) {
          if (Math.random() < rate) {
            values[j] = this.gaussianRandom(values[j], sigma);
          }
        }

        mutatedWeights[i] = tf.tensor(values, shape);
      }
      this.model.setWeights(mutatedWeights);

      this.id = this.randomId();
    });
  };

  gaussianRandom(mean, sigma) {
    let u = Math.random()*0.682;
    return ((u % 1e-8 > 5e-9 ? 1 : -1) * (Math.sqrt(-Math.log(Math.max(1e-9, u)))-0.618))*1.618 * sigma + mean;
  };

  dispose() {
    this.model.dispose();
  };

  predictAction(inputs) {
    return tf.tidy(() => {
      const xs = tf.tensor2d([inputs]);
      const ys = this.model.predict(xs);
      const outputs = ys.dataSync();

      return outputs;
    });
  };

  createModel() {
    const model = tf.sequential();

    const hidden1 = tf.layers.dense(
      { units: BRAIN_INPUT_SIZE * 2, inputShape: [BRAIN_INPUT_SIZE], activation: 'relu' }
    );
    model.add(hidden1);

    const hidden2 = tf.layers.dense({ units: BRAIN_INPUT_SIZE * 2, activation: 'relu' });
    model.add(hidden2);

    // const dropout = tf.layers.dropout({ rate: 0.33333 });
    // model.add(dropout);

    // const hidden3 = tf.layers.dense({ units: BRAIN_INPUT_SIZE * 2, activation: 'relu' });
    // model.add(hidden3);

    const output = tf.layers.dense({ units: BRAIN_OUTPUT_SIZE, activation: 'softmax' });
    model.add(output);

    return model;
  };

  chooseAction(conditions) {
    const actionProbabilities = this.predictAction(conditions);
    let action = '';

    let maxProbability = 0;
    for (let i = 0; i < actionProbabilities.length; i++) {
      if (actionProbabilities[i] > maxProbability) {
        maxProbability = actionProbabilities[i];
      }
    }

    if (actionProbabilities[0] === maxProbability) {
      action = 'bigJump';
    } else if (actionProbabilities[1] === maxProbability) {
      action = 'smallJump';
    } else {
      action = 'justDoNothing';
    }

    return action;
  }
}

export { Brain };
