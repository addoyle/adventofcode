import { lines } from '../common.mjs';

const knots = [...Array(10)].map(_ => [0, 0]);
const visited = new Set();

// Add the starting location
visited.add(knots[0].toString());

lines('./input.txt')
  .map(s => s.split(' '))
  .forEach(([dir, steps]) =>
    [...Array(parseInt(steps))].forEach(_ => {
      // Move head
      dir === 'R'
        ? knots[0][0]++
        : dir === 'L'
        ? knots[0][0]--
        : dir === 'D'
        ? knots[0][1]++
        : knots[0][1]--;

      for (let i = 1; i < knots.length; i++) {
        const prev = knots[i - 1];
        const knot = knots[i];
        // Move knot if previous knot is far enough away
        let knotDir = [knot[0] - prev[0], knot[1] - prev[1]];
        if (Math.abs(knotDir[0]) === 2 || Math.abs(knotDir[1]) === 2) {
          if (knotDir[0] === 2 && knotDir[1] === 2) {
            knotDir = [1, 1];
          }
          if (knotDir[0] === 2 && knotDir[1] === -2) {
            knotDir = [1, -1];
          }
          if (knotDir[0] === -2 && knotDir[1] === 2) {
            knotDir = [-1, 1];
          }
          if (knotDir[0] === -2 && knotDir[1] === -2) {
            knotDir = [-1, -1];
          }
          if (knotDir[0] === 2) {
            knotDir = [1, 0];
          }
          if (knotDir[0] === -2) {
            knotDir = [-1, 0];
          }
          if (knotDir[1] === 2) {
            knotDir = [0, 1];
          }
          if (knotDir[1] === -2) {
            knotDir = [0, -1];
          }
          knot[0] = prev[0] + knotDir[0];
          knot[1] = prev[1] + knotDir[1];
        }
      }
      visited.add(knots.slice(-1).toString());
    })
  );

console.log(visited.size);

// Answer: 2651
