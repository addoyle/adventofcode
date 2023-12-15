import { lines } from '../../common.mjs';

const mirrors = [[]];
lines('./input.txt').forEach(line => {
  const mirror = mirrors.at(-1);

  if (line === '') {
    mirrors.push([]);
  } else {
    mirror.push([...line]);
  }
});

const isSymButOne = (mirror, i) => {
  if (i === mirror.length - 1) {
    return false;
  }

  let smudgeFound = false;

  for (let up = i, dn = i + 1; up >= 0 && dn < mirror.length; up--, dn++) {
    const diffs = mirror[up].reduce((diffs, symbol, i) => diffs + (symbol === mirror[dn][i] ? 0 : 1), 0);
    if (diffs === 1 && !smudgeFound) {
      smudgeFound = true;
    } else if (diffs > 1 || (diffs === 1 && smudgeFound)) {
      return false;
    }
  }
  return smudgeFound;
};

const transpose = a => a[0].map((_, i) => a.map(r => r[i]));

let vSum = 0;
let hSum = 0;

mirrors.forEach(mirror => {
  const vMirror = transpose(mirror);
  hSum += mirror.findIndex((_, i) => isSymButOne(mirror, i)) + 1;
  vSum += vMirror.findIndex((_, i) => isSymButOne(vMirror, i)) + 1;
});

console.log(hSum * 100 + vSum);
