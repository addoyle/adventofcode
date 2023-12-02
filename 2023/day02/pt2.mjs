import { lines } from '../../common.mjs';

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
    .map(game => ({
      ...game,
      bag: game.pulls.reduce(
        (o, pull) => {
          Object.entries(pull).forEach(cube => (o[cube[0]] = Math.max(o[cube[0]], cube[1])));
          return o;
        },
        { red: 0, green: 0, blue: 0 }
      )
    }))
    .map(game => ({ ...game, power: game.bag.red * game.bag.blue * game.bag.green }))
    .reduce((sum, game) => sum + game.power, 0)
);
