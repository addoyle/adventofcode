import { ArraySet, lines } from '../../common.mjs';

const garden = lines('./sample1.txt')
  .map(line => line.split('').map(c => ({ c, plot: null })))
  .forEach((row, y) => {
    row.forEach((plant, x) => {
      [
        [y + 1, x],
        [y - 1, x],
        [y, x + 1],
        [y, x - 1]
      ]
        .filter(n => garden[n[0]]?.[n[1]] !== undefined)
        .forEach(n => {});
    });
  });

const findPlots = (pt = [0, 0], plot = new ArraySet(), plots = [plot], seen = new ArraySet()) => {
  plot.add(pt);
  seen.add(pt);
  const [y, x] = pt;
  const c = garden[y][x];

  Object.values(
    [
      [y + 1, x],
      [y - 1, x],
      [y, x + 1],
      [y, x - 1]
    ]
      // filter out invalid neighbors
      .filter(n => garden[n[0]]?.[n[1]] !== undefined && !seen.has(n))
      // group neighbors
      .reduce((o, n) => {
        const c = garden[n[0]][n[1]];
        o[c] ??= [];
        o[c].push(n);
        return o;
      }, {})
  )
    // continue search
    .forEach(ns => {
      let nPlot = plot;
      if (garden[ns[0][0]][ns[0][1]] !== c) {
        nPlot = new ArraySet();
        plots.push(nPlot);
      }

      ns.forEach(n => findPlots(n, nPlot, plots, seen));
    });

  return plots;
};

console.log(findPlots());

debugger;
