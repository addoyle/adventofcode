const common = require('../common');

const eight = Array.from(Array(7).keys());
const indexMap = [
  [0, 1, 2, 4, 5, 6], // 0
  [2, 5], // 1
  [0, 2, 3, 4, 6], // 2
  [0, 2, 3, 5, 6], // 3
  [1, 2, 3, 5], // 4
  [0, 1, 3, 5, 6], // 5
  [0, 1, 3, 4, 5, 6], // 6
  [0, 2, 5], // 7
  [...eight], // 8
  [0, 1, 2, 3, 5, 6] // 9
].map((index, digit) => ({
  digit,
  add: index,
  subtract: eight.filter(n => !index.includes(n))
}));

const getDigitMap = patterns => {
  const union = (a, b) => [...new Set(a.concat(b))];
  const diff = (elementsIn, butNotIn) =>
    elementsIn.filter(i => !butNotIn.includes(i));
  const intersection = (a, b) => a.filter(i => b.includes(i));
  // const subset = (a, containsB) => 

  const digits = {};
  const patternsByLength = patterns
    .split(' ')
    .map(pattern => pattern.split('').sort())
    .reduce(
      (pbl, pattern) => ({
        ...pbl,
        [pattern.length]: pbl[pattern.length]
          ? [...pbl[pattern.length], pattern]
          : [pattern]
      }),
      {}
    );

  // Assign known patterns to numbers
  const one = patternsByLength[2][0];
  const four = patternsByLength[4][0];
  const seven = patternsByLength[3][0];
  const eight = patternsByLength[7][0];

  // We can deduce which pattern represents 3 as it contains all of 1
  const 

  // Top line is easiest, 7 - 1
  digits[0] = diff(seven, one)[0];

  

  console.log(digits);
};

// const getDigitMap = patterns => {
//   const possibles = patterns
//     .split(' ')
//     // .sort((a, b) => b.length - a.length)
//     // .slice(0, 1)
//     .reduce(
//       (hits, pattern) => {
//         // console.log(hits);

//         const letters = pattern.split('');
//         indexMap
//           .filter(i => i.add.length === letters.length)
//           .forEach(index => {
//             index.add.forEach(a =>
//               letters.forEach(l => hits[index.digit][a][l]++)
//             );
//             // index.subtract.forEach(s =>
//             //   letters.forEach(l => hits[index.digit][s][l]--)
//             // );
//           });

//         return hits;
//       },
//       indexMap.reduce(
//         (segs, index, n) => ({
//           ...segs,
//           [n]: eight.reduce(
//             (o, i) => ({
//               ...o,
//               [i]: 'abcdefg'.split('').reduce((o, i) => ({ ...o, [i]: 0 }), {})
//             }),
//             {}
//           )
//         }),
//         {}
//       )
//     );

//   console.log(possibles);

//   // console.log({ eight });

//   // // Build map
//   // return indexMap.reduce(
//   //   (map, index, i) => ({
//   //     ...map,
//   //     [index
//   //       .map(j => eight[j])
//   //       .sort()
//   //       .join('')]: i
//   //   }),
//   //   {}
//   // );
// };

// console.log(
common.lines('small').reduce((sum, entry) => {
  const [signalPattern, output] = entry.split('|');
  // console.log('Inputs:', signalPattern, output);
  const digitMap = getDigitMap(signalPattern.trim());
  // console.log(digitMap);
  // return (
  //   sum +
  //   +output
  //     .trim()
  //     .split(' ')
  //     .map(d => {
  //       const k = d.split('').sort().join('');
  //       // console.log(k, digitMap[k]);
  //       return digitMap[k];
  //     })
  //     .join('')
  // );
}, 0);
// );

// Correct answer:
