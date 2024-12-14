import { lines } from '../../common.mjs';

const clawMachines = lines('./sample.txt').reduce((machines, line, i) => {
  if (i % 4 === 0) {
    machines.push({});
  }
  if (line) {
    const machine = machines.at(-1);
    const [button, x, y] = [.../^(?:Button )?(\w+): X[=+](\d+), Y[=+](\d+)$/.exec(line)].slice(1);
    machine[button.toLowerCase()] = { x: parseInt(x), y: parseInt(y) };
  }
  return machines;
}, []);

// const egcd = (a, b) => {
//   if (!b) {
//     return [a, 1, 0];
//   }
//   const [g, x, y] = egcd(b, a % b);
//   return [g, y, x - Math.floor(a / b) * y];
// };

// const minWeight = (a, b, prize) => {
//   const [g, x, y] = egcd(a, b);
//   // No solution
//   if (prize % g !== 0) {
//     return null;
//   }
//   return {
//     x: x * Math.floor(prize / g),
//     y: y * Math.floor(prize / g),
//     g
//   };
// };

// // console.log(
// //   [clawMachines[0]].map(({ a, b, prize }) => {
const a = { x: 94, y: 34 };
const b = { x: 22, y: 67 };
const target = { x: 8400, y: 5400 };
// const [cfx, cfy] = [minWeight(a.x, b.x, target.x), minWeight(a.y, b.y, target.y)];
// const [xf, yf] = [b.x / cfx.g, b.y / cfy.g];

// let min = Infinity;
// let best = {};
// for (let k = 0; k < 100; k++) {
//   const n = {
//     a: cfx.x + k * xf,
//     b: cfy.x + k * yf
//   };

//   if (n.a >= 0 && n.b >= 0) {
//     const weight = 3 * n.a + n.b;
//     if (weight < min) {
//       min = weight;
//       best = n;
//     }
//   }
// }
// console.log(best, min);

const egcd = (a, b) => {
  if (!b) return [a, 1, 0];
  const [g, x, y] = egcd(b, a % b);
  return [g, y, x - Math.floor(a / b) * y];
};

const solveDiophantine = (a1, b1, a2, b2, targetX, targetY) => {
  // Solve the first equation: a1 * n_a + b1 * n_b = targetX
  const [g1, x1, y1] = egcd(a1, b1);
  if (targetX % g1 !== 0) return null;

  const scaleX = targetX / g1;
  const base_na1 = x1 * scaleX;
  const base_nb1 = y1 * scaleX;
  const step_na1 = b1 / g1;
  const step_nb1 = -a1 / g1;

  // Solve the second equation: a2 * n_a + b2 * n_b = targetY
  const [g2, x2, y2] = egcd(a2, b2);
  if (targetY % g2 !== 0) return null;

  const scaleY = targetY / g2;
  const base_na2 = x2 * scaleY;
  const base_nb2 = y2 * scaleY;
  const step_na2 = b2 / g2;
  const step_nb2 = -a2 / g2;

  // Iterate over k values for the first equation
  let minWeight = Infinity;
  let bestSolution = null;

  for (let k1 = -100; k1 <= 100; k1++) {
    const na = base_na1 + k1 * step_na1;
    const nb1 = base_nb1 + k1 * step_nb1;

    // Verify if this na, nb1 pair satisfies the second equation
    const residualY = targetY - a2 * na;
    if (residualY % b2 !== 0) continue;

    const nb2 = residualY / b2;

    // Ensure nb1 matches nb2 and is non-negative
    if (nb1 === nb2 && nb1 >= 0) {
      const weight = 3 * na + nb1;
      if (weight < minWeight) {
        minWeight = weight;
        bestSolution = { na, nb: nb1, weight };
      }
    }
  }

  return bestSolution;
};

const result = solveDiophantine(a.x, b.x, a.y, b.y, target.x, target.y);
console.log(result);
// return { ...best, min };
//   })
// );

debugger;

// for k in range(-100, 100):  # Adjust range based on practical need
//     na = coeff_x1 + k * x_factor
//     nb = coeff_yx1 + k * y_factor

//     if na >= 0 and nb >= 0:
//         weight = weight_a * na + weight_b * nb
//         if weight < min_weight:
//             min_weight = weight
//             best_na, best_nb = na, nb

// return best_na, best_nb, min_weight
