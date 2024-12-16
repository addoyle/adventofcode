import { lines } from '../../common.mjs';

const dirMap = {
  '^': [0, -1],
  v: [0, 1],
  '<': [-1, 0],
  '>': [1, 0]
};
const [warehouse, directions] = (([warehouse, directions]) => [warehouse, directions.flat().map(d => dirMap[d])])(
  lines('./input.txt').reduce(
    (res, line) => {
      if (line === '') {
        res.push([]);
        return res;
      }
      res.at(-1).push(line.split(''));
      return res;
    },
    [[]]
  )
);

let pos = {
  x: warehouse.find(row => row.includes('@')).findIndex(c => c === '@'),
  y: warehouse.findIndex(row => row.includes('@'))
};

warehouse[pos.y][pos.x] = '.';

directions.forEach(([dx, dy]) => {
  const step = { x: pos.x + dx, y: pos.y + dy };
  const c = warehouse[step.y][step.x];

  // Empty space, take step
  if (c === '.') {
    pos = step;
  } else if (c === 'O') {
    let box = { ...step };
    do {
      box.x += dx;
      box.y += dy;
    } while (warehouse[box.y][box.x] === 'O');

    // Free space, scoot boxes
    if (warehouse[box.y][box.x] === '.') {
      warehouse[step.y][step.x] = '.';
      warehouse[box.y][box.x] = 'O';
      pos = step;
    }
  }
});

console.log(warehouse.reduce((sum, row, y) => sum + row.reduce((s, c, x) => s + (c === 'O' ? 100 * y + x : 0), 0), 0));
