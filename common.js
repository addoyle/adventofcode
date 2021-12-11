const fs = require('fs');

module.exports = {
    lines: f => fs.readFileSync(f, 'utf8').trim().split('\n'),
    intLines: f => module.exports.lines(f).map(v => parseInt(v))
}