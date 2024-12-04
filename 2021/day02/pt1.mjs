import { lines } from '../../common.mjs';

const input = lines('input');

const sub = input.reduce(
  (sub, line) => {
    const [dir, strDist, dist = +strDist] = line.split(' ');
    sub.pos += dir === 'forward' ? dist : 0;
    sub.depth += dir === 'up' ? -dist : dir === 'down' ? dist : 0;

    return sub;
  },
  { depth: 0, pos: 0 }
);

console.log(sub.depth * sub.pos);

// Correct answer: 2150351
