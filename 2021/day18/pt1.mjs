import { lines } from '../../common.mjs';

const homework = lines('./sample1.txt').map(row => JSON.parse(row));
console.log(homework);
debugger;
