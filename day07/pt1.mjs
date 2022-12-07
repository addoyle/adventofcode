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

let smallDirTotal = 0;

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

  // Add to small dir total
  if (cwd[file].__size__ <= 100000) {
    smallDirTotal += cwd[file].__size__;
  }

  return cwd[file].__size__;
};

// Calculate sizes
Object.keys(fs).forEach(f => calcSizes(fs, f));

console.log(smallDirTotal);

// Answer: 1989474
