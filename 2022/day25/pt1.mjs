import { lines } from '../common.mjs';

const d2dec = {'=': -2, '-': -1, '0': 0, '1': 1, '2': 2};
const snafu2dec = snafu => snafu.split('').reverse()
  .map((d, i) => 5 ** i * d2dec[d], 0)
  .reduce((sum, s) => sum + s, 0);
const dec2snafu = dec => {
  const digits = [];
  while (dec !== 0) {
    const digit = [0, 1, 2, -2, -1][dec % 5];
    digits.push('012=-'[dec % 5]);
    dec -= digit
    dec = Math.floor(dec / 5);
  }
  return digits.reverse().join('');
}

console.log(dec2snafu(lines('./input.txt').map(snafu2dec).reduce((sum, v) => sum + v, 0)));