import { lines } from '../../common.mjs';

const blank = length => Array.from({ length }, () => undefined);

let id = 0;
const blocks = lines('./input.txt')[0]
  .split('')
  .map(n => parseInt(n))
  .reduce((blocks, indicator, i) => {
    if (i % 2) {
      blocks.push(blank(indicator));
    } else {
      blocks.push(Array(indicator).fill(id++));
    }
    return blocks;
  }, []);

for (let i = blocks.length - 1; i > 1; i--) {
  const block = blocks[i];

  // Empty block or free space block, skip
  if (!block.length || block[0] === undefined) {
    continue;
  }

  // Attempt to find a free space big enough
  for (let j = 0; j < i; j++) {
    const b = blocks[j];

    // Non-empty block or too small
    if (b[0] !== undefined || b.length < block.length) {
      continue;
    }

    // Clear block and combine space around it
    blocks[i] = blank(block.length);
    // Combine with space before it
    if (blocks[i - 1] && blocks[i - 1][0] === undefined) {
      blocks[i - 1] = blank(blocks[i - 1].length + block.length); // expand free space
      blocks.splice(i, 1);
      i--;
    }
    // Combine with space after it
    if (blocks[i + 1] && blocks[i + 1][0] === undefined) {
      blocks[i] = blank(blocks[i].length + blocks[i + 1].length);
      blocks.splice(i + 1, 1);
    }

    // Insert into free space
    blocks[j] = block;
    const diff = b.length - block.length;
    if (diff > 0) {
      blocks.splice(j + 1, 0, blank(diff));
      i++;
    }
    break;
  }
}

console.log(blocks.flat().reduce((checksum, n, i) => (checksum += (n ?? 0) * i)));
