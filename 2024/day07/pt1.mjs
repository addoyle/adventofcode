import { lines } from '../../common.mjs';

console.log(
  lines('./input.txt')
    .map(line => line.split(': '))
    .map(([result, terms]) => [parseInt(result), terms.split(' ').map(t => parseInt(t))])
    .filter(([result, terms]) =>
      terms
        .slice(1)
        .reduce((m, t) => m.map(v => [v + t, v * t]).flat(), [terms[0]])
        .some(n => n === result)
    )
    .reduce((sum, [result]) => sum + result, 0)
);
