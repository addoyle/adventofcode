const divmod = (a, b) => (a % b) + (a % b && a < 0 ? b : 0);

console.log(divmod(7, 5));
