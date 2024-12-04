const common = require('../../common');

const input = common.lines('input');

const sub = input.reduce(
  (sub, line) => {
    const [dir, strDist, dist = +strDist] = line.split(' ');
    if (dir === 'forward') {
      sub.pos += dist;
      sub.depth += sub.aim * dist;
    }
    sub.aim += dir === 'up' ? -dist : dir === 'down' ? dist : 0;

    return sub;
  },
  { depth: 0, pos: 0, aim: 0 }
);

console.log(sub.depth * sub.pos);

// Correct answer: 1842742223
