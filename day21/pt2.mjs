import { lines } from '../common.mjs';

const ops = {
    '+': (m1, m2) => m1 + m2,
    '-': (m1, m2) => m1 - m2,
    '*': (m1, m2) => m1 * m2,
    '/': (m1, m2) => m1 / m2
};
const opOps = {
    '+': ops['-'],
    '-': ops['+'],
    '*': ops['/'],
    '/': ops['*']
}

// Parse monkeys
const monkeys = lines('input.txt').reduce((o, line) => {
    const [monkey, raw] = line.split(':');
    if (!isNaN(raw.trim())) {
        const val = parseInt(raw.trim());
        const out = {
            monkey, val,
            action: () => out.val
        };
        return {
            ...o,
            [monkey]: out
        };
    } else {
        const [m1, op, m2] = raw.trim().split(' ');
        return {
            ...o,
            [monkey]: {
                monkey, m1, op, m2,
                action: monkey === 'root'
                    ? () => monkeys[m1].action() === monkeys[m2].action()
                    : () => ops[op](monkeys[m1].action(), monkeys[m2].action())
            }
        };
    }
}, {});

// Replace monkey names with references and add who yelled at them
const monkify = m => {
    if (!(m.m1 && m.m2)) {
        return;
    }

    m.m1 = monkeys[m.m1];
    m.m2 = monkeys[m.m2];
    m.m1.yeller = m;
    m.m2.yeller = m;

    monkify(m.m1);
    monkify(m.m2);
}
monkify(monkeys.root);

// Mark monkeys in the chain that eventually yelled at humn
const markHumnChain = m => {
    if (m.yeller === undefined) {
        return;
    }

    m.humn = true;
    markHumnChain(m.yeller);
}
markHumnChain(monkeys.humn);

// Calculate what the humn yelled
const calcHuman = (monkey, val) => {
    if (monkey.monkey === 'humn') {
        return val;
    }

    const [a, b] = monkey.m1.humn ? [monkey.m1, monkey.m2] : [monkey.m2, monkey.m1];
    const bVal = b.action();
    const op = opOps[monkey.op];
    let newVal = op(val, bVal);

    // Division requiring reciprocal
    if (monkey.op === '/' && monkey.m2.humn) {
        newVal = 1/val * bVal;
    }

    // Subtraction requiring proper negation
    if (monkey.op === '-' && monkey.m2.humn) {
        newVal = -val + bVal;
    }

    return calcHuman(a, newVal);
};

const humnRoot = monkeys.root.m1.humn ? monkeys.root.m1 : monkeys.root.m2;
const monkeyRoot = monkeys.root.m1 === humnRoot ? monkeys.root.m2 : monkeys.root.m1;

const monkeyAnswer = monkeyRoot.action();
monkeys.humn.val = calcHuman(humnRoot, monkeyAnswer);

console.log(monkeys.humn.val);

// Answer: 3782852515583