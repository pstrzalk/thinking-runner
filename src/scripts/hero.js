import { Brain } from './brain';

class Hero {
  constructor(brain = null) {
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.bigJumpAcceleration = 50;
    this.smallJumpAcceleration = 30;

    this.score = 0;

    this.width = 20;
    this.height = 40;

    if (brain) {
      this.brain = brain;
    } else {
      this.brain = new Brain();
    }

    this.gameElement = document.getElementById('game');
  };

  getElement() {
    if (this.element) {
      return this.element;
    }

    this.element = document.createElement('div');
    this.element.classList.add('hero');
    this.gameElement.append(this.element);
    this.element.style.background = 
      `rgb(${Math.random() * 200 + 50}, ${Math.random() * 200 + 50}, ${Math.random() * 200 + 50})`;

    return this.element;
  };

  id() {
    return this.brain.id;
  };

  defaultAction() {
    return 'justDoNothing';
  }

  duplicate() {
    return new Hero(this.brain.copy());
  }

  duplicateAsMutated(sigma) {
    const newBrain = this.brain.copy();
    newBrain.mutate(sigma);

    return new Hero(newBrain);
  }

  chooseAction(conditions) {
    const actionProbabilities = this.brain.predictAction(conditions);
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
      action = this.defaultAction();
    }

    return action;
  }

  bigJump() {
    this.velocity.y += this.bigJumpAcceleration;
  }

  smallJump() {
    this.velocity.y += this.smallJumpAcceleration;
  }

  render(show = true) {
    const element = this.getElement();

    if (show) {
      element.style.display = `block`;
    } else {
      element.style.display = `none`;
    }
    element.style.left = `${this.position.x}px`;
    element.style.bottom = `${this.position.y}px`;
  }

  dispose() {
    if (this.brain) {
      this.brain.dispose();
    }

    if (this.element) {
      this.gameElement.removeChild(this.element);
      this.element = null;
    }
  }

  update(conditions) {
    if (this.position.y <= 0.001) {
      const action = this.chooseAction(conditions);

      switch (action) {
        case 'bigJump':
          this.bigJump();
          break;
        case 'smallJump':
          this.smallJump();
          break;
        default:
          this.velocity.y = 0;
      }
    } else {
      this.velocity.y += -9;
    }

    // Smooth the jump a bit
    if (this.velocity.y > 0 && this.position.y > this.height * 1.8) {
      this.velocity.y /= 1.4;
    }
    if (this.velocity.y < 0) {
      this.velocity.y *= 1.1;
    }

    // Move the bastard
    this.position.y += this.velocity.y;
    this.position.y = Math.max(this.position.y, 0); // Hit the ground if needed

    this.score += 1;
  }
};

export { Hero };
