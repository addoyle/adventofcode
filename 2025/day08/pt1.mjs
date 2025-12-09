import { lines } from '../../common.mjs';

const NUM_PAIRS = 10;
const NUM_CIRCUITS = 3;

const dist = (a, b) => Math.abs(Math.sqrt(a.map((_, i) => (b[i] - a[i]) ** 2).reduce((sum, n) => sum + n, 0)));

const jboxes = lines('./sample.txt').map(line => line.split(',').map(n => parseInt(n)));
const connections = new WeakMap();
const hasConnection = (a, b) => Boolean(connections.get(a)?.has(b) || connections.get(b)?.has(a));
const addConnection = (a, b) => {
  if (!connections.has(a)) {
    connections.set(a, new WeakSet());
  }

  connections.get(a).add(b);
};

// Connect up first n
for (let i = 0; i < NUM_PAIRS; i++) {
  const [a, [b]] = jboxes
    .map(jbox => [
      jbox,
      jboxes
        .filter(jb => jb !== jbox && !hasConnection(jbox, jb))
        .reduce(
          ([nb, nbDist], jb) => (jbDist => (nbDist <= jbDist ? [nb, nbDist] : [jb, jbDist]))(dist(jbox, jb)),
          [Array(3).fill(Number.MAX_SAFE_INTEGER), Infinity]
        )
    ])
    .reduce((nPair, pair) => (nPair[1][1] <= pair[1][1] ? nPair : pair));

  addConnection(a, b);
}

// Find n largest circuits
