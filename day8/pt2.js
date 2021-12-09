const common = require('../common');

const getDigitMap = patterns => {
  const union = (a, b) => [...new Set(a.concat(b))];
  const diff = (elementsIn, butNotIn) =>
    elementsIn.filter(i => !butNotIn.includes(i));
  const intersect = (a, b) => a.filter(i => b.includes(i));
  const subset = (a, containsB) => intersect(a, containsB).length === containsB.length;

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

  const digitMap = {};

  // Assign known patterns to numbers
  digitMap[1] = patternsByLength[2][0];
  digitMap[4] = patternsByLength[4][0];
  digitMap[7] = patternsByLength[3][0];
  digitMap[8] = patternsByLength[7][0];

  // Deduce remaining numbers

  // 3 contains 1
  digitMap[3] = patternsByLength[5].filter(pattern => subset(pattern, digitMap[1]))[0];
  // 5 unioned with 1 contains 4
  digitMap[5] = patternsByLength[5].filter(pattern => subset(union(pattern, digitMap[1]), digitMap[4]))[0];
  // 2 is the only 5-length left
  digitMap[2] = diff(patternsByLength[5], [digitMap[3], digitMap[5]])[0];

  // 9 contains 4
  digitMap[9] = patternsByLength[6].filter(pattern => subset(pattern, digitMap[4]))[0];
  // 0 contains 1, and isn't nine
  digitMap[0] = patternsByLength[6].filter(pattern => subset(pattern, digitMap[1]) && pattern !== digitMap[9])[0];
  // 6 is what's left
  digitMap[6] = diff(patternsByLength[6], [digitMap[9], digitMap[0]])[0];

  return Object.values(digitMap).reduce((map, digit, i) => ({...map, [digit.join('')]: i}), {});
};

console.log(
  common.lines('input').reduce((sum, entry) => {
    const [signalPattern, output] = entry.split('|').map(s => s.trim());
    const digitMap = getDigitMap(signalPattern);
    
    return (
      sum +
      +output
        .trim()
        .split(' ')
        .map(d => digitMap[d.split('').sort().join('')])
        .join('')
    );
  }, 0)
);

// Correct answer: 1012089
