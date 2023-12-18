import { lines } from '../../common.mjs';

const LEFT = 0;
const UP = 1;
const RIGHT = 2;
const DOWN = 3;

const traffic = lines('./input.txt').map(row => [...row].map(n => parseInt(n)));
const minHeatByPath = [...Array(traffic.length)].map(_ => [...Array(traffic[0].length)].map(__ => 0));
const theEnd = `${traffic.length - 1},${traffic[0].length - 1}`;

class Car {
  pos = [0, 0];
  dir = RIGHT;
  dirCount = 0;
  path = new Set();
  heatLoss = 0;
  tooHot = false;

  constructor(pos = [0, 0], dir = RIGHT, dirCount = 0, path = new Set(['0,0']), heatLoss = traffic[0][0]) {
    this.pos = pos;
    this.dir = dir;
    this.dirCount = dirCount;
    this.path = path;
    this.heatLoss = heatLoss;
  }

  get key() {
    return this.pos.join(',');
  }

  move() {
    this.pos[1] += !(this.dir % 2) ? this.dir - 1 : 0;
    this.pos[0] += this.dir % 2 ? this.dir - 2 : 0;
    this.dirCount++;

    this.heatLoss +=
      traffic[this.pos[0]]?.length && traffic[this.pos[0]][this.pos[1]] ? traffic[this.pos[0]][this.pos[1]] : 0;

    if (this.key === theEnd) {
      minHeatLoss = Math.min(minHeatLoss, this.heatLoss);
    }

    return this;
  }

  recordStep() {
    this.path.add(this.key);
  }

  #turn(dir) {
    this.dirCount = 0;
    this.dir = this.dir + dir > 3 ? 0 : this.dir + dir < 0 ? 3 : this.dir + dir;
    return this;
  }

  turnLeft() {
    return this.#turn(-1);
  }

  turnRight() {
    return this.#turn(1);
  }

  clone() {
    return new Car([...this.pos], this.dir, this.dirCount, new Set([...this.path]), this.heatLoss);
  }

  get dead() {
    return (
      this.pos[0] < 0 ||
      this.pos[1] < 0 ||
      this.pos[0] >= traffic.length ||
      this.pos[1] >= traffic[0].length ||
      this.dirCount > 3 ||
      this.path.has(this.key) ||
      this.atDest ||
      this.heatLoss >= minHeatLoss ||
      this.tooHot
    );
  }

  get atDest() {
    return this.key === theEnd;
  }

  toString() {
    return `${this.pos.join(',')} ${this.dir}-${this.dirCount} ${this.dead ? 'dead' : ''}`;
  }
}

let cars = [new Car()];

// set intitial min heat loss to straight diagonal
let minHeatLoss = traffic.reduce(
  (heatLoss, row, i) => heatLoss + row.slice(i, i + 2).reduce((sum, n) => sum + (n ?? 0), 0),
  0
);

const nextGen = () => {
  cars
    .filter(car => !car.dead)
    .forEach(car => {
      cars.push(car.clone().turnLeft().move());
      cars.push(car.clone().turnRight().move());
      car.move();
    });

  const carMap = {};

  // Filter out dead cars and paths that are too hot
  Object.values(
    // if two cars move to the same position, take the one with the lowest heat loss
    livingCars.reduce((dedupe, car) => {
      if (dedupe[car.key]) {
        dedupe[car.key] = car.heatLoss < dedupe[car.key].heatLoss ? car : dedupe[car.key];
      } else {
        dedupe[car.key] = car;
      }
      return dedupe;
    }, {})
  );

  // Record alive cars newest position to their relative paths
  cars.forEach(car => car.recordStep());

  return cars;
};

while (cars.length) {
  nextGen();
}

console.log(minHeatLoss);

debugger;
