import { lines } from '../common.mjs';

const START = -1;
const END = 26;
const a = 'a'.charCodeAt(0);
const S = 'S'.charCodeAt(0);
const E = 'E'.charCodeAt(0);

const grid = lines('./sample.txt').map(l => l.split('')
  .map(c => c.charCodeAt(0) - a)
  .map(c => c === S - a ? START : c === E - a ? END : c);
const get = pt => grid[pt[1]][pt[0]];

const paths = [];
const stepUp = (pt, steps) => {
  steps++;
  
  if (get(pt) === END) {
    paths.add(steps);
    return;
  }

  
}

console.log(grid);