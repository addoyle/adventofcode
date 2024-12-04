import { lines } from '../../common.mjs';

const input = lines('input');

// First line are the draws
const draws = input.shift().split(',');

// Load boards
const boards = [];
while (input.length) {
  boards.push(
    input
      // Grab a chunk of 6 rows
      .splice(0, 6)
      // Remove the first (empty line)
      .slice(1)
      // Convert lines to arrays
      .map(row =>
        row
          .trim()
          .split(/\s+/)
          .map(v => ({ [v]: false }))
      )
  );
}

let bingos = [];

// Start calling out draws and checking for bingos
let drawI;
for (drawI in draws) {
  const draw = draws[drawI];

  // Mark boards with matches
  boards.forEach(board =>
    board.forEach(row =>
      row.forEach(c => {
        const k = Object.keys(c)[0];
        c[k] = c[k] || k === draw;
      })
    )
  );

  // Check for bingos
  bingos = boards.filter(
    board =>
      // Check rows
      board.filter(r => r.every(v => Object.values(v)[0])).length ||
      // Check columns
      board.some((_, i) => board.every(r => Object.values(r[i])[0]))
  );

  if (bingos.length) {
    break;
  }
}
const finalDraw = +draws[drawI];
const unmarkedScore = bingos[0]
  // Flatten array
  .flat()
  // Get unmarked values
  .filter(v => !Object.values(v)[0])
  // Get sum
  .reduce((sum, v) => sum + +Object.keys(v)[0], 0);

console.log(unmarkedScore * finalDraw);

// Correct answer: 27027
