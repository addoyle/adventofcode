const common = require('../../common');

const input = common.lines('input');

const matchBits = (vals, i, crit) => {
  if (vals.length <= 1) {
    return vals;
  }

  const bitCount = vals.reduce((bits, line) => {
    const c = line.charAt(i);
    bits[c] = (bits[c] || 0) + 1;
    return bits;
  }, {});
  const sigBit = crit(bitCount['0'], bitCount['1']);

  return matchBits(
    vals.filter(v => v.charAt(i) === sigBit),
    i + 1,
    crit
  );
};

const o2 = parseInt(matchBits(input, 0, (z, o) => (z > o ? '0' : z < o ? '1' : '1')).join(''), 2);
const co2 = parseInt(matchBits(input, 0, (z, o) => (z > o ? '1' : z < o ? '0' : '0')).join(''), 2);

console.log(o2 * co2);

// Correct answer: 1662846
