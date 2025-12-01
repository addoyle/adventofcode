import { lines } from '../../common.mjs';

let numZeroes = 0;

lines('./input.txt')
  .map(rot => (rot[0] === 'L' ? -1 : 1) * parseInt(rot.slice(1)))
  .reduce((pos, rot) => {
    let newPos = pos + rot;

    if (newPos % 100 === 0) {
      numZeroes++;
    }

    return newPos;
  }, 50);

console.log(numZeroes);