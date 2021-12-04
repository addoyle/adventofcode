const common = require('../common');

const input = common.lines('input');

const rates = input.reduce((rates, line) => {
    line.split('').forEach((c, i) => rates[c][i] = (rates[c][i] || 0) + 1);
    return rates;
}, {'0': [], '1': []});

const γ = parseInt(rates['0'].map((v, i) => v > rates['1'][i] ? 0 : 1).join(''), 2);
const ε = parseInt(rates['0'].map((v, i) => v < rates['1'][i] ? 0 : 1).join(''), 2);

console.log(γ * ε);

// Correct answer: 2954600