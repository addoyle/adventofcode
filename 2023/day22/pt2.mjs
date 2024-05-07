import { lines } from '../../common.mjs';

const bricks = lines('./input.txt')
  .map((line, i) =>
    ((a, b) => ({
      a,
      b,
      name: `b${i}`,
      supporters: [],
      supporting: []
    }))(
      ...line
        .split('~')
        .map(c =>
          ((x, y, z) => ({ x, y, z }))(...c.split(',').map(n => parseInt(n)))
        )
        .toSorted((a, b) => a.z - b.z)
    )
  )
  .reduce((o, b) => ({ ...o, [b.name]: b }), {});

const overlaps = (a, b) =>
  ((a.a.x <= b.a.x && a.b.x >= b.a.x) ||
    (a.a.x <= b.b.x && a.b.x >= b.b.x) ||
    (a.a.x >= b.a.x && a.b.x <= b.b.x)) &&
  ((a.a.y <= b.a.y && a.b.y >= b.a.y) ||
    (a.a.y <= b.b.y && a.b.y >= b.b.y) ||
    (a.a.y >= b.a.y && a.b.y <= b.b.y));

const fallenBricks = [];

Object.values(bricks)
  .toSorted((a, b) => a.a.z - b.a.z)
  .forEach(brick =>
    fallenBricks.unshift(
      (unders =>
        (supporters => {
          const droppedBrick = (z => ({
            ...brick,
            a: { ...brick.a, z: z + 1 },
            b: { ...brick.b, z: brick.b.z - brick.a.z + z + 1 }
          }))(supporters?.length ? supporters[0].b.z : 0);
          // add brick to supporters
          supporters?.forEach(s => s.supporting.push(droppedBrick));
          // add supporters to brick
          droppedBrick.supporters.push(...supporters);
          // drop brick and return
          return droppedBrick;
        })(unders.filter(u => u.b.z === unders[0].b.z)))(
        fallenBricks
          .filter(fb => overlaps(brick, fb))
          .toSorted((a, b) => b.b.z - a.b.z)
      )
    )
  );

const bricksThatFall = (falling, total = 0, dead = new Set(falling)) =>
  (dbSet =>
    (nextFalling =>
      nextFalling.size
        ? bricksThatFall(
            [...nextFalling].map(n => bricks[n]),
            total + nextFalling.size,
            new Set([...dead, ...nextFalling])
          )
        : total)(
      new Set(
        falling
          .map(b =>
            b.supporting
              .filter(s =>
                s.supporters.every(
                  sup => dbSet.has(sup.name) || dead.has(sup.name)
                )
              )
              .map(s => s.name)
          )
          .flat()
      )
    ))(new Set(falling.map(db => db.name)));

console.log(fallenBricks.reduce((sum, fb) => sum + bricksThatFall([fb]), 0));
