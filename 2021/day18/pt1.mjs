import { lines } from '../../common.mjs';

const reduce = (num, ancs = [num]) => {
  // Explode
  if (ancs.length >= 4) {
    // Left side explodes
    if (Array.isArray(num[0])) {
      if (Array.isArray(num[1])) {
      }
      // Right side is a number, explode into it
      else {
        num[1] += num[0][1];
      }
      // Exploding done
      num[0] = 0;
    }
    // Right side explodes
    else {
      if (Array.isArray(num[0])) {
      }
      // Left side is a number, explode into it
      else {
        num[0] += num[1][0];
      }
      // Exploding done
      num[1] = 0;
    }
    return num;
  }

  return num.map(n => (Array.isArray(n) ? reduce(n, [n, ...ancs]) : n));
};

// const homework = lines('./sample1.txt')
//   .map(row => JSON.parse(row))
//   .reduce((sum, num) => {
//     const s = reduce([sum, num]);

//     return s;
//   });
// console.log(JSON.stringify(homework));
console.log(JSON.stringify(reduce([[[[[9, 8], 1], 2], 3], 4])));
console.log(JSON.stringify(reduce([7, [6, [5, [4, [3, 2]]]]])));
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
