import * as fs from 'fs';

const lines = f => fs.readFileSync(f, 'utf8').trim().split('\n');
const intLines = f => lines(f).map(v => parseInt(v));

export { lines, intLines };
