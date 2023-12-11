import { lines } from '../../common.mjs';

const ground = lines('./input.txt').map(line => line.split(''));
const loop = [];

// Find starting location
ground.forEach((row, y) => row.forEach((pipe, x) => pipe === 'S' && loop.push([y, x])));

const is = (a, b) => a[0] === b[0] && a[1] === b[1];

// Find first valid neighbor
loop.push(
  [
    [loop[0][0] - 1, loop[0][1], 'F7|'],
    [loop[0][0], loop[0][1] + 1, 'J7-'],
    [loop[0][0] + 1, loop[0][1], 'JL|'],
    [loop[0][0], loop[0][1] + 1, 'FL-']
  ].find(n => n[2].includes(ground[n[0]][n[1]]))
);
loop[1].pop();

while (true) {
  const cur = loop.at(-1);
  const pipe = ground[cur[0]][cur[1]];
  if (pipe === 'S') {
    loop.pop();
    break;
  }

  loop.push(
    (pipe === 'F'
      ? [
          [cur[0] + 1, cur[1]],
          [cur[0], cur[1] + 1]
        ]
      : pipe === '7'
        ? [
            [cur[0] + 1, cur[1]],
            [cur[0], cur[1] - 1]
          ]
        : pipe === 'J'
          ? [
              [cur[0] - 1, cur[1]],
              [cur[0], cur[1] - 1]
            ]
          : pipe === 'L'
            ? [
                [cur[0] - 1, cur[1]],
                [cur[0], cur[1] + 1]
              ]
            : pipe === '|'
              ? [
                  [cur[0] - 1, cur[1]],
                  [cur[0] + 1, cur[1]]
                ]
              : pipe === '-'
                ? [
                    [cur[0], cur[1] - 1],
                    [cur[0], cur[1] + 1]
                  ]
                : []
    ).find(connection => !is(connection, loop.at(-2)))
  );
}

console.log(Math.floor(loop.length / 2));
