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
          console.log(distance, tile)
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

  distance(x1, x2, y1, y2) {
    const ax = x1 - this.floor2(y1);
    const ay = x1 + this.ceil2(y1);
    const bx = x2 - this.floor2(y2);
    const by = x2 + this.ceil2(y2)
    const dx = bx - ax;
    const dy = by - ay;
    if (Math.sign(dx) == Math.sign(dy)) {
      return Math.max(Math.abs(dx), Math.abs(dy));
    }
    return Math.abs(dx) + Math.abs(dy);

    // const a = x1 - x2;
    // const b = y1 - y2;
    // return Math.sqrt( a*a + b*b );
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
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

  HexDistance(p1X, p1Y,p2X, p2Y) {
    const ax = p1X - this.floor2(p1Y);
    const ay = p1X + this.ceil2(p1Y);
    const bx = p2X - this.floor2(p2Y);
    const by = p2X + this.ceil2(p2Y)
    const dx = bx - ax;
    const dy = by - ay;
    if (Math.sign(dx) == Math.sign(dy)) {
      return Math.max(Math.abs(dx), Math.abs(dy));
    }
    return Math.abs(dx) + Math.abs(dy);
  }

  private floor2(x: number) {
    return ((x >= 0) ? (x >> 1) : (x - 1) / 2);
  }
  private ceil2(x: number) {
    return ((x >= 0) ? ((x + 1) >> 1) : x / 2);
  }
}


