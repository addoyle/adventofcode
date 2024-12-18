import { ArraySet, lines } from '../../common.mjs';

const grid = lines('./sample2.txt').map(line => line.split(''));

const pos = [grid.findIndex(row => row.includes('S')), grid.find(row => row.includes('S')).indexOf('S')];

const moveMap = new Map();

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
        )
        .map(newDir => {
          const moveKey = [...pos, ...newDir].join(',');
          if (!moveMap.has(moveKey)) {
            // Take the first step
            const cur = [pos[0] + newDir[0], pos[1] + newDir[1]];
            // Move to next junction, turn, dead end, or maze end
            while (
              // Walls on both sides
              grid[cur[0] + newDir[1]][cur[1] + newDir[0]] === '#' &&
              grid[cur[0] - newDir[1]][cur[1] - newDir[0]] === '#'
            ) {
              cur[0] += newDir[0];
              cur[1] += newDir[1];

              // Got to the end!
              if (grid[cur[0]][cur[1]] === 'E') {
                break;
              }

              // Wall, dead end
              if (grid[cur[0]][cur[1]] === '#') {
                cur = null;
                break;
              }
            }
            moveMap.set(moveKey, cur);
          }

          // Null implies a dead end
          if (moveMap.get(moveKey) === null) {
            return null;
          }

          const newPos = moveMap.get(moveKey);
          const newScore =
            score +
            // Add number of steps
            Math.abs(newPos[0] - pos[0]) +
            Math.abs(newPos[1] - pos[1]) +
            // A turn was made, add 1000
            (dir[0] !== newDir[0] || dir[1] !== newDir[1] ? 1000 : 0);

          // Made it to the end
          if (grid[newPos[0]][newPos[1]] === 'E') {
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
