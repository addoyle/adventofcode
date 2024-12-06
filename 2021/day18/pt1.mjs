import { lines } from '../../common.mjs';

const reduce = (num, ancs = [num]) => {
  // Split
  if (!Array.isArray(num)) {
    return num >= 10 ? [Math.floor(num / 2), Math.ceil(num / 2)] : num;
  }

  // Explode
  if (ancs.length >= 4) {
    // Left side explodes
    if (Array.isArray(num[0])) {
      // Try finding next left number in lefts of direct ancestors
      const anc = ancs.find(anc => !Array.isArray(anc[0]));
      if (anc) {
        anc[0] += num[0][0];
      }

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
    else if (Array.isArray(num[1])) {
      // Try finding next right number in rights of direct ancestors
      const anc = ancs.find(anc => !Array.isArray(anc[1]));
      if (anc) {
        anc[1] += num[1][1];
      }

      if (Array.isArray(num[0])) {
      }
      // Left side is a number, explode into it
      else {
        num[0] += num[1][0];
      }
      // Exploding done
      num[1] = 0;
    }
  }

  return num.map(n => reduce(n, [n, ...ancs]));
};

// const homework = lines('./sample1.txt')
//   .map(row => JSON.parse(row))
//   .reduce((sum, num) => {
//     const s = reduce([sum, num]);

//     return s;
//   });
// console.log(JSON.stringify(homework));
// console.log(JSON.stringify(reduce([[[[[9, 8], 1], 2], 3], 4])));
// console.log(JSON.stringify(reduce([7, [6, [5, [4, [3, 2]]]]])));
// console.log(JSON.stringify(reduce([7, [6, [5, [4, 14]]]])));
// console.log(JSON.stringify(reduce([[6, [5, [4, [3, 2]]]], 1])));
console.log(
  JSON.stringify(
    reduce([
      [3, [2, [1, [7, 3]]]],
      [6, [5, [4, [3, 2]]]]
    ])
  )
);
// console.log(JSON.stringify(
//   reduce([
//     [3, [2, [8, 0]]],
//     [9, [5, [4, [3, 2]]]]
//   ])
// ));
debugger;
