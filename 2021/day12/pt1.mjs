import { lines } from '../../common.mjs';

const inputLines = lines('input').map(r => r.split('-'));

function Node(name) {
  this.name = name;
  this.paths = new Set();
  this.small = name === name.toLowerCase();
}

const caves = [];

// Step 1, create the graph
inputLines.forEach(([a, b]) => {
  // Create nodes if they don't already exist
  caves.push(...[a, b].filter(name => !caves.map(n => n.name).includes(name)).map(name => new Node(name)));

  // Get the two nodes
  const [left, right] = [a, b].map(name => caves.find(n => n.name === name));

  // Create connection between the two
  left.paths.add(right);
  right.paths.add(left);
});

const routes = new Set();

// Step 2, find routes
const takePath = (node, route = []) => {
  // Terminate if we're at a small cave we've been before
  if (node.small && route.includes(node.name)) return;

  // If we're at the end, store a new route and then terminate
  if (node.name === 'end') {
    routes.add([...route].join(','));
    return;
  }

  // Add node to route
  route.push(node.name);

  // Take paths
  node.paths.forEach(n => takePath(n, [...route]));
};
// Start exploring!
takePath(caves.find(n => n.name === 'start'));

console.log(routes.size);

// Correct answer: 5104
