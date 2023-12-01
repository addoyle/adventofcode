import { readFileSync } from 'fs';

console.log(
  [
    ...readFileSync('input.txt', 'utf8')
      .trim()
      .split('\n\n')
      .map(elf =>
        elf
          .split('\n')
          .map(cal => parseInt(cal))
          .reduce((sum, n) => sum + n, 0)
      )
      .sort((a, b) => b - a)
      .slice(0, 3)
  ].reduce((sum, n) => sum + n, 0)
);

// Answer: 196804
