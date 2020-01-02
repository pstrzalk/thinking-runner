import { Brain } from './brain';

class Hero {
  constructor(brain = null) {
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.bigJumpAcceleration = 50;
    this.smallJumpAcceleration = 30;

    this.level = 0;

    this.width = 10;
    this.height = 40;

    if (brain) {
      this.brain = brain;
    } else {
      this.brain = new Brain();
    }

    this.gameElement = document.getElementById('game');
    this.createElement();
  };

  // mutateAndRevive() {
  //   this.level = 0;
  //   this.brain.mutate(0.1);
  //
  //   this.createElement();
  // };

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('hero');

    this.gameElement.append(this.element);
  };

  removeElement() {
    this.gameElement.removeChild(this.element);
    this.element = null;
  }

  defaultAction() {
    return 'justDoNothing';
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

  render() {
    this.element.style.left = `${this.position.x}px`;
    this.element.style.bottom = `${this.position.y}px`;
  }

  levelUp() {
    this.level += 1;
  }
};

export { Hero };
