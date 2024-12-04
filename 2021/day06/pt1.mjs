import { lines } from '../../common.mjs';

const fish = lines('input')[0].split(',');
const GENS = 80;
const NEW_FISH = 8;
const RESET_FISH = 6;

for (let g = 0; g < GENS; g++) {
  const len = fish.length;
  for (let i = 0; i < len; i++) {
    fish[i]--;
    if (fish[i] < 0) {
      // New fishy
      fish.push(NEW_FISH);

      // Fishy resets
      fish[i] = RESET_FISH;
    }
  }
}

console.log(fish.length);

// Correct answer: 362346
