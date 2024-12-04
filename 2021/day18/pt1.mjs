import { lines } from '../../common.mjs';

const reduce = (num, depth = 0) => {
  if (!Array.isArray(num)) {
    return num;
  }

  return num.map(n => reduce(n, depth + 1));
};

const homework = lines('./sample1.txt')
  .map(row => JSON.parse(row))
  .reduce((sum, num) => {
    const s = reduce([sum, num]);

    return s;
  });
console.log(JSON.stringify(homework));
debugger;
