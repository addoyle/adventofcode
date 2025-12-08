import { lines } from '../../common.mjs';

const [ranges, ids] = (rows => {
  const indexOf = rows.indexOf('');
  return [
    rows.slice(0, indexOf).map(range => range.split('-').map(n => parseInt(n))),
    rows.slice(indexOf + 1).map(n => parseInt(n))
  ];
})(lines('./input.txt'));

console.log(ids.filter(id => ranges.some(([low, hi]) => id >= low && id <= hi)).length);
