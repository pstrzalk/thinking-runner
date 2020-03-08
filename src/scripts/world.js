import { Population } from './population';
import { Obstacle } from './obstacle';
import { actorColided, actorGrounded } from './services/colisionDetectorService';

const GRAVITY = -9;
const SCREEN_WIDTH = 600;
const SCREEN_HEIGHT = 500;
const MAX_VELOCITY = 500;

class World {
  constructor() {
    this.obstacles = [];
  };

  init() {
    this.population = new Population();

    this.gameElement = document.querySelector('#game');
    this.infoElement = document.querySelector('.js-info');
    this.renderOneToggleElement = document.querySelector('.js-render-one');
    this.renderToggleElement = document.querySelector('.js-render-toggle');
    this.timeScalerElement = document.querySelector('.js-time-scaler');

    this.pauseElement = document.querySelector('.js-pause');

    this.resetObstacles();
  };

  resetObstacles() {
    this.obstacles.forEach(o => o.dispose());
    this.obstacles = [];
  };

  getHTML() {
    return `
      <div id="train" class="train">
        <div id="game" class="game">
        </div>

        <br>
        <span class='js-info'></span>

        <br><br>

        Frame <select class='js-time-scaler'>
          <option value="50">every 50 milisecond</option>
          <option selected value="25">every 25 milisecond</option>
          <option value="10">every 10 milisecond</option>
          <option value="">as soon as possible</option>
        </select>

        <br><br>

        Render <input type="checkbox" checked class='js-render-toggle'>
        <br>
        Show One <input type="checkbox" class='js-render-one'>
        <br>
        Pause <input type="checkbox" class='js-pause'>
      </div>
    `;
  }

  render() {
    if (!this.pauseElement.checked) {
      this.updateObstacles();
      this.updatePopulation();
      this.renderInfo();

      if (!this.population.atLeastOneAlive()) {
        this.resetObstacles();
        this.population.repopulate();
      }
    }

    setTimeout(
      () => { this.render(); },
      parseInt(this.timeScalerElement.value)
    );
  };

  renderInfo() {
    if (this.population.atLeastOneAlive()) {
      this.infoElement.innerHTML =
        `<b>Current population:</b><br>` +
        `Generation: ${this.population.generation}<br>` +
        `Size: ${this.population.alive.length}<br>` +
        `Age: ${this.population.age}<br><br>` +
        `<b>Best score:</b> ${(this.population.hallOfFame[0] || { score: '-' }).score}`;
    }

    if (this.renderToggleElement.checked) {
      this.gameElement.style.display = 'block';

      if (this.renderOneToggleElement.checked) {
        if (this.population.atLeastOneAlive()) {
          this.population.alive[0].render();
        }
        this.population.alive.slice(1).forEach(runner => runner.render(false));
      } else {
        this.population.alive.forEach(runner => runner.render());
      }

      this.population.dead.forEach(runner => runner.render(false));

      this.obstacles.forEach(obstacle => obstacle.render());
    } else {
      this.gameElement.style.display = 'none';
    }
  };

  updatePopulation() {
    const firstObstacleIndex = this.obstacles[0].position.x > 20 ? 0 : 1; // 20px is runner width

    if (firstObstacleIndex == 1) {
      this.obstacles[0].element.style.backgroundColor = 'green';
    }
    this.obstacles[firstObstacleIndex].element.style.backgroundColor = 'red';

    const conditions = [
      this.obstacles[firstObstacleIndex].position.x / SCREEN_WIDTH,
      this.obstacles[firstObstacleIndex].position.y / SCREEN_HEIGHT,
      this.obstacles[firstObstacleIndex].width / 100,
      // this.obstacles[firstObstacleIndex + 1].position.x / SCREEN_WIDTH,
      // this.obstacles[firstObstacleIndex + 1].position.y / SCREEN_HEIGHT,
      1 // bias
    ];

    this.population.alive.forEach((runner, index) => {
      if (actorColided(runner, this.obstacles)) {
        this.population.killAt(index);
        return;
      }

      runner.update(conditions);
    });

    this.population.mature();
  }

  updateObstacles() {
    let newObstacles = [];

    this.obstacles = this.obstacles.map((obstacle) => {
      obstacle.update();

      if (obstacle.position.x + obstacle.width < 0) {
        obstacle.dispose();
        return;
      }

      return obstacle;
    }).filter(Boolean);

    for (let i = this.obstacles.length; i < 3; i++) {
      const lastObstacle = this.obstacles[this.obstacles.length - 1];
      const newObstacleXBase = lastObstacle ? lastObstacle.position.x : SCREEN_WIDTH;

      this.createObstacle(newObstacleXBase + SCREEN_WIDTH / 2 + Math.random() * 250);
    }
  };

  createObstacle(x) {
    const random = Math.random();
    let y = 0;

    if (random > 0.75) {
      y = 80;
    } else if (random > 0.5) {
      y = 35;
    }

    this.obstacles.push(new Obstacle(x, y));
  };

  bestBrain() {
    if (!this.population || !this.population.hallOfFame.length) {
      return null;
    }

    return this.population.hallOfFame[0].brain.duplicate();
  }
};

export { World };
