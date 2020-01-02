import { Hero } from './hero';
import { Obstacle } from './obstacle';
import { actorColided, actorGrounded } from './services/colisionDetectorService';

const GRAVITY = -9;
const POPULATION_SIZE = 250;
const SCREEN_WIDTH = 1000;
const SCREEN_HEIGHT = 500;
const MAX_VELOCITY = 500;

class World {
  constructor() {
    this.updateCounter = 0;

    this.deadPopulation = [];
    this.obstacles = [];
    this.population = [];

    this.resetObstacles();
    this.populate();

    this.timeScaler = document.querySelector('.js-time-scaler');
    this.infoElement = document.querySelector('.js-info');
    this.renderToggleElement = document.querySelector('.js-render-toggle');
  };

  resetObstacles() {
    this.obstacles.forEach(o => o.removeElement());
    this.obstacles = [];

    this.createObstacle(SCREEN_WIDTH / 3);
    this.createObstacle(2 * SCREEN_WIDTH / 3);
  };

  createObstacle(x = SCREEN_WIDTH) {
    const y = Math.random() < 0.5 ? 0 : 80;

    this.obstacles.push(
      new Obstacle(x, y),
    );
  };

  populate() {
    for (let i = 0; i < POPULATION_SIZE ; i++) {
      this.population.push(new Hero());
    }
  };

  repopulate() {
    console.log('repopulate');

    let maxScore = Infinity;
    let minScore = 0;

    this.deadPopulation.sort((hero1, hero2) => hero2.level - hero1.level);

    console.log(this.deadPopulation.map(h => h.level));

    for (let i = 0; i < POPULATION_SIZE / 10; i++) {
      const hero = this.deadPopulation[i];
      let brain;

      brain = hero.brain.copy();
      this.population.push(new Hero(brain));

      for (let j = 0; j < 5; j++) {
        brain = hero.brain.copy();
        brain.mutate(0.1);
        this.population.push(new Hero(brain));
      }

      for (let j = 0; j < 4; j++) {
        this.population.push(new Hero());
      }
    }

    console.log('repopulated');

    this.deadPopulation.forEach(h => h.brain.dispose());
    this.deadPopulation = [];

    console.log('disposed');
  };

  run() {
    this.update();

    if (this.renderToggleElement.checked) {
      this.render();
    }
    this.updateCounter += 1;

    if (this.population.length === 0) {
      this.resetObstacles();
      this.repopulate();
    }

    setTimeout(this.run.bind(this), parseInt(this.timeScaler.value));
  };

  update() {
    this.updateHeroPositions();
    this.updateObstaclePositions();
  }

  render() {
    if (this.population.length > 0) {
      this.infoElement.innerHTML = `Population size: ${this.population.length}, Score: ${this.population[0].level}`;
    }

    this.population.forEach(hero => {
      hero.render();
    });
    this.obstacles.forEach(obstacle => obstacle.render());
  };

  heroConditions(hero) {
    conditions = [];

    for (let i = 0; i < 3; i++) {
      conditions.push(this.obstacles[i].position.x / SCREEN_WIDTH);
      conditions.push(this.obstacles[i].position.y / SCREEN_HEIGHT);
    }

    console.log(conditions);
    return conditions;
  };

  updateHeroPositions() {
    let nearestObstacle;

    for (let i = 0; i < this.obstacles.length; i++) {
      if (
        this.obstacles[i].position.x > 0 &&
        (!nearestObstacle || nearestObstacle.position.x > this.obstacles[i].position.x)
      ) {
        nearestObstacle = this.obstacles[i];
      }
    }

    const conditions = [];

    if (this.obstacles.length > 1) {
      conditions.push(this.obstacles[0].position.x / SCREEN_WIDTH);
      conditions.push(this.obstacles[0].position.y / SCREEN_HEIGHT);
      conditions.push(this.obstacles[0].velocity.x / MAX_VELOCITY);
      conditions.push(this.obstacles[1].position.x / SCREEN_WIDTH);
      conditions.push(this.obstacles[1].position.y / SCREEN_HEIGHT);
      conditions.push(this.obstacles[1].velocity.x / MAX_VELOCITY);
    }

    this.population.forEach((hero, index) => {
      const colided = actorColided(hero, this.obstacles);
      if (colided) {
        hero.removeElement();
        const deadHero = this.population.splice(index, 1);
        this.deadPopulation.push(deadHero[0]);

        return;
      }

      hero.levelUp();

      const grounded = actorGrounded(hero);

      ///////////////////////////
      // Handle velocity change
      let heroAction = hero.defaultAction();
      if (grounded) {
        heroAction = hero.chooseAction(conditions);

        switch (heroAction) {
          case 'bigJump':
            hero.bigJump();
            break;
          case 'smallJump':
            hero.smallJump();
            break;
          default:
            hero.velocity.y = 0;
        }
      } else {
        hero.velocity.y += GRAVITY;
      }

      // Smooth the jump a bit
      if (hero.position.y > hero.height * 1.8 && hero.velocity.y > 0) {
        hero.velocity.y /= 1.4;
      }

      if (hero.velocity.y < 0) {
        hero.velocity.y *= 1.1;
      }

      ///////////////////////////
      // Move the bastard

      hero.position.y += hero.velocity.y;
      hero.position.y = Math.max(hero.position.y, 0); // Hit the ground if needed
    });
  }

  updateObstaclePositions() {
    let newObstacles = [];

    this.obstacles.forEach((obstacle) => {
      obstacle.position.x += obstacle.velocity.x;

      if (obstacle.position.x < 0) {
        obstacle.removeElement();
        return;
      }

      newObstacles.push(obstacle);
    });
    this.obstacles = newObstacles;

    if (this.obstacles.length < 3) {
      this.createObstacle(SCREEN_WIDTH);

      if (Math.random() < 0.333) {
        this.createObstacle(SCREEN_WIDTH + 100 + Math.floor(Math.random() * 100));
      }
    }
  }
};

export { World };
