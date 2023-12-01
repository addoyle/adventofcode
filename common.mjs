import { readFileSync } from 'fs';

const lines = f => readFileSync(f, 'utf8').split('\n');
const intLines = f => lines(f).map(v => parseInt(v));

export { lines, intLines };
