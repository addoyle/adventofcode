import { readFileSync } from 'fs';

const lines = f => readFileSync(f, 'utf8').split('\n');
const intLines = f => lines(f).map(v => parseInt(v));

export { lines, intLines };

export class ArraySet {
  #map;

  constructor(values) {
    this.#map = new Map();
    for (const value of values) {
      this.add(value);
    }
  }

  add(value) {
    this.#map.set(JSON.stringify(value), value);
    return this;
  }

  clear() {
    this.#map.clear();
  }

  delete(value) {
    const k = JSON.stringify(value);

    if (this.#map.has(k)) {
      this.#map.delete(k);
      return true;
    }
    return false;
  }

  forEach(callbackFn) {
    this.#map.values.forEach(callbackFn);
  }

  has(value) {
    return this.#map.has(JSON.stringify(value));
  }

  get size() {
    return this.#map.size;
  }

  [Symbol.iterator]() {
    return this.#map.values();
  }

  toString() {
    return `StackSet(${this.size}) {${[`size: ${this.size}`, ...this.#map.keys()].join(', ')}}`;
  }
}

export class StackSet extends Set {
  #stack;

  constructor(values) {
    super();
    values?.forEach(v => super.add(v));
    this.#stack = [...this];
  }

  add(value) {
    const len = this.size;
    const res = super.add(value);
    if (this.size > len) {
      this.#stack.push(value);
    }
    return res;
  }

  delete(value) {
    this.#stack = this.#stack.filter(v => v !== value);
    return super.delete(value);
  }

  get top() {
    return this.#stack[this.#stack.length - 1];
  }

  clear() {
    super.clear();
    this.#stack = [];
  }

  push(value) {
    return this.add(value);
  }

  pop() {
    const val = this.#stack.pop();
    this.delete(val);
    return val;
  }
}
