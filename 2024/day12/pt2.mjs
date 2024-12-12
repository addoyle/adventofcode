import { lines } from '../../common.mjs';

let gen = lines('./sample.txt')[0].split(' ');
const memo = {};

const fiveGens = rock => {
  memo[rock] ??= rock
    .split(',')
    .map(rk => {
      if (memo[rk]) {
        return memo[rk];
      }

      let gen = [rk];

      for (let i = 0; i < 5; i++) {
        gen = gen.reduce((rocks, rock) => {
          if (rock === '0') {
            rocks.push('1');
          } else if (rock.length % 2 === 0) {
            rocks.push(
              ...[rock.slice(0, rock.length / 2), rock.slice(rock.length / 2)].map(n => n.replace(/^0+/, '') || '0')
            );
          } else {
            rocks.push(`${parseInt(rock) * 2024}`);
          }

          return rocks;
        }, []);
      }

      memo[rk] = gen;
      return gen;
    })
    .map(r => r.join(','));

  return memo[rock];
};

for (let i = 0; i < 75 / 5; i++) {
  gen = gen.reduce((rocks, rock) => {
    // if (rock === '0') {
    //   rocks.push('1');
    // } else if (rock.length % 2 === 0) {
    //   rocks.push(
    //     ...[rock.slice(0, rock.length / 2), rock.slice(rock.length / 2)].map(n => n.replace(/^0+/, '') || '0')
    //   );
    // } else {
    //   memo[rock] ??= `${parseInt(rock) * 2024}`;
    //   rocks.push(memo[rock]);
    // }
    rocks.push(fiveGens(rock).join(','));

    return rocks;
  }, []);
}
console.log(gen.length);
