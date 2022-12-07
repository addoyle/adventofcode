import { lines } from '../common.mjs';

// Parse input
const fs = {};
let cmd;
let cwd;
lines('./input.txt')
  .map(line => line.split(' '))
  .forEach(line => {
    // User entered a command
    if (line[0] === '$') {
      // Store current command for follow-on lines
      cmd = line[1];

      // Change directory
      if (cmd === 'cd') {
        // Switch to root
        if (line[2] === '/') {
          cwd = fs;
        }
        // Go up one
        else if (line[2] === '..') {
          cwd = cwd['..'];
        }
        // Go to folder, if it doesn't exist, create new
        else {
          if (!cwd[line[2]]) {
            cwd[line[2]] = { '..': cwd };
          }
          cwd = cwd[line[2]];
        }
      }
    }

    // If user previously entered an ls, these lines will be files/folders. Create if new
    if (cmd === 'ls' && !cwd[line[1]]) {
      // Directory, create if new
      if (line[0] === 'dir') {
        cwd[line[1]] = { '..': cwd };
      }
      // File, starts with a file size in bytes, create if new
      else if (!isNaN(parseInt(line[0]))) {
        cwd[line[1]] = parseInt(line[0]);
      }
    }
  });

const dirSizes = [];

const calcSizes = (cwd, file) => {
  // Parent dir, skip
  if (file === '..') return 0;

  // File, return size
  if (!isNaN(cwd[file])) {
    return cwd[file];
  }

  // Dir, recurse
  cwd[file].__size__ = Object.keys(cwd[file]).reduce(
    (sum, key) => sum + calcSizes(cwd[file], key),
    0
  );
  dirSizes.push(cwd[file].__size__);
  return cwd[file].__size__;
};

// Calculate sizes
Object.keys(fs).forEach(f => calcSizes(fs, f));

const neededSize =
  30000000 -
  (70000000 - Object.values(fs).reduce((sum, i) => sum + (i.__size__ || 0), 0));

console.log(dirSizes.filter(s => s >= neededSize).sort((a, b) => a - b)[0]);

// Answer: 1111607
