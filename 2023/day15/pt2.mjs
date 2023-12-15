import { lines } from '../../common.mjs';

const boxes = Array(256)
  .fill([])
  .map(_ => []);

lines('./input.txt')[0]
  .split(',')
  .map(step => step.split(/[=-]/).filter(Boolean))
  .forEach(([label, lens]) => {
    const box = boxes[[...label].reduce((sum, n) => ((sum + n.charCodeAt(0)) * 17) % 256, 0)];
    const matchIndex = box.findIndex(l => l[0] === label);
    const match = box[matchIndex];

    if (lens !== undefined) {
      if (match) {
        match[1] = lens;
      } else {
        box.push([label, lens]);
      }
    } else if (match) {
      box.splice(matchIndex, 1);
    }
  });
console.log(
  boxes
    .map((box, bi) => box.map((lens, li) => (bi + 1) * (li + 1) * lens[1]))
    .filter(box => box.length)
    .flat()
    .reduce((sum, n) => sum + n, 0)
);
debugger;
