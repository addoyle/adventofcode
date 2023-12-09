import { lines } from '../../common.mjs';

const deFibo = arr => arr.slice(1).reduce((diff, n, i) => [...diff, n - arr[i]], []);

console.log(
  lines('./input.txt')
    .map(row => row.split(' ').map(n => parseInt(n)))
    .map(row => {
      const stack = [row];
      for (; !stack.at(-1).every(n => stack.at(-1)[0] === n); stack.push(deFibo(stack.at(-1))));
      return stack.toReversed();
    })
    .map(stack => {
      stack.slice(1).forEach((fibo, i) => (stack[i + 1] = [fibo[0] - stack[i][0], ...fibo]));
      return stack;
    })
    .map(fibo => fibo.at(-1)[0])
    .reduce((sum, n) => sum + n, 0)
);
