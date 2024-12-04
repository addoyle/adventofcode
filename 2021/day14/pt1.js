const common = require('../../common.js');

const lines = common.lines('input');
const template = lines.shift();
const replacements = lines
  .filter(l => l)
  .map(l => l.split(' -> '))
  .reduce((o, p) => ({ ...o, [p[0]]: p[1] }), {});
const steps = 10;

let tmpl = template;
for (let step = 0; step < steps; step++) {
  tmpl = tmpl
    .split('')
    .map((c, i) => (i < tmpl.length - 1 ? c + (replacements[c + tmpl.charAt(i + 1)] || '') : c))
    .join('');
}

const vals = Object.values(tmpl.split('').reduce((o, c) => ({ ...o, [c]: (o[c] || 0) + 1 }), {})).sort((a, b) => a - b);

console.log(vals.slice(-1) - vals[0]);

// Correct answer: 2003
