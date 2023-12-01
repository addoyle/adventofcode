import { lines } from '../common.mjs';

const RIGHT = 0;
const DOWN = 1;
const LEFT = 2;
const UP = 3;

const nodes = [];
const inputLines = lines('input.txt');
const path = [...inputLines.pop().match(/[A-Z]+|[0-9]+/g)];
inputLines.pop();

class Node {
    x; y; open; nbs = [];

    constructor() {
        [this.x, this.y, this.open] = [...arguments];
    }

    get right() { return this.nbs[RIGHT]; }
    set right(node) { this.nbs[RIGHT] = node; }
    get down() { return this.nbs[DOWN]; }
    set down(node) { this.nbs[DOWN] = node; }
    get left() { return this.nbs[LEFT]; }
    set left(node) { this.nbs[LEFT] = node; }
    get up() { return this.nbs[UP]; }
    set up(node) { this.nbs[UP] = node; }
}

// Build and parse nodes
let maxX = 0;
inputLines.forEach((row, y) => {
    nodes.push([]);
    row.split('').forEach((c, x) => {
        if (c !== ' ') {
            const node = new Node(x, y, c === '.');
            nodes[y][x] = node;

            maxX = Math.max(maxX, x);

            if (nodes[y-1] && nodes[y-1][x]) {
                nodes[y-1][x].down = node;
                node.up = nodes[y-1][x];
            }
            if (nodes[y][x-1]) {
                nodes[y][x-1].right = node;
                node.left = nodes[y][x-1];
            }
        }
    });
    // Connect start/end nodes on each row
    const nRow = nodes[y].filter(Boolean);
    const start = nRow[0];
    const end = nRow.slice(-1)[0];
    start.left = end;
    end.right = start;
});

// Connect the ups/downs from the firsts/lasts for each column
Array.from(Array(maxX)).forEach((_, x) => {
    const col = nodes.filter(n => n[x]);
    const top = col[0][x];
    const bottom = col.slice(-1)[0][x];
    if (top && bottom) {
        top.up = bottom;
        bottom.down = top;
    }
})

let loc = nodes.find(Boolean).find(Boolean);
let dir = RIGHT;

// 1 for right, -1 for left
const turn = d => (dir + d) > 3 ? 0 : (dir + d) < 0 ? 3 : dir + d;

// Start walking
path.forEach(a => {
    // Turn
    if (['L', 'R'].includes(a)) {
        dir = turn(a === 'L' ? -1 : 1);
    }
    // Walk
    else {
        const steps = parseInt(a);
        for (let s = 0; s < steps; s++) {
            if (!loc.nbs[dir].open) {
                break;
            }
            loc = loc.nbs[dir];
        }
    }
})

console.log((loc.y + 1) * 1000 + (loc.x + 1 )* 4 + dir);

// Answer: 144244