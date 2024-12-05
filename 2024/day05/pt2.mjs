import { lines } from '../../common.mjs';

const { rules, updates } = (() => {
  let doneRules = false;
  return lines('./input.txt').reduce(
    ({ rules, updates }, line) => {
      if (line === '') {
        doneRules = true;
      } else if (doneRules) {
        updates.push(
          line
            .split(',')
            .map(n => parseInt(n))
            .reduce((o, n, i) => o.set(n, i), new Map())
        );
      } else {
        rules.push(line.split('|').map(n => parseInt(n)));
      }
      return { rules, updates };
    },
    { rules: [], updates: [] }
  );
})();

console.log(
  updates
    .filter(
      update =>
        !rules.every(
          ([before, after]) => !(update.has(before) && update.has(after)) || update.get(before) < update.get(after)
        )
    )
    .map(update => [...update.keys()])
    .map(update =>
      update.toSorted((a, b) => {
        for (const [before, after] of rules) {
          if (before === a && after === b) {
            return -1;
          } else if (before === b && after === a) {
            return 1;
          }
        }
        return 0;
      })
    )
    .reduce((sum, update) => sum + update[Math.floor(update.length / 2)], 0)
);
