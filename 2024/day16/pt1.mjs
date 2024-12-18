import { ArraySet, lines } from '../../common.mjs';

const grid = lines('./input.txt').map(line => line.split(''));

const pos = [grid.findIndex(row => row.includes('S')), grid.find(row => row.includes('S')).indexOf('S')];

let gen = [{ visited: new ArraySet([pos]), score: 0, dir: [0, 1], pos: [...pos] }];
let minPathScore = Infinity;
while (gen.length) {
  gen = gen
    .map(({ pos, dir, visited, score }) =>
      [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
      ]
        .filter(
          d =>
            // Not blocked or visited
            !visited.has([pos[0] + d[0], pos[1] + d[1]]) &&
            grid[pos[0] + d[0]][pos[1] + d[1]] !== '#' &&
            // Not the opposite direction
            (dir[0] === 0 || dir[0] !== -d[0]) &&
            (dir[1] === 0 || dir[1] !== -d[1])
          // TODO: Add dead end detection
        )
        .map(newDir => {
          const newPos = [pos[0] + newDir[0], pos[1] + newDir[1]];
          const newScore = score + 1 + (dir[0] !== newDir[0] || dir[1] !== newDir[1] ? 1000 : 0);

          // Made it to the end
          if (grid[pos[0] + newDir[0]][pos[1] + newDir[1]] === 'E') {
            minPathScore = Math.min(minPathScore, newScore);
            return null;
          }

          return {
            pos: newPos,
            score: newScore,
            dir: newDir,
            visited: new ArraySet([...visited, newPos])
          };
        })
    )
    .flat()
    .filter(Boolean);
}
debugger;
