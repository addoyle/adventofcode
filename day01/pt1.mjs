import { readFileSync } from 'fs';

console.log(
  Math.max(
    ...readFileSync('input.txt', 'utf8')
      .trim()
      .split('\n\n')
      .map(elf =>
        elf
          .split('\n')
          .map(cal => parseInt(cal))
          .reduce((sum, n) => sum + n, 0)
      )
  )
);

// Answer: 66186
