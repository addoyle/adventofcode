import { lines } from "../../common.mjs";

console.log(
  lines("./input.txt")
    .map(line => parseInt((arr => [arr[0], arr.slice(-1)[0]])(line.split("").filter(c => !isNaN(c))).join("")))
    .reduce((sum, n) => sum + n, 0)
);
