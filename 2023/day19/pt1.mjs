import { lines } from '../../common.mjs';

const [workflows, parts] = (([workflows, parts]) => [
  workflows.reduce(
    (o, w) => ({
      ...o,
      [w.substring(0, w.indexOf('{'))]: w
        .replaceAll(/^.+\{(.*)\}$/g, '$1')
        .split(',')
        .map(r => r.split(':'))
        .map(([cond, action]) =>
          action
            ? {
                cond: (([cat, op, val]) => ({ cat, op, val: parseInt(val) }))(
                  /^(\w)(\W)(\d+)$/.exec(cond).slice(1)
                ),
                action
              }
            : { action: cond }
        )
    }),
    {}
  ),
  parts.map(r => eval(`const o = ${r.replaceAll('=', ':')}; o;`))
])(
  (arr => (i => [arr.slice(0, i), arr.slice(i + 1)])(arr.indexOf('')))(
    lines('./input.txt')
  )
);

const accepted = parts.filter(part => {
  let flow = workflows.in;
  let next;

  while (!'AR'.includes(next)) {
    for (let i in flow) {
      const { cond, action } = flow[i];
      if (
        !cond ||
        (cond.op === '>' && part[cond.cat] > cond.val) ||
        (cond.op === '<' && part[cond.cat] < cond.val)
      ) {
        next = action;
        break;
      }
    }

    flow = workflows[next];
  }

  return next === 'A';
});

console.log(
  accepted.reduce((sum, part) => sum + part.x + part.m + part.a + part.s, 0)
);
