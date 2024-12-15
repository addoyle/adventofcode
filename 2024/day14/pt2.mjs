import { lines } from '../../common.mjs';

const BOUNDS = { x: 101, y: 103 };
const MID = { x: (BOUNDS.x - 1) / 2, y: (BOUNDS.y - 1) / 2 };

for (let t = 0; true; t++) {
  const robots = lines('./input.txt')
    .map(line => {
      const [p, v] = [.../^p=([-\d]+,[-\d]+) v=([-\d]+,[-\d]+)$/.exec(line)]
        .slice(1)
        .map(pair => pair.split(',').map(n => parseInt(n)))
        .map(([x, y]) => ({ x, y }));
      return { p, v };
    })
    // Calculate positions after 100s
    .map(robot => ({
      x: (robot.p.x + robot.v.x * t + BOUNDS.x * t) % BOUNDS.x,
      y: (robot.p.y + robot.v.y * t + BOUNDS.y * t) % BOUNDS.y
    }));

  const robotArray = Array.from({ length: BOUNDS.y }, () => Array(BOUNDS.x).fill('.'));
  robots.forEach(r => {
    robotArray[r.y][r.x] = '#';
  });

  // Look for the existence of a centered x5 triangle
  let triangle = 0;
  for (let i = 0; i < robotArray.length; i++) {
    const robotRow = robotArray[i];
    if (robotRow.slice(MID.x - triangle, MID.x + triangle + 1).join('') === '#'.repeat(triangle * 2 + 1)) {
      triangle++;
    } else {
      triangle = 0;
    }
    if (triangle >= 4) {
      const tree = [];
      for (let y = 0; y < BOUNDS.y; y++) {
        let line = '';
        const rowBots = robots.filter(r => r.y === y);
        for (let x = 0; x < BOUNDS.x; x++) {
          line += rowBots.some(r => r.x === x) ? '#' : '.';
        }
        tree.push(line);
      }

      console.log(tree.join('\n'));
      console.log(t);
      process.exit(1);
    }
  }
}
