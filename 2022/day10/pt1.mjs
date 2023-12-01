import { lines } from '../common.mjs';

const signalStrengths = [20, 60, 100, 140, 180, 220].reduce(
  (o, i) => ({ ...o, [i]: 0 }),
  {}
);
let X = 1;
let clock = 1;

const nextCycle = () => {
  clock++;

  // Calculate signal strengths at the desired clocks
  if (signalStrengths[clock] !== undefined) {
    signalStrengths[clock] = clock * X;
  }
};

lines('./input.txt')
  .map(instr => instr.split(' '))
  .forEach(instr => {
    // Cycle increases for all commands
    nextCycle();

    // Handle add
    if (instr[0] === 'addx') {
      X += parseInt(instr[1]);
      nextCycle();
    }
  });

console.log(Object.values(signalStrengths).reduce((sum, s) => sum + s, 0));

// Answer: 15220
