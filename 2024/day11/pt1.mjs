import { lines } from '../../common.mjs';

let gen = lines('./input.txt')[0]
  .split(' ')
  .map(n => parseInt(n));

for (let i = 0; i < 25; i++) {
  gen = gen.reduce((rocks, rock) => {
    const rockStr = `${rock}`;
    if (rock === 0) {
      rocks.push(1);
    } else if (rockStr.length % 2 === 0) {
      rocks.push(parseInt(rockStr.slice(0, rockStr.length / 2)), parseInt(rockStr.slice(rockStr.length / 2)));
    } else {
      rocks.push(rock * 2024);
    }

    return rocks;
  }, []);
}
console.log(gen.length);
