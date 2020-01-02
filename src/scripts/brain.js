const BRAIN_INPUT_SIZE = 6;
const BRAIN_HIDDEN_SIZE = 16;
const BRAIN_OUTPUT_SIZE = 3;

class Brain {
  constructor(model = null) {
    this.model = model instanceof tf.Sequential ? model : this.createModel();
  }

  copy() {
    return tf.tidy(() => {
      const modelCopy = this.createModel();
      const weights = this.model.getWeights();
      const weightCopies = [];

      for (let i = 0; i < weights.length; i++) {
        weightCopies[i] = weights[i].clone();
      }
      modelCopy.setWeights(weightCopies);

      return new Brain(modelCopy);
    });
  }

  mutate(rate) {
    tf.tidy(() => {
      const weights = this.model.getWeights();
      const mutatedWeights = [];

      for (let i = 0; i < weights.length; i++) {
        let tensor = weights[i];
        let shape = weights[i].shape;
        let values = tensor.dataSync().slice();

        for (let j = 0; j < values.length; j++) {
          if (Math.random() < rate) {
            let w = values[j];
            values[j] = w + Math.random() * 0.01 - 0.005;
          }
        }

        mutatedWeights[i] = tf.tensor(values, shape);
      }
      this.model.setWeights(mutatedWeights);
    });
  }

  dispose() {
    this.model.dispose();
  }

  predictAction(inputs) {
    return tf.tidy(() => {
      const xs = tf.tensor2d([inputs]);
      const ys = this.model.predict(xs);
      const outputs = ys.dataSync();

      return outputs;
    });
  }

  createModel() {
    const model = tf.sequential();

    const hidden = tf.layers.dense({
      units: BRAIN_HIDDEN_SIZE,
      inputShape: [BRAIN_INPUT_SIZE],
      activation: 'sigmoid'
    });
    model.add(hidden);

    const output = tf.layers.dense({
      units: BRAIN_OUTPUT_SIZE,
      activation: 'softmax'
    });
    model.add(output);

    return model;
  }
}

export { Brain };
