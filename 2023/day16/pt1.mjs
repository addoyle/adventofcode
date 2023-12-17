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
let beams = [new Beam()];

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

console.log(contraption.map(row => row.filter(p => p.energy)).flat().length);
