import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class Helper {
  constructor() {}

  getNeighbours(tiles, towns) {
    const neighbours: any[] = [];
    towns.forEach((town) => {
      tiles.forEach((tile) => {
        if (town.id !== tile.id) {
          const distance = this.distance(town.row, tile.row, town.col, tile.col);
          // console.log(distance, tile)
          if (distance <= 3) {
            neighbours.push(tile);
          }
        }
      })
    })
    return neighbours;
  }

  removeFromArray(tiles, removeTheseItems) {
    const newList:any[] = [];
    tiles.forEach((item) => {
      const found = removeTheseItems.find((remove) => {
        return item.id === remove.id;
      });
      if (!found) {
        newList.push(item);
      }
    });

    return newList;
  }

  oddRToCube(row, col) {
    const q = col - (row - (row&1)) / 2;
    const r = row;
    const s = -q-r;
    return {
      q,r,s
    }
  }

  cubeToOddR(q,r) {
    const col = q + (r - (r&1)) / 2
    var row = r
    return {
      row, col
    }
  }

  getCellNeighbours(row,col) {
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

  getCellPlusNeighbours(row,col) {
    const neighbours: any = this.getCellNeighbours(row, col);
    neighbours.push(row + "." + col);
    return neighbours;
  }

  distance(x1, x2, y1, y2) {
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

  getFurthestTwoPoints(tileList: any) {
    let furthest:any = {
      distance: 0,
      tileOne: {},
      tileTwo: {}
    };
    tileList.forEach((tile) => {
      tileList.forEach((otherTile) => {
        if (tile.id === otherTile.id) {
          return;
        }

        const dist = this.distance(tile.row, otherTile.row, tile.col, otherTile.col);
        if (dist > furthest.distance) {
          furthest = {
            distance: dist,
            tileOne: tile,
            tileTwo: otherTile,
          }
        }
      });
    });
    return furthest;
  }

  midPoint(x1,y1,x2,y2) {
    return [(x1 + x2) / 2, (y1 + y2) / 2]
  }

  getFurthestFromPoint([x, y]:number[], tileList: any) {
    let result: any = {};
    let distance = 0;
    tileList.forEach((tile) => {
      const dist = this.distance(x, tile.row, y, tile.col);
      if (dist > distance) {
        result = tile;
        distance = dist;
      }
    })
    return result;
  }

  getFurthestFromTwoPoint(x1, y1, x2, y2, tileList: any) {
    let result: any = {};
    let distance = 0;
    tileList.forEach((tile) => {
      const dist = this.distance(x1, tile.row, y2, tile.col) + this.distance(x2, tile.row, y2, tile.col);
      if (dist > distance) {
        result = tile;
        distance = dist;
      }
    })
    return result;
  }

  getKFurthestPoints(k: number, tileList: any) { console.time('Time Spend')
    const choose = function(arr, k, prefix: any=[]) {
      if (k == 0) return [prefix];
      return arr.flatMap((v, i) =>
        choose(arr.slice(i+1), k-1, [...prefix, v])
      );
    }
    const indexes = [ ...Array(tileList.length).keys() ];
    const pairs = choose(indexes, k);

    const listOfDistancesOfPairs = pairs.map((indexSet) => {
      const pairOptions = choose(indexSet, 2);
      // total, lowest
      const totalDist = pairOptions.reduce((acc, set) => {
        const setDist = this.distance(tileList[set[0]].row, tileList[set[1]].row, tileList[set[0]].col, tileList[set[1]].col);
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


    console.timeEnd('Time Spend')

    // -------------------------------------
    // TEST WALK DISTANCE
    // -------------------------------------
    const start = tileList[pairsWithHighestMinimumDistance[0].set[0]]
    const end = tileList[pairsWithHighestMinimumDistance[0].set[1]]
    console.log(start,end)
    this.walkDistance(start.row, end.row, start.col, end.col, tileList);
    // -------------------------------------

    return  pairsWithHighestMinimumDistance[0].set.map((index) => {
      return tileList[index]
    });
  }

  walkDistance(x1, x2, y1, y2, cellMap) {
    const walkable = this.generateWalkableCellsList(cellMap)
    const start = x1 + '.' + y1;
    const end = x2 + '.' + y2;

    console.log(start)

    const frontier: any = [];
    frontier.push(start);
    const reached = new Set();
    reached.add(start);
    const cameFrom = new Map();
    cameFrom.set(start, '')

    let steps = 0;
    while (frontier.length > 0) {
      steps++;
      const current = frontier.shift();
      // if (current === end) {
      //   console.log(reached, steps)
      // }
      const pos = current.split('.').map((a)=>{return Number(a)});
      const row = pos[0];
      const col = pos[1];
      this.getCellNeighbours(row,col).forEach((next) => {
        if(!reached.has(next) && walkable.has(next)) {
          frontier.push(next);
          reached.add(next);
        }
      });
    }

    console.log(cameFrom)

    return 0;
  }

  generateWalkableCellsList(tileList) {
    const walkableCells = new Set();
    tileList.forEach((tile) => {
      const cells = this.getCellNeighbours(tile.row,tile.col);
      walkableCells.add(tile.row + '.' + tile.col);
      cells.forEach((cell, index) => {
        walkableCells.add(cell);
      });
    });
    return walkableCells;
  }
}


