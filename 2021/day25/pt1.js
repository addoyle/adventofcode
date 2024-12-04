const input = `v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>`;

const seafloor = input
  .split("\n")
  .map(r => r.split("").map(c => c === "." ? "" : c));

const nextgen = seafloor => {
  const newgen = [...seafloor.map(r => [...r])];
  // Horizontal guys
  for (let i = 0; i < seafloor.length; i++) {
    for (let j = 0; j < seafloor[i].length; j++) {
      const dest = j <= seafloor[i].length - 1 ? j + 1 : 0;
      if (seafloor[i][j] === ">" && !seafloor[i][dest]) {
        newgen[i][j] = "";
        newgen[i][dest] = ">";
      }
    }
  }

  // Vertical guys
  for (let j = 0; j < seafloor[0].length; j++) {
    for (let i = 0; i < seafloor.length; i++) {
      // console.log({i,j})
      // console.log(seafloor[i]);
      // console.log(seafloor[i][j]);
      const dest = i <= seafloor.length - 1 ? i + 1 : 0;
      // console.log(dest)
      // console.log(seafloor[dest][j])
      if (seafloor[i][j] === "v" && !seafloor[dest][j]) {
        newgen[i][j] = "";
        newgen[dest][j] = "v";
      }
    }
  }

  return newgen;
};

console.log(seafloor);
console.log(nextgen(seafloor));
