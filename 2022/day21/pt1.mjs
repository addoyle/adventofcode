import { lines } from '../common.mjs';

const ops = {
    '+': (m1, m2) => m1 + m2,
    '-': (m1, m2) => m1 - m2,
    '*': (m1, m2) => m1 * m2,
    '/': (m1, m2) => m1 / m2
};

const monkeys = lines('input.txt').reduce((o, line) => {
    const [monkey, raw] = line.split(':');
    if (!isNaN(raw.trim())) {
        o[monkey] = () => parseInt(raw.trim());
    } else {
        const [m1, op, m2] = raw.trim().split(' ');
        o[monkey] = () => ops[op](monkeys[m1](), monkeys[m2]());
    }
    return o;
}, {})

console.log(monkeys.root());

// Answer: 364367103397416