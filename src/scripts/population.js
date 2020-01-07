import { Hero } from './hero';

const POPULATION_HALL_OF_FAME_SIZE = 10;
const POPULATION_SIZE = 100;
const POPULATION_REPRODUCTION_SIZE = 10;
const HERO_MUTATE_LITTLE = 2;
const HERO_MUTATE_SOME = 2;

class Population {
  constructor() {
    this.alive = [];
    this.dead = [];
    this.hallOfFame = [];

    this.age = 0;
    this.generation = 1;

    for (let i = 0; i < POPULATION_SIZE ; i++) {
      this.alive.push(new Hero());
    }
  }

  mature() {
    this.age += 1;
  }

  killAt(index) {
    const hero = this.alive[index];

    this.alive.splice(index, 1);
    this.dead.push(hero);

    return;
  };

  atLeastOneAlive() {
    return this.alive.length > 0;
  };

  repopulate() {
    this.age = 0;
    this.generation += 1;

    this.dead.sort((hero1, hero2) => hero2.score - hero1.score);
    console.log('Last population', this.dead.slice(0, 20).map(h => h.score));

    this.hallOfFame = this.hallOfFame.concat(
      this.dead.slice(0, 2).map(hero => {
        const duplicatedHero = hero.duplicate();
        duplicatedHero.score = hero.score;

        return duplicatedHero;
      })
    );
    this.hallOfFame.sort((hero1, hero2) => hero2.score - hero1.score);
    this.hallOfFame.slice(POPULATION_HALL_OF_FAME_SIZE).forEach(h => h.dispose());
    this.hallOfFame = this.hallOfFame.slice(0, POPULATION_HALL_OF_FAME_SIZE);

    const hallOfFameIds = new Set();
    this.hallOfFame.forEach(hero => hallOfFameIds.add(hero.id()));

    console.log('Hall of Fame', this.hallOfFame.map(h => h.score));

    // Copy the Hall Of Fame
    this.alive = this.hallOfFame.map(hero => hero.duplicate());
    this.alive = this.alive.concat(
      this.hallOfFame.map(hero => hero.duplicateAsMutated(1e-14))
    );

    for (let i = 0; i < POPULATION_REPRODUCTION_SIZE; i++) {
      const hero = this.dead[i];

      if (!hallOfFameIds.has(hero.id())) {
        this.alive.push(hero.duplicate());
      }

      for (let j = 0; j < HERO_MUTATE_LITTLE; j++) {
        this.alive.push(hero.duplicateAsMutated(1e-15));
      }

      for (let j = 0; j < HERO_MUTATE_SOME; j++) {
        this.alive.push(hero.duplicateAsMutated(1e-12));
      }
    }

    for (let i = this.alive.length; i < POPULATION_SIZE; i++) {
      this.alive.push(new Hero());
    }

    this.dead.forEach(h => h.dispose());
    this.dead = [];
  };
}

export { Population };
