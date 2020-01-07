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

  run() {
    if (!this.pauseElement.checked) {
      this.updateObstacles();
      this.updatePopulation();
      this.render();

      if (!this.population.atLeastOneAlive()) {
        this.resetObstacles();
        this.population.repopulate();
      }
    }

    setTimeout(
      () => { this.run(); },
      parseInt(this.timeScalerElement.value)
    );
  };

  render() {
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
        this.population.alive.slice(1).forEach(hero => hero.render(false));
      } else {
        this.population.alive.forEach(hero => hero.render());
      }

      this.population.dead.forEach(hero => hero.render(false));

      this.obstacles.forEach(obstacle => obstacle.render());
    } else {
      this.gameElement.style.display = 'none';
    }
  };

  updatePopulation() {
    const firstObstacleIndex = this.obstacles[0].position.x > 20 ? 0 : 1; // 20px is hero width
    const conditions = [
      this.obstacles[firstObstacleIndex].position.x / SCREEN_WIDTH,
      this.obstacles[firstObstacleIndex].position.y / SCREEN_HEIGHT,
      this.obstacles[firstObstacleIndex + 1].position.x / SCREEN_WIDTH,
      this.obstacles[firstObstacleIndex + 1].position.y / SCREEN_HEIGHT,
      1 // bias
    ];

    this.population.alive.forEach((hero, index) => {
      if (actorColided(hero, this.obstacles)) {
        this.population.killAt(index);
        return;
      }

      hero.update(conditions);
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
};

export { World };
