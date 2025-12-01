import { lines } from '../../common.mjs';

const dirMap = {
  '^': [0, -1],
  v: [0, 1],
  '<': [-1, 0],
  '>': [1, 0]
};
const objMap = {
  '#': '##',
  O: '[]',
  '.': '..',
  '@': '@.'
};
const [warehouse, directions] = (([warehouse, directions]) => [
  warehouse.map(row => row.map(c => objMap[c].split('')).flat()),
  directions.flat().map(d => dirMap[d])
])(
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

// Replace starting location
warehouse[pos.y][pos.x] = '.';

directions.forEach(([dx, dy]) => {
  const step = { x: pos.x + dx, y: pos.y + dy };
  const c = warehouse[step.y][step.x];

  // Empty space, take step
  if (c === '.') {
    pos = step;
  } else if ('[]'.includes(c)) {
    // Horizontal pushing
    if (dx !== 0) {
      let box = { ...step };
      do {
        box.x += dx;
        box.y += dy;
      } while ('[]'.includes(warehouse[box.y][box.x]));

      // Free space, scoot boxes
      if (warehouse[box.y][box.x] === '.') {
        warehouse[step.y].splice(box.x, 1);
        warehouse[step.y].splice(step.x, 0, '.');
        pos = step;
      }
    } else {
      let rows = [[step.x, step.x + (c === '[' ? 1 : -1)]];

      // Single box against edge, quit
      if (rows[0].some(x => warehouse[step.y + dy][x] === '#')) {
        return;
      }

      for (let row = step.y + dy; rows.at(-1).some(x => '[]'.includes(warehouse[row][x])); row += dy) {
        // Encountered a wall, stop all pushing
        if (rows.at(-1).some(x => warehouse[row][x] === '#')) {
          return;
        }
        // At least one box is pushing another box, add all pushed boxes
        rows.push([
          ...new Set(
            rows
              .at(-1)
              .filter(x => '[]'.includes(warehouse[row][x]))
              .map(x => [x, x + (warehouse[row][x] === '[' ? 1 : -1)])
              .flat()
          )
        ]);
      }

      // Double check last row
      if (rows.at(-1).some(x => warehouse[step.y + rows.length * dy][x] === '#')) {
        return;
      }

      // Scoot those boxes!
      for (let y = step.y + rows.length * dy, row = rows.pop(); row; row = rows.pop(), y -= dy) {
        row.forEach(x => {
          const temp = warehouse[y][x];
          warehouse[y][x] = warehouse[y - dy][x];
          warehouse[y - dy][x] = rows.length > 1 ? temp : '.';
        });
      }
      pos = step;
    }
  }
});

console.log(warehouse.reduce((sum, row, y) => sum + row.reduce((s, c, x) => s + (c === '[' ? 100 * y + x : 0), 0), 0));
