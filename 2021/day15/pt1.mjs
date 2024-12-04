import { lines } from '../../common.mjs';

const riskMap = lines('input').map(r => r.split('').map(Number));

let lowestRisk = Infinity;
const safestPath = (cur = [0, 0], path = new Set(), pathRisk = 0) => {
  // Terminate if you've already been here or if we're out of bounds
  if (
    path.has(cur.join(',')) ||
    cur[0] < 0 ||
    cur[0] > riskMap.length - 1 ||
    cur[1] < 0 ||
    cur[1] > riskMap[0].length - 1
  ) {
    return;
  }

  // Add risk, skipping [0,0]
  const risk = pathRisk + (cur[0] + cur[1] > 0 ? riskMap[cur[0]][cur[1]] : 0);

  // If risk is over lowestRisk, just give up now
  if (risk > lowestRisk) {
    return;
  }

  // If we've made it to the end, set risk score if lower
  if (cur[0] === riskMap.length - 1 && cur[1] === riskMap[0].length - 1 && risk < lowestRisk) {
    lowestRisk = risk;
    return;
  }

  // Add cur to path
  const newPath = new Set([...path, cur.join(',')]);

  // Move to neighbors
  safestPath([cur[0] + 1, cur[1]], newPath, risk);
  safestPath([cur[0] - 1, cur[1]], newPath, risk);
  safestPath([cur[0], cur[1] + 1], newPath, risk);
  safestPath([cur[0], cur[1] - 1], newPath, risk);
};

safestPath();

console.log(lowestRisk);

// Correct answer:
