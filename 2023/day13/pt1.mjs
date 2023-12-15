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

const isSym = (mirror, i) => {
  if (i === mirror.length - 1) {
    return false;
  }

  for (let up = i, dn = i + 1; up >= 0 && dn < mirror.length; up--, dn++) {
    if (mirror[up].join('') !== mirror[dn].join('')) {
      return false;
    }
  }
  return true;
};

const transpose = a => a[0].map((_, i) => a.map(r => r[i]));

let vSum = 0;
let hSum = 0;

mirrors.forEach(mirror => {
  const vMirror = transpose(mirror);
  hSum += mirror.findIndex((_, i) => isSym(mirror, i)) + 1;
  vSum += vMirror.findIndex((_, i) => isSym(vMirror, i)) + 1;
});

console.log(hSum * 100 + vSum);
