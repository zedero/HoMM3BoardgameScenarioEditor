/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const generatedTowns = generate(data);
  postMessage(generatedTowns);
});


const generate = function (data) {
  const k = data.k;
  const walkable = data.walkable;
  const tileList = data.tileList;

  console.time('Time Spend W')

  const indexes = [...Array(tileList.length).keys() ];
  const pairs = choose(indexes, k);

  let fastSearch = false;
  if(pairs.length > 5000) {
    fastSearch = true;
  }

  const listOfDistancesOfPairs = pairs.map((indexSet, index) => {
    const pairOptions = choose(indexSet, 2);
    // total, lowest
    const totalDist = pairOptions.reduce((acc, set) => {
      let setDist;
      if(fastSearch) {
        // Fast but not best placement
        // setDist = this.distance(tileList[set[0]].row, tileList[set[1]].row, tileList[set[0]].col, tileList[set[1]].col);
        setDist = walkDistance(tileList[set[0]].row, tileList[set[1]].row, tileList[set[0]].col, tileList[set[1]].col, walkable);
      } else {
        // SLOW but better
        setDist = walkDistance(tileList[set[0]].row, tileList[set[1]].row, tileList[set[0]].col, tileList[set[1]].col, walkable);
      }

      acc.total += setDist;
      if (acc.minimumDistance === -1 || acc.minimumDistance > setDist) {
        acc.minimumDistance = setDist;
      }
      return acc;
    }, {
      total: 0,
      minimumDistance: -1,
      set: []
    });
    totalDist.set = indexSet;
    return totalDist;
  });

  // get highest minimumDistance
  const highestMinimumDistance = listOfDistancesOfPairs.reduce((acc, curr) => {
    if (curr.minimumDistance > acc) {
      return curr.minimumDistance;
    }
    return acc;
  }, 0);

  const pairsWithHighestMinimumDistance = listOfDistancesOfPairs.filter((set) => set.minimumDistance === highestMinimumDistance);
  pairsWithHighestMinimumDistance.sort((a,b) => {
    return b.total - a.total;
  });


  console.timeEnd('Time Spend W')


  return  pairsWithHighestMinimumDistance[0].set.map((index) => {
    return tileList[index]
  });
}

const walkDistance = function (x1, x2, y1, y2, cellMap) {
  const walkable = cellMap;
  const start = x1 + '.' + y1;
  const end = x2 + '.' + y2;

  const frontier: any = [];
  frontier.push(start);
  const reached = new Map();
  reached.set(start, '');

  let steps = 0;
  while (frontier.length > 0) {
    steps++;
    const current = frontier.shift();
    const pos = current.split('.').map((a) => {
      return Number(a)
    });
    const row = pos[0];
    const col = pos[1];
    getCellNeighbours(row, col).forEach((next) => {
      if (!reached.has(next) && walkable.has(next)) {
        frontier.push(next);
        reached.set(next, current);
      }
    });
    if (current === end) {
      break;
    }
  }
  const getSteps = function(start, end, cameFrom) {
    let current = end;
    const path: any[] = [];
    while (current !== start) {
      path.push(current);
      current = cameFrom.get(current)
    }
    return path.length;
  }
  return getSteps(start, end, reached);
}

const getCellNeighbours = function (row,col) {
  const oddr_direction_differences = [
    // even rows
    [[ 0, -1], [+1,  0], [ 0, +1],
      [-1, +1], [-1,  0], [-1, -1]],
    // odd rows
    [[+1, -1], [+1,  0], [+1, +1],
      [ 0, +1], [-1,  0], [ 0, -1]],
  ];

  const parity = row & 1;
  const neighbours: any = [];
  oddr_direction_differences[parity].forEach((nb, index) => {
    const diff = oddr_direction_differences[parity][index]
    neighbours.push((row + diff[1]) + "." + (col + diff[0]))
  });
  return neighbours;
}

const distance = function(x1, x2, y1, y2) {
  // calculate offset to cube
  var q = y1 - (x1 - (x1&1)) / 2;
  var r = x1;
  const s = -q-r;

  var q2 = y2 - (x2 - (x2&1)) / 2;
  var r2 = x2;
  const s2 = -q2-r2;

  // cube coordinates to distance
  return (Math.abs(q - q2) + Math.abs(r - r2) + Math.abs(s - s2)) / 2;
}

const choose = function(arr, k, prefix: any=[]) {
  if (k == 0) return [prefix];
  return arr.flatMap((v, i) =>
    choose(arr.slice(i+1), k-1, [...prefix, v])
  );
}
