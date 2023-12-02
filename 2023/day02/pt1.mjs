import { lines } from '../../common.mjs';

const bag = {
  red: 12,
  green: 13,
  blue: 14
};

console.log(
  lines('./input.txt')
    .map(line =>
      (matches => ({
        game: parseInt(matches[1]),
        pulls: matches[2].split(';').map(pull =>
          pull
            .trim()
            .split(',')
            .map(cube => cube.trim().split(' '))
            .reduce((o, pair) => ({ ...o, [pair[1]]: parseInt(pair[0]) }), {})
        )
      }))(/^Game (\d+): (.*)$/.exec(line))
    )
    .filter(game => game.pulls.every(pull => Object.entries(pull).every(cube => bag[cube[0]] >= cube[1])))
    .reduce((sum, game) => sum + game.game, 0)
);
