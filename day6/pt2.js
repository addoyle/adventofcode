const common = require('../common');

const fish = common
  .lines('input')[0]
  .split(',')
  .map(f => +f)
  .reduce((counts, f) => {
    counts[f] = (counts[f] || 0) + 1;
    return counts;
  }, []);
const GENS = 256;
const NEW_FISH = 8;
const RESET_FISH = 6;

for (let g = 0; g < GENS; g++) {
  const zeroes = fish['0'] || 0;

  // Age the fish
  for (let i = 1; i <= NEW_FISH; i++) {
    fish[i - 1] = fish[i] || 0;
  }

  // Reset the zeroes and add babies
  fish[RESET_FISH] = (fish[RESET_FISH] || 0) + zeroes;
  fish[NEW_FISH] = zeroes;
}

console.log(Object.values(fish).reduce((sum, v) => sum + v, 0));

// Correct answer: 1639643057051
