import { lines } from '../../common.mjs';

let doIt = true;

console.log(
  lines('./input.txt')
    .join('')
    .match(/((?<=mul\()\d+,\d+(?=\)))|(do\(\))|(don't\(\))/g)
    .filter(instruct => {
      if (instruct === 'do()') {
        doIt = true;
      } else if (instruct === "don't()") {
        doIt = false;
      } else {
        return doIt; // filter based on status of doIt
      }
      return false; // don't add do and don't
    })
    .map(mul =>
      mul
        .split(',')
        .map(n => parseInt(n))
        .reduce((prod, n) => prod * n, 1)
    )
    .reduce((sum, n) => sum + n, 0)
);
