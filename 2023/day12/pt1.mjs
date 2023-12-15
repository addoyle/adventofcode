import { lines } from '../../common.mjs';

const springs = lines('./input.txt')
  .map(line => line.split(' '))
  .map(spring => ({
    record: spring[0],
    groups: spring[1].split(',').map(n => parseInt(n)),
    perms: 0,
    tempPerms: []
  }));

const buildPerm = (spring, perm = '', r = 0, g = 0) => {
  if (r >= spring.record.length) {
    // is valid?
    if (
      !perm.includes('?') &&
      g >= spring.groups.length &&
      perm.length === spring.record.length &&
      [...spring.record].every((c, i) => c !== '#' || c === perm[i])
    ) {
      spring.perms++;
      spring.tempPerms.push(perm);
    }
    return;
  }

  // operational, keep going
  if (spring.record[r] === '.') {
    return buildPerm(spring, perm + '.', r + 1, g);
  }

  const grp = spring.groups[g];
  const rec = spring.record.substring(r, r + grp);

  // got a broken size that fits our group
  if (rec === '#'.repeat(grp)) {
    // but it's too big, invalid
    if (spring.record.substring(r).match(/^#+/)[0].length > grp) {
      return;
    }

    const atEnd = r + grp >= spring.record.length;
    return buildPerm(spring, perm + rec + (atEnd ? '' : '.'), r + grp + (atEnd ? 0 : 1), g + 1);
  }

  const block = spring.record.substring(r).match(/^[?#]+/)[0];

  // block size matches group
  if (block.length === grp) {
    // Try with and without
    buildPerm(spring, perm + '#'.repeat(grp), r + grp, g + 1);
    buildPerm(spring, perm + '.'.repeat(grp), r + grp, g);
    return;
  }

  // no groups left
  if (g >= spring.groups.length) {
    // all ?'s left, successful perm
    if ([...block].every(c => c === '?')) {
      return buildPerm(spring, perm + '.'.repeat(block.length), r + block.length, g);
    }
    // #'s left, invalid
    else {
      return;
    }
  }

  // block is too small
  if (grp > block.length) {
    // all ?'s, replace with .'s
    if ([...block].every(c => c === '?')) {
      return buildPerm(spring, perm + '.'.repeat(block.length), r + block.length, g);
    }
    // contains a #, invalid
    else {
      return;
    }
  }

  // Some combination of ?'s and #'s left in block
  for (let i = 0; i <= block.length - grp; i++) {
    const atEnd = r + grp + i >= spring.record.length;
    if (block[i + grp] !== '#' && block[i - 1] !== '#') {
      buildPerm(
        spring,
        perm + '.'.repeat(i) + '#'.repeat(grp) + (atEnd ? '' : '.'),
        r + grp + i + (atEnd ? 0 : 1),
        g + 1
      );
    }
  }

  // Lastly, try skipping the block entirely, if all ?'s
  if ([...block].every(c => c === '?')) {
    buildPerm(spring, perm + '.'.repeat(block.length), r + block.length, g);
  }
};

springs.forEach(spring => buildPerm(spring));
console.log(springs.reduce((sum, spring) => sum + spring.perms, 0));
debugger;
