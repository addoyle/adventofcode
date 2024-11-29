import { lines } from '../../common.mjs';

const clone = graph =>
  Object.entries(graph).reduce((o, [k, comps]) => {
    o[k] = new Set([...comps]);
    return o;
  }, {});

const getGroups = conns => {
  // Deep clone
  const c = clone(conns);

  const removeConnected = (comp, group = new Set()) => {
    group.add(comp);

    // Pull out and clear set
    const connected = c[comp];

    // Null, done this branch
    if (!connected) {
      return group;
    }

    // Delete component
    delete c[comp];

    // Remove connected components
    [...connected].forEach(conn => removeConnected(conn, group));

    return new Set([...group]);
  };

  const groups = [];

  while (Object.keys(c).length) {
    groups.push(removeConnected(Object.keys(c)[0]));
  }

  return groups;
};

const graph = lines('./input.txt')
  .map(line => line.split(': '))
  .reduce((o, [k, cs]) => {
    o[k] ??= new Set();
    cs.split(' ').forEach(c => {
      o[k].add(c);
      o[c] ??= new Set();
      o[c].add(k);
    });
    return o;
  }, {});

const edgeCentrality = Object.entries(graph).reduce((map, [key, conns]) => {
  conns.forEach(conn => {
    map[[key, conn].toSorted().join('-')] ??= 0;
  });
  return map;
}, {});
debugger;

// Calculate betweenness for all edges
Object.keys(graph).forEach((node, i, arr) => {
  console.log(`${i}/${arr.length}: Betweenness for ${node}`);

  // Get shortest paths for node
  const queue = [node];
  const shortestPaths = { [node]: [] };
  const pathCount = { [node]: 1 };
  while (queue.length) {
    const cur = queue.pop();

    [...graph[cur]].forEach(n => {
      if (!shortestPaths[n]) {
        queue.push(n);
        shortestPaths[n] = [...shortestPaths[cur], cur];
        pathCount[n] = pathCount[cur];
      } else if (shortestPaths[n] && shortestPaths[n].length === shortestPaths[cur].length + 1) {
        pathCount[n] += pathCount[cur];
      }
    });
  }
  let time = new Date().getTime();

  // Calculate edge contributions in each path
  const edgeContributions = {};
  Object.entries(shortestPaths)
    .toSorted(([_, a], [__, b]) => b.length - a.length)
    .forEach(([node, path]) => {
      path.forEach(a => {
        const e = [a, node].toSorted().join('-');
        edgeContributions[e] ??= 0;
        edgeContributions[e] += pathCount[a] / pathCount[node];
      });
    });
  console.log(edgeContributions);
  console.log('  edge contributions done', Object.keys(edgeContributions).length, new Date().getTime() - time);

  // Combine edge contributions
  Object.entries(edgeContributions).forEach(([edge, contribution]) => {
    if (edgeCentrality[edge] !== undefined) {
      edgeCentrality[edge] += contribution;
    }
  });

  // Take top 3 of list and check if groups split into 2
  const test = clone(graph);
  Object.entries(edgeCentrality)
    .toSorted(([_, a], [__, b]) => b - a)
    .slice(0, 3)
    .map(([edge]) => edge.split('-'))
    .forEach(([a, b]) => {
      test[a].delete(b);
      test[b].delete(a);
    });

  const groups = getGroups(test);
  if (groups.length === 2) {
    console.log(groups.reduce((p, g) => p * g.size, 1));
    process.exit(0);
  }
});

// Take top 3 of list and check if groups split into 2
for (
  let contributions = Object.entries(edgeCentrality).toSorted(([_, a], [__, b]) => b - a),
    i = 0,
    top3 = contributions.slice(0, 3).map(([key]) => key);
  i < contributions.length - 3;
  i++, top3 = contributions.slice(i, i + 3).map(([key]) => key)
) {
  const test = clone(graph);
  top3
    .map(edge => edge.split('-'))
    .forEach(([a, b]) => {
      test[a].delete(b);
      test[b].delete(a);
    });

  const groups = getGroups(test);
  if (groups.length === 2) {
    console.log(groups.reduce((p, g) => p * g.size, 1));
    break;
  }
}

debugger;

// console.log(numGroups(graph));
// graph['hfx'].delete('pzl');
// graph['pzl'].delete('hfx');
// graph['bvb'].delete('cmg');
// graph['cmg'].delete('bvb');
// graph['nvd'].delete('jqt');
// graph['jqt'].delete('nvd');
// console.log(numGroups(graph));
