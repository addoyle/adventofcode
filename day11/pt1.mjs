import { readFile, readFileSync } from 'fs';

const monkeys = [];

readFileSync('./input.txt', 'utf8')
  .split('\n\n')
  .forEach(raw => {
    const lines = raw.split('\n');
    monkeys[parseInt(lines[0].split(' ')[1].slice(0, '-1'))] = {
      items: lines[1]
        .split(':')[1]
        .split(',')
        .map(n => parseInt(n.trim())),
      operation: (op => old => {
        let newVal;
        eval(op);
        return newVal;
      })(lines[2].split(':')[1].trim().replace(/new/, 'newVal')),
      test: (test => ({ [test[1]]: parseInt(test[3]) }))(
        lines[3].trim().split(' ')
      ),
      then: (then => ({ [then[0]]: parseInt(then.slice(-1)) }))(
        lines[4].split(':')[1].trim().split(' ')
      ),
      fail: (fail => ({ [fail[0]]: parseInt(fail.slice(-1)) }))(
        lines[5].split(':')[1].trim().split(' ')
      ),
      inspects: 0
    };
  });

const nextRound = () => {
  monkeys.forEach(monkey => {
    for (let item = monkey.items.shift(); item; item = monkey.items.shift()) {
      monkey.inspects++;
      const worry = Math.floor(monkey.operation(item) / 3);
      monkeys[
        monkey[
          monkey.test.divisible && worry % monkey.test.divisible === 0
            ? 'then'
            : 'fail'
        ].throw
      ].items.push(worry);
    }
  });
};

[...Array(20)].forEach(nextRound);

console.log(
  monkeys
    .map(m => m.inspects)
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((p, i) => p * i, 1)
);

// Answer: 182293
