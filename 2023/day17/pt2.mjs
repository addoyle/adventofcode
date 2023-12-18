import { lines } from '../../common.mjs';

const LEFT = 0;
const UP = 1;
const RIGHT = 2;
const DOWN = 3;

class Beam {
  x = 0;
  y = 0;
  dir = RIGHT;

  constructor(...args) {
    const [x, y, dir] = args;
    this.x = x ?? 0;
    this.y = y ?? 0;
    this.dir = dir ?? RIGHT;
  }

  move() {
    this.x += !(this.dir % 2) ? this.dir - 1 : 0;
    this.y += this.dir % 2 ? this.dir - 2 : 0;
  }

  #turn(dir) {
    this.dir = this.dir + dir > 3 ? 0 : this.dir + dir < 0 ? 3 : this.dir + dir;
  }

  turnLeft() {
    this.#turn(-1);
  }

  turnRight() {
    this.#turn(1);
  }

  clone() {
    return new Beam(this.x, this.y, this.dir);
  }

  get dead() {
    return this.x < 0 || this.y < 0 || this.x >= contraption[0].length || this.y >= contraption.length;
  }
}

const contraption = lines('./input.txt').map(row => [...row].map(tool => ({ tool, energy: 0 })));

const energy = start => {
  // Reset contraption
  contraption.forEach(row =>
    row.forEach(pos => {
      pos.energy = 0;
      pos.dir0 = false;
      pos.dir1 = false;
      pos.dir2 = false;
      pos.dir3 = false;
    })
  );

  let beams = [start];
  while (beams.length) {
    beams.forEach((beam, i) => {
      const pos = contraption[beam.y][beam.x];
      pos.energy++;

      if (pos.tool === '/') {
        beam.dir % 2 ? beam.turnRight() : beam.turnLeft();
      } else if (pos.tool === '\\') {
        beam.dir % 2 ? beam.turnLeft() : beam.turnRight();
      } else if ((pos.tool === '|' && !(beam.dir % 2)) || (pos.tool === '-' && beam.dir % 2)) {
        if (pos[`dir${beam.dir}`]) {
          beams[i] = null;
          return;
        } else {
          const newBeam = beam.clone();
          newBeam.turnLeft();
          newBeam.move();
          !newBeam.dead && beams.push(newBeam);

          pos[`dir${beam.dir}`] = true;
          beam.turnRight();
        }
      }

      beam.move();

      if (beam.dead) {
        beams[i] = null;
      }
    });

    beams = beams.filter(Boolean);
  }

  return contraption.map(row => row.filter(p => p.energy)).flat().length;
};

const print = () => console.log(contraption.map(row => row.map(p => (p.energy ? '#' : p.tool)).join('')).join('\n'));

let max = 0;
for (let i = 0; i < contraption.length; i++) {
  max = Math.max(energy(new Beam(0, i, RIGHT)), energy(new Beam(contraption[0].length - 1, i, LEFT)), max);
}
for (let i = 0; i < contraption[0].length; i++) {
  max = Math.max(energy(new Beam(i, 0, DOWN)), energy(new Beam(i, contraption.length - 1, UP)), max);
}
console.log(max);
