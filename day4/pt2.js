const { lines } = require('../common');
const common = require('../common');

const input = common.lines('input');

// First line are the draws
const draws = input.shift().split(',');

// Load boards
let boards = [];
while (input.length) {
    boards.push(input
        // Grab a chunk of 6 rows
        .splice(0, 6)
        // Remove the first (empty line)
        .slice(1)
        // Convert lines to arrays
        .map(row => row.trim().split(/\s+/).map(v => ({[v]: false})))
    );
}

let lastBingo;
let lastDraw;

// Start calling out draws and checking for bingos
for (let i in draws) {
    const draw = draws[i];
    
    // Mark boards with matches
    boards.forEach(board => board.forEach(row => row.forEach(c => {
        const k = Object.keys(c)[0];
        c[k] = c[k] || k === draw;
    })));

    // Remove winning boards
    boards = boards.filter(board => {
        if (
            // Check rows
            board.filter(r => r.every(v => Object.values(v)[0])).length || 
            // Check columns
            board.some((_, i) => board.every(r => Object.values(r[i])[0]))
        ) {
            lastBingo = board;
            lastDraw = draw;
            return false;
        }
        return true;
    });

    // No boards left, found our last winner!
    if (!boards.length) {
        break;
    }
};

const unmarkedScore = lastBingo
    // Flatten array
    .flat()
    // Get unmarked values
    .filter(v => !Object.values(v)[0])
    // Get sum
    .reduce((sum, v) => sum + +Object.keys(v)[0], 0);

console.log(unmarkedScore * lastDraw);

// Correct answer: 36975