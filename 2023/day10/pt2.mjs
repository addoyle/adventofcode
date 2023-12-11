import { lines } from '../../common.mjs';

const ground = lines('./input.txt').map(line => line.split(''));
const loop = [];

// Find starting location
ground.forEach((row, y) => row.forEach((pipe, x) => pipe === 'S' && loop.push([y, x])));

const is = (a, b) => a[0] === b[0] && a[1] === b[1];

const printLoop = () => {
  const grid = ground.map(row => row.map(_ => '.'));
  loop.forEach(pos => (grid[pos[0]][pos[1]] = ground[pos[0]][pos[1]]));
  return grid;
};

// Find first valid neighbor
loop.push(
  [
    [loop[0][0] - 1, loop[0][1], 'F7|'],
    [loop[0][0], loop[0][1] + 1, 'J7-'],
    [loop[0][0] + 1, loop[0][1], 'JL|'],
    [loop[0][0], loop[0][1] + 1, 'FL-']
  ].find(n => ground[n[0]] && ground[n[0]][n[1]] && n[2].includes(ground[n[0]][n[1]]))
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

// Convert S to its pipe
(() => {
  const s = loop[0];
  const f = loop[1];
  const e = loop.at(-1);
  // start/first on same row
  if (s[0] === f[0]) {
    // left connection, J7- depending on end
    if (s[1] > f[1]) {
      ground[s[0]][s[1]] = s[0] > e[0] ? 'J' : s[0] < e[0] ? '7' : '-';
    }
    // right connection, LF- depending on end
    else {
      ground[s[0]][s[1]] = s[0] > e[0] ? 'L' : s[0] < e[0] ? 'F' : '-';
    }
  }
  // different row, assumed same col if valid input
  else {
    // bottom connection, JL| depending on end
    if (s[0] > f[0]) {
      ground[s[0]][s[1]] = s[1] > e[1] ? 'J' : s[1] < e[1] ? 'L' : '|';
    }
    // top connection, 7F} depending on end
    else {
      ground[s[0]][s[1]] = s[1] > e[1] ? '7' : s[1] < e[1] ? 'F' : '|';
    }
  }
})();

// Pad space to loop
const expandRow = row => [
  row[0],
  ...row
    .slice(1)
    .map(pipe => ['7J-'.includes(pipe) ? '-' : '.', pipe])
    .flat()
];
const extendPipe = pipe => ['JL|'.includes(pipe) ? '|' : '.'];
const paddedLoop = (pl => [
  expandRow(pl[0]),
  ...pl
    .slice(1)
    .map(row => [
      [
        extendPipe(row[0]),
        ...row
          .slice(1)
          .map(pipe => ['.', extendPipe(pipe)].flat())
          .flat()
      ],
      expandRow(row)
    ])
    .flat()
])(printLoop());

// console.log(paddedLoop.map(row => row.join('')).join('\n'));

// Start at the top-most, left-most corner
const start = (minY => loop.filter(p => p[0] === minY))(loop.reduce((minY, p) => Math.min(minY, p[0]), Infinity))
  .reduce((min, p) => (p[1] < min[1] ? p : min), [0, Infinity])
  .map(i => i * 2 + 1);
const fillLoop = (cur = start) => {
  if (paddedLoop[cur[0]][cur[1]] !== '.') {
    return;
  }
  paddedLoop[cur[0]][cur[1]] = '#';
  fillLoop([cur[0] - 1, cur[1]]);
  fillLoop([cur[0] + 1, cur[1]]);
  fillLoop([cur[0], cur[1] - 1]);
  fillLoop([cur[0], cur[1] + 1]);
};
fillLoop();

console.log(
  paddedLoop
    .filter((_, i) => i % 2 === 0)
    .map(row => row.filter((pipe, i) => i % 2 === 0 && pipe === '#').length)
    .reduce((sum, n) => sum + n, 0)
);

// console.log(paddedLoop.map(row => row.join('')).join('\n'));
debugger;
