import { lines } from '../../common.mjs';

let count = 0;
const sendPulse = (pulse, id, dests) => {
  count += dests.length;

  let pulses = dests.map(dest => ({ id, dest, pulse }));
  do {
    pulses = pulses.map(p => {
      console.log(`${id} -${p.pulse ? 'high' : 'low'}-> ${p.dest}`);
      return modules[p.dest](p.pulse, id);
    });
    
  } while (pulses.length);
};

const modDefs = {
  // Broadcaster
  // b: (id, dests) => pulse => sendPulse(pulse, id, dests),
  b: (id, dests) => pulse => ({ id, dests, pulse }),
  // Flip-flop
  '%': (id, dests) => {
    let on = false;
    // return pulse => !pulse && sendPulse((on = !on), id, dests);
    return pulse => (pulse ? undefined : { id, dests, pulse: on });
  },
  // Conjunction
  '&': (id, dests) => {
    let inputs = dests.reduce((o, k) => ({ ...o, [k]: false }), {});
    return (pulse, source) => {
      inputs[source] = pulse;
      // const nextPulse = !Object.values(inputs).every(v => v);
      // sendPulse(nextPulse, id, dests);
      return { id, dests, pulse: !Object.values(inputs).every(v => v) };
    };
  }
};

const modules = lines('./sample1.txt')
  .map(line => line.split(' -> '))
  .reduce(
    (o, [k, v]) => ({
      ...o,
      [k.substring(1)]: modDefs[k[0]](k.substring(1), v.split(', '))
    }),
    {}
  );

const buttonPress = () => sendPulse(false, 'button', ['roadcaster']);
buttonPress();
console.log(Object.values(modules).map(f => f));
