import { lines } from '../common.mjs';

const head = [0, 0];
const tail = [0, 0];
const visited = new Set();

// Add the starting location
visited.add(tail.toString());

lines('./input.txt')
  .map(s => s.split(' '))
  .forEach(([dir, steps]) =>
    [...Array(parseInt(steps))].forEach(_ => {
      // Move head
      dir === 'R'
        ? head[0]++
        : dir === 'L'
        ? head[0]--
        : dir === 'D'
        ? head[1]++
        : head[1]--;

      // Move tail if head is far enough away
      let tailDir = [tail[0] - head[0], tail[1] - head[1]];
      if (Math.abs(tailDir[0]) === 2 || Math.abs(tailDir[1]) === 2) {
        if (tailDir[0] === 2) {
          tailDir = [1, 0];
        }
        if (tailDir[0] === -2) {
          tailDir = [-1, 0];
        }
        if (tailDir[1] === 2) {
          tailDir = [0, 1];
        }
        if (tailDir[1] === -2) {
          tailDir = [0, -1];
        }
        tail[0] = head[0] + tailDir[0];
        tail[1] = head[1] + tailDir[1];
        visited.add(tail.toString());
      }
    })
  );

const min = [...visited]
  .map(pt => pt.split(',').map(i => parseInt(i)))
  .reduce(
    (min, pt) => [Math.min(min[0], pt[0]), Math.min(min[1], pt[1])],
    [0, 0]
  );
console.log(
  [...visited]
    .map(pt => pt.split(',').map(i => parseInt(i)))
    .reduce((arr, pt) => {
      if (!arr[pt[1] - min[1]]) {
        arr[pt[1] - min[1]] = [];
      }
      arr[pt[1] - min[1]][pt[0] - min[0]] = '#';
      return arr;
    }, [])
    .map(row => [...row].map(c => c || ' ').join(''))
    .join('\n')
);

console.log(visited.size);
