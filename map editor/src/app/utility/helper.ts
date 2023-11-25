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
}


