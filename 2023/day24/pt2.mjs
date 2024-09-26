import { lines } from '../../common.mjs';
import { eigs } from 'mathjs';

// const bounds = [200000000000000, 400000000000000];
const bounds = [7, 27];

const vectors = lines('./sample.txt')
  .map(line => line.split(' @ ').map(p => p.split(', ').map(n => parseInt(n))))
  .map(([p, v]) => ({ p, v }));

// Get average starting point
const avg = vectors[0].p.reduce(
  (o, _, i) => [
    ...o,
    vectors.reduce((sum, v) => sum + v.p[i], 0) / vectors.length
  ],
  []
);

// Covariance matrix
const covMatrix = vectors.reduce(
  (m, v) => {
    const d = avg.map((a, i) => v.p[i] - a);

    v.p.forEach((_, i) =>
      v.p.forEach((_, j) => {
        m[i][j] ??= 0;
        m[i][j] += d[i] * d[j];
      })
    );

    return m;
  },
  [[], [], []]
);

// Normalize
covMatrix.forEach((r, i) =>
  r.forEach((_, j) => {
    covMatrix[i][j] /= vectors.length;
  })
);

const { values: eigenvalues, eigenvectors } = eigs(covMatrix);
const maxEigenvalue = Math.max(...eigenvalues);

const maxIndex = eigenvalues.findIndex(val => val === maxEigenvalue);

// Direction vector is the eigenvector corresponding to the largest eigenvalue
const direction = eigenvectors.map(ev => ev.vector[maxIndex]);

console.log(direction);
