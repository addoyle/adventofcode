import { intLines } from '../common.mjs';

const DEC_KEY = 811589153;

const nodes = intLines('./input.txt').map(v => ({ v: v * DEC_KEY }));

const divmod = (a, b) => (a % b) + (a % b && a < 0 ? b : 0);

// Establish doubly linked list
nodes.forEach((n, i) => {
  n.p = nodes.slice(i - 1)[0];
  n.n = nodes.slice((i + 1) % nodes.length)[0];
});
let head = nodes[0];

const get = i => seq[i % seq.length];

[...Array(10)].forEach(_ =>
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
    for (let _ = 0; _ < divmod(node.v, nodes.length - 1); _++) {
      p = p.n;
      n = n.n;
    }

    // Position back into list
    p.n = node;
    node.p = p;
    n.p = node;
    node.n = n;
  })
);

const seq = (cur =>
  nodes.map(_ => {
    const v = cur.v;
    cur = cur.n;
    return v;
  }))(head);

console.log(get(1000) + get(2000) + get(3000));

// Answer: 7973051839072
