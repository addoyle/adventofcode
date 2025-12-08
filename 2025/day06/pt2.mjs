import { lines } from '../../common.mjs';

let sum = 0;
const rows = lines('./input.txt');

let cur = [];

const calc = cur => {
  const isAdd = cur.some(p => p.includes('+'));

  sum += cur.map(p => parseInt(p.replace(/[^\d]/g, ''))).reduce((ans, n) => (isAdd ? ans + n : ans * n), isAdd ? 0 : 1);
};

for (let i = rows[0].length - 1; i >= 0; i--) {
  if (rows.every(row => row[i] === ' ')) {
    calc(cur);
    cur = [];
  } else {
    cur.push(rows.map(row => row[i].trim()).join(''));
  }
}
calc(cur);
console.log(sum);
