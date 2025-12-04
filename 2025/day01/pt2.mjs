import { lines } from '../../common.mjs';

let numZeroes = 0;

lines('./input.txt')
  .map(rot => (rot[0] === 'L' ? -1 : 1) * parseInt(rot.slice(1)))
  .reduce((pos, rot) => {
    let newPos = pos + rot;

    // no rotation, abort
    if (rot === 0) {
      return newPos;
    }

    numZeroes +=
      rot > 0
        ? Math.floor(newPos / 100) - Math.floor(pos / 100)
        : Math.floor((pos - 1) / 100) - Math.floor((newPos - 1) / 100);

    return newPos;
  }, 50);

console.log(numZeroes);
