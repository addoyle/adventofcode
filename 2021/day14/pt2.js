const common = require('../common.js');

const lines = common.lines('sample');
const template = lines.shift().split('');
const reps = lines
  .filter(l => l)
  .map(l => l.split(' -> '))
  .reduce((o, p) => ({ ...o, [p[0]]: p[1] }), {});
const steps = 10;

// Get initial counts of pairs from template
const counts = template.reduce(
  (o, c, i) =>
    i < template.length - 1
      ? { ...o, [c + template[i + 1]]: (o[c] || 0) + 1 }
      : o,
  {}
);
console.log(counts);

for (let step = 0; step < steps; step++) {
  Object.assign(
    counts,
    Object.entries(counts).reduce(
      (o, [k, v]) => ({
        ...o,
        [k[0] + reps[k]]: (o[k[0] + reps[k]] || 0) + v,
        [reps[k] + k[1]]: (o[reps[k] + k[1]] || 0) + v
      }),
      {}
    )
  );

  console.log(counts);
}

const letterCounts = Object.entries(counts)
  .map(e => [e[0][0], e[1]])
  .reduce((o, [k, v]) => ({ ...o, [k]: (o[k] || 0) + v }), {});
console.log(letterCounts);
const vals = Object.values(letterCounts).sort((a, b) => a - b);

console.log(vals.slice(-1) - vals[0]);

// Correct answer: 2003
