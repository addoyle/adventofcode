import { intLines } from '../common.mjs';

const nodes = intLines('./input.txt').map(v => ({ v }));

// Establish doubly linked list
nodes.forEach((n, i) => {
  n.p = nodes.slice(i - 1)[0];
  n.n = nodes.slice((i + 1) % nodes.length)[0];
});
let head = nodes[0];

const get = i => seq[i % seq.length];

nodes.forEach(node => {
  // If value is 0, becomes the head
  if (node.v === 0) {
    head = node;
  }

  // Remove from list
  node.p.n = node.n;
  node.n.p = node.p;

  let p = node.p,
    n = node.n;

  // Move through list
  for (let _ = 0; _ < Math.abs(node.v); _++) {
    if (node.v >= 0) {
      p = p.n;
      n = n.n;
    } else {
      p = p.p;
      n = n.p;
    }
  }

  // Position back into list
  p.n = node;
  node.p = p;
  n.p = node;
  node.n = n;
});

const seq = (cur =>
  nodes.map(_ => {
    const v = cur.v;
    cur = cur.n;
    return v;
  }))(head);

console.log(get(1000) + get(2000) + get(3000));

// Answer: 4914
