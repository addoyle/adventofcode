import { lines } from '../../common.mjs';

const clawMachines = lines('./input.txt').reduce((machines, line, i) => {
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

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

console.log(
  clawMachines
    .map(({ a, b, prize }) => {
      const gcdX = gcd(a.x, b.x);
      const gcdY = gcd(a.y, b.y);

      const coeffsX = [a.x, b.x, prize.x];
      const coeffsY = [a.y, b.y, prize.y];

      coeffsX.forEach((c, i) => {
        coeffsX[i] = c / gcdX;
      });
      coeffsY.forEach((c, i) => {
        coeffsY[i] = c / gcdY;
      });
      const axs = [coeffsX[0] * coeffsY[1], coeffsX[2] * coeffsY[1]];
      const ays = [coeffsY[0] * coeffsX[1], coeffsY[2] * coeffsX[1]];
      const adiff = [axs[0] - ays[0], axs[1] - ays[1]];
      const aPresses = adiff[1] / adiff[0];

      const bxs = [coeffsX[1] * coeffsY[0], coeffsX[2] * coeffsY[0]];
      const bys = [coeffsY[1] * coeffsX[0], coeffsY[2] * coeffsX[0]];
      const bdiff = [bxs[0] - bys[0], bxs[1] - bys[1]];
      const bPresses = bdiff[1] / bdiff[0];

      return aPresses * 3 + bPresses;
    })
    .filter(n => Math.floor(n) === n)
    .reduce((sum, n) => sum + n)
);
