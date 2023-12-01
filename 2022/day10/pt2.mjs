import { lines } from '../common.mjs';

let sprite = 1;
let clock = 0;
const width = 40;
const height = 6;
const screen = [...Array(width * height)].fill('.');

const drawPixel = () => {
  if ([sprite - 1, sprite, sprite + 1].includes(clock % width)) {
    screen[clock] = '#';
  }
  clock++;
};

lines('./input.txt')
  .map(instr => instr.split(' '))
  .forEach((instr, i) => {
    // Cycle increases for all commands
    drawPixel();

    // Handle add
    if (instr[0] === 'addx') {
      drawPixel();
      sprite += parseInt(instr[1]);
    }
  });

console.log(
  [...Array(Math.ceil(screen.length / width))]
    .map((_, i) => screen.slice(i * width, (i + 1) * width).join(''))
    .join('\n')
);

// Answer: 15220
