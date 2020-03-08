import { Runner } from './runner';

const POPULATION_HALL_OF_FAME_SIZE = 10;
const POPULATION_SIZE = 100;
const POPULATION_REPRODUCTION_SIZE = 10;
const RUNNER_MUTATE_LITTLE = 2;
const RUNNER_MUTATE_SOME = 2;

class Population {
  constructor() {
    this.alive = [];
    this.dead = [];
    this.hallOfFame = [];

    this.age = 0;
    this.generation = 1;

    for (let i = 0; i < POPULATION_SIZE ; i++) {
      this.alive.push(new Runner());
    }
  }

  mature() {
    this.age += 1;
  }

  killAt(index) {
    const runner = this.alive[index];

    this.alive.splice(index, 1);
    this.dead.push(runner);

    return;
  };

  atLeastOneAlive() {
    return this.alive.length > 0;
  };

  repopulate() {
    this.age = 0;
    this.generation += 1;

    this.dead.sort((runner1, runner2) => runner2.score - runner1.score);
    console.log('Last population', this.dead.slice(0, 20).map(r => r.score));

    this.hallOfFame = this.hallOfFame.concat(
      this.dead.slice(0, 2).map(runner => {
        const duplicatedRunner = runner.duplicate();
        duplicatedRunner.score = runner.score;

        return duplicatedRunner;
      })
    );
    this.hallOfFame.sort((runner1, runner2) => runner2.score - runner1.score);
    this.hallOfFame.slice(POPULATION_HALL_OF_FAME_SIZE).forEach(r => r.dispose());
    this.hallOfFame = this.hallOfFame.slice(0, POPULATION_HALL_OF_FAME_SIZE);

    const hallOfFameIds = new Set();
    this.hallOfFame.forEach(runner => hallOfFameIds.add(runner.id()));

    console.log('Hall of Fame', this.hallOfFame.map(r => r.score));

    // Copy the Hall Of Fame
    this.alive = this.hallOfFame.map(runner => runner.duplicate());
    this.alive = this.alive.concat(
      this.hallOfFame.map(runner => runner.duplicateAsMutated(1e-14))
    );

    for (let i = 0; i < POPULATION_REPRODUCTION_SIZE; i++) {
      const runner = this.dead[i];

      if (!hallOfFameIds.has(runner.id())) {
        this.alive.push(runner.duplicate());
      }

      for (let j = 0; j < RUNNER_MUTATE_LITTLE; j++) {
        this.alive.push(runner.duplicateAsMutated(1e-15));
      }

      for (let j = 0; j < RUNNER_MUTATE_SOME; j++) {
        this.alive.push(runner.duplicateAsMutated(1e-12));
      }
    }

    for (let i = this.alive.length; i < POPULATION_SIZE; i++) {
      this.alive.push(new Runner());
    }

    this.dead.forEach(h => h.dispose());
    this.dead = [];
  };
}

export { Population };
