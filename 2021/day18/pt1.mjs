import { lines } from '../../common.mjs';

const reduce = ([a, b], ancs = [[a, b]]) => {
  // Explode
  if (ancs.length >= 4) {
    console.log([a, b]);
    if (Array.isArray(a)) {
    }
  }

  return [a, b].map(n => (Array.isArray(n) ? reduce(n, [n, ...ancs]) : n));
};

// const homework = lines('./sample1.txt')
//   .map(row => JSON.parse(row))
//   .reduce((sum, num) => {
//     const s = reduce([sum, num]);

//     return s;
//   });
// console.log(JSON.stringify(homework));
console.log(reduce([[[[[9, 8], 1], 2], 3], 4]));
// console.log(reduce([7, [6, [5, [4, [3, 2]]]]]));
// console.log(reduce([[6, [5, [4, [3, 2]]]], 1]));
// console.log(
//   reduce([
//     [3, [2, [1, [7, 3]]]],
//     [6, [5, [4, [3, 2]]]]
//   ])
// );
// console.log(
//   reduce([
//     [3, [2, [8, 0]]],
//     [9, [5, [4, [3, 2]]]]
//   ])
// );
debugger;
