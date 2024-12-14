const egcd = (a, b) => {
  if (!b) return [a, 1, 0];
  const [g, x, y] = egcd(b, a % b);
  return [g, y, x - Math.floor(a / b) * y];
};

const solveDiophantine = (a1, b1, a2, b2, targetX, targetY) => {
  // Solve the first equation
  const [g1, x1, y1] = egcd(a1, b1);
  if (targetX % g1 !== 0) return null;

  const scaleX = targetX / g1;
  const base_na1 = x1 * scaleX;
  const base_nb1 = y1 * scaleX;
  const step_na1 = b1 / g1;
  const step_nb1 = -a1 / g1;

  // Iterate over all possible integer values of k1
  let minWeight = Infinity;
  let bestSolution = null;

  for (let k1 = -1000; k1 <= 1000; k1++) {
    const na = base_na1 + k1 * step_na1;
    const nb1 = base_nb1 + k1 * step_nb1;

    console.log({ na, base_na1, step_na1, nb1, base_nb1, step_nb1 });

    if (na < 0 || nb1 < 0) continue; // Ensure non-negative solutions

    // Check if this pair satisfies the second equation
    const residualY = targetY - a2 * na;
    console.log({ residualY });
    if (residualY % b2 !== 0) continue; // Ensure divisibility

    const nb2 = residualY / b2;
    console.log({ nb2 });
    if (nb1 !== nb2 || nb2 < 0) continue; // Ensure compatibility and non-negativity

    // Calculate weight
    const weight = 3 * na + nb1;
    if (weight < minWeight) {
      minWeight = weight;
      bestSolution = { na, nb: nb1, weight };
    }

    console.log({ na, nb1, nb2, weight });
  }

  return bestSolution;
};

// Define increments and target
const a = { x: 94, y: 34 };
const b = { x: 22, y: 67 };
const target = { x: 8400, y: 5400 };

// Solve the system
const result = solveDiophantine(a.x, b.x, a.y, b.y, target.x, target.y);
console.log('Result:', result); // Expected { na: 80, nb: 40, weight: 280 }
