import { lines } from '../../common.mjs';

const BOUNDS = { x: 101, y: 103 };
const MID = { x: (BOUNDS.x - 1) / 2, y: (BOUNDS.y - 1) / 2 };
const t = 100;

console.log(
  lines('./input.txt')
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
    }))
    // Count number in each quadrant
    .reduce(
      (q, robot) => [
        q[0] + (robot.x < MID.x && robot.y < MID.y),
        q[1] + (robot.x > MID.x && robot.y < MID.y),
        q[2] + (robot.x < MID.x && robot.y > MID.y),
        q[3] + (robot.x > MID.x && robot.y > MID.y)
      ],
      [0, 0, 0, 0]
    )
    // Multiply together
    .reduce((prod, s) => prod * s, 1)
);

debugger;
