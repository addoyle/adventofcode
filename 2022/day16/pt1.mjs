import { lines } from '../common.mjs';

const NUM_MINS = 30;

const nodes = lines('./sample.txt').map(line =>
  (n => ({
    key: n[1],
    rate: parseInt(n[4].split('=')[1].slice(0, -1)),
    valves: n
      .slice(9)
      .join('')
      .split(',')
      .map(v => v.trim())
  }))(line.split(' '))
);
const nodeMap = nodes.reduce((obj, v) => (obj = { ...obj, [v.key]: v }), {});

// Calculate the current pressure release based on which valves are open
const calcPressure = open =>
  [...open].reduce((sum, k) => sum + nodes[k].rate, 0);

let maxPressure = 0;

// Create weighted distances
const dist = nodes.reduce(
  (dist, node) => ({
    ...dist,
    [node.key]: nodes.reduce(
      (d, n) => ({
        ...d,
        // Flow rate if edge exists, 0 if itself, otherwise Infinity
        [n.key]: node.valves.includes(n.key)
          ? nodeMap[n.key].rate
          : node.key === n.key
          ? 0
          : Infinity
      }),
      {}
    )
  }),
  {}
);

// Floyd-Warshall
const keys = Object.keys(nodeMap);
keys.forEach(i =>
  keys.forEach(j =>
    keys.forEach(
      k => (dist[i][j] = Math.min(dist[i][k] + dist[k][j], dist[i][j]))
    )
  )
);

const doit = (cur, closed, min) => {
  return Math.max(
    ...closed.map(n =>
      dist[cur.key][n.key] < min
        ? n.rate * (min - dist[cur.key][n.key] - 1) +
          doit(
            n,
            closed.filter(n => n.key !== cur.key),
            min - dist[cur.key][n.key] - 1
          )
        : 0
    )
  );
};

console.log(
  doit(
    nodes[0],
    nodes.filter(n => n.rate > 0),
    NUM_MINS
  )
);

// const action = (valve, min = 1, pressure = 0, open = new Set()) => {
//   if (min > NUM_MINS) {
//     maxPressure = Math.max(maxPressure, pressure);
//     return;
//   }

//   // Try opening the valve if closed and flow rate is > 0
//   if (!open.has(valve.key) && valve.rate > 0) {
//     open = new Set([...open, valve.key]);
//     action(valve, min + 1, pressure + calcPressure(open), open);
//   }

//   // Try moving to the next valve

//   valve.valves.forEach(v =>
//     action(v, min + 1, pressure + calcPressure(open), open)
//   );
// };

// // Try starting at each valve
// // Object.values(nodes).forEach(move);
// action(nodes.AA);
