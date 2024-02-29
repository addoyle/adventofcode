import { lines } from '../../common.mjs';

const max = 4000;

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
    lines('./sample.txt')
  )
);

const ranges = [];

// 167409079868000
// 44912717000496
// 16811877338644
// 15197969492500
// 1583726285857872
let combo = 0;
const findCombos = (part, flowKey = 'in') => {
  const foo = r => r.join(',');
  console.log({
    x: foo(part.x),
    m: foo(part.m),
    a: foo(part.a),
    s: foo(part.s),
    flowKey
  });

  if (flowKey === 'A') {
    ranges.push({ ...part });
    const prod = Object.values(part)
      .map(([l, u]) => u - l + 1)
      .reduce((p, v) => p * v, 1);
    combo += prod;
    console.log('added', { prod, combo });
    return;
  }
  if (flowKey === 'R') {
    return;
  }
  const flow = workflows[flowKey];

  for (let i in flow) {
    const { cond, action } = flow[i];
    // v=5
    if (!cond) {
      findCombos(part, action);
    } else if (cond.op === '<') {
      if (part[cond.cat][0] < cond.val) {
        // Range less than val
        // [1,10]: [1,4]
        // [1,2]: [1,2]
        findCombos(
          {
            ...part,
            [cond.cat]: [
              part[cond.cat][0],
              Math.min(cond.val - 1, part[cond.cat][1])
            ]
          },
          action
        );

        // Update lower-bound
        // [1,10]: [5,10]
        // [1,2]: break
        if (part[cond.cat][1] >= cond.val) {
          part[cond.cat][0] = cond.val;
        }
      }
    } else if (cond.op === '>') {
      // Range greater than val
      // [1,10]: [6,10]
      // [9,10]: [9,10]
      if (part[cond.cat][1] > cond.val) {
        findCombos(
          {
            ...part,
            [cond.cat]: [
              Math.max(cond.val + 1, part[cond.cat][0]),
              part[cond.cat][1]
            ]
          },
          action
        );
      }

      // Update upper-bound
      // [1,10]: [1,5]
      // [9,10]: break
      if (part[cond.cat][0] <= cond.val) {
        part[cond.cat][1] = cond.val;
      }
    }
  }
};

findCombos({ x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] });

console.log(167409079868000);
