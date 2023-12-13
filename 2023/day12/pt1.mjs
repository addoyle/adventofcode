import { lines } from '../../common.mjs';

const springs = lines('./sample.txt')
  .map(line => line.split(' '))
  .map(spring => ({
    // record: spring[0].match(/(#+)|(\?+)|(\.+)/g),
    record: spring[0],
    groups: spring[1].split(',').map(n => parseInt(n)),
    perms: 0,
    tempPerms: []
  }));

const buildPerm = (spring, perm = '', r = 0, g = 0) => {
  if (r >= spring.record.length) {
    // is valid?
    if (!perm.includes('?') && g >= spring.groups.length) {
      spring.perms++;
      spring.tempPerms.push(perm);
    }
    return;
  }

  const grp = spring.groups[g];
  const rec = spring.record.substring(r, r + grp);

  // operational, keep going
  if (rec[0] === '.') {
    return buildPerm(spring, perm + '.', r + 1, g);
  }

  // got a broken size that fits our group
  if (rec === '#'.repeat(grp)) {
    // but it's too big, invalid
    if (spring.record.substring(r).match(/^#+/)[0].length > grp) {
      return;
    }

    // If next char is a ?, mark as operational
    const next = spring.record.charAt(r + grp) === '?';

    // got our first match, keep going
    return buildPerm(spring, perm + rec + (next ? '.' : ''), r + grp + (next ? 1 : 0), g + 1);
  }

  const block = spring.record.substring(r).match(/^[?#]+/)[0];

  // block starts with # and won't get too big
  if (block[0] === '#' && block[grp] !== '#') {
    return buildPerm(spring, perm + '#'.repeat(grp) + '.', r + grp + 1, g + 1);
  }

  // block ends with a #, check if there's more #'s after it
  if (block[grp - 1] === '#') {
    const firstBrkn = block.indexOf('#');
    const fromBrkn = block.substring(firstBrkn).match(/^#+/)[0];
    // make sure it's not too big
    if (fromBrkn.length <= grp) {
      // same size, mark as broken and continue
      if (fromBrkn.length === grp) {
        buildPerm(spring, perm + '.'.repeat(grp - firstBrkn) + fromBrkn + '.', r + grp + firstBrkn + 2, g + 1);
      }
      // smaller, add possibilities to stack
      else {
        for (let i = r; i < Math.min(block.length - grp, grp - firstBrkn) - 1; i++) {
          buildPerm(spring, perm + '.'.repeat(i) + '#'.repeat(grp) + '.', r + grp + i + 1, g + 1);
        }
      }
    }
    return;
  }

  // Some combination of ?'s and #'s left in block
  for (let i = r; i < block.length - grp; i++) {
    buildPerm(spring, perm + '.'.repeat(i) + '#'.repeat(grp) + '.', r + grp + i + 1, g + 1);
  }
};

springs.forEach(spring => buildPerm(spring));

debugger;
