import { lines } from '../../common.mjs';

let pos = {};
const visited = new Set();
const d = [0, -1];
const loops = new Set();

const grid = lines('./input.txt').map((line, y) =>
  line.split('').map((c, x) => {
    if (c === '^') {
      pos = { x, y };
      return 0;
    }
    return '.#'.indexOf(c);
  })
);

const print = loop => {
  // Copy
  const g = grid.map(row => row.map(c => '.#'[c]));

  [...visited].forEach(key => {
    let [p, d] = key.split('+').map(r => r.split(',').map(n => parseInt(n)));
    g[p[1]][p[0]] = '<v ^>'[(d[0] + 1) * 2 - d[1]];
  });
  [...loops].forEach(key => {
    let p = key.split(',').map(n => parseInt(n));
    g[p[1]][p[0]] = 'O';
  });

  [...loop].forEach(key => {
    let [p, d] = key.split('+').map(r => r.split(',').map(n => parseInt(n)));
    g[p[1]][p[0]] = '⇐⇓ ⇑⇒'[(d[0] + 1) * 2 - d[1]];
  });

  g[pos.y][pos.x] = 'S';

  console.log(g.map(row => row.join('')).join('\n'), '\n');
};

const key = (pos, d) => [Object.values(pos).join(','), d?.join(',')].filter(Boolean).join('+');
const turn = d => {
  d.reverse().forEach((v, i, rd) => (rd[i] = i ? v : -v));
  return d;
};
const step = (pos, d) => {
  pos.x += d[0];
  pos.y += d[1];
};
const peek = (pos, d) => ({ x: pos.x + d[0], y: pos.y + d[1] });
const obstacle = pos => !!grid[pos.y][pos.x];
const inBounds = pos => pos.x >= 0 && pos.x < grid[0].length && pos.y >= 0 && pos.y < grid.length;

let turns = 0;

// Rows and cols that have been traversed at least once in a particular direction
const rowsSeen = new Set();
const colsSeen = new Set();
const inSeen = (pos, d) => {
  const l = turn([...d]);
  return rowsSeen.has([pos.y, l[0]].join(',')) || colsSeen.has([pos.x, l[1]].join(','));
};

// Start walkin
do {
  // Obstacle? Turn 90
  if (obstacle(peek(pos, d))) {
    turn(d);
    turns++;
  }

  // Take a step!
  step(pos, d);

  // Record that we've been in this col/row
  if (d[0] !== 0) {
    rowsSeen.add([pos.y, d[0]].join(','));
  }
  if (d[1] !== 0) {
    colsSeen.add([pos.x, d[1]].join(','));
  }

  // Does it loop? Don't look if we've never visted that row/col
  if (inSeen(pos, d)) {
    const loopSeen = new Set();
    for (const l = turn([...d]), look = { ...pos }; inBounds(peek(look, l)); step(look, l)) {
      const k = key(look, l);
      if (visited.has(k) || loopSeen.has(k)) {
        loops.add(key(peek(pos, d)));
        print(loopSeen);
        break;
      }
      loopSeen.add(k);

      if (obstacle(peek(look, l))) {
        turn(l);
      }
    }
  }

  visited.add(key(pos, d));

  // print();
} while (inBounds(peek(pos, d)));

console.log(loops);
