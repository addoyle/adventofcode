const common = require('../../common.js');

const lines = common.lines('input').map(r => r.split('-'));

function Node(name) {
  this.name = name;
  this.paths = new Set();
  this.small = name === name.toLowerCase();
}

const caves = [];

// Step 1, create the graph
lines.forEach(([a, b]) => {
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
  // We're at the start, terminate
  if (node.name === 'start' && route.some(n => n.name === 'start')) return;

  // We're at the end, store a new route and then terminate
  if (node.name === 'end') {
    routes.add(route.map(n => n.name).join(','));
    return;
  }

  // Small caves can only be visited once, except 1 can be visited twice
  if (
    node.small &&
    route.some(n => n.name === node.name) &&
    route.filter(n => n.small).length > new Set(route.filter(n => n.small).map(n => n.name)).size
  ) {
    return;
  }

  // Add node to route
  route.push(node);

  // Take paths
  node.paths.forEach(n => takePath(n, [...route]));
};
// Start exploring!
takePath(caves.find(n => n.name === 'start'));

console.log(routes.size);

// Correct answer:
