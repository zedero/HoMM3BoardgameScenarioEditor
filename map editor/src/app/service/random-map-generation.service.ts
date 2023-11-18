import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { TilesService } from './tiles.service';
import { Helper } from '../utility/helper';

export type RandomMapSettings = {
  size: string,
  playerCount?: number;
  selectedTowns?: Array<string>;
  flipFarTiles?: boolean;
  flipNearTiles?: boolean;
  flipCenterTiles?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RandomMapGenerationService {

  public connected = new Set();

  constructor(public tilesService: TilesService, private config: ConfigService, private calc: Helper) {
    this.getConnectedTiles();
  }

  getGridSizeFromSetting(size: string) {
    console.log('MAP SIZE: ', size);
    if(size === "SMALL") {
      return {
        rows: 7,
        cols: 7,
        tiles: 7
      }
    }
    if(size === "MEDIUM") {
      return {
        rows: 10,
        cols: 10,
        tiles: 10
      }
    }
    if(size === "LARGE") {
      return {
        rows: 15,
        cols: 15,
        tiles: 15
      }
    }
    return {
      rows: 10,
      cols: 10,
      tiles: 10
    };
  }

  generateRandomMap(settings: RandomMapSettings) {
    // TODO Get rows and cols based on defined map size
    this.clearGrid();
    const sizeData = this.getGridSizeFromSetting(settings.size);
    this.generateConnectedRandomMap(sizeData.rows, sizeData.cols, sizeData.tiles);
    // alternative that is based on predefined layouts: generatePredefinedRandomMap();
    this.placeStartingTownsPass(settings.playerCount);
    this.connectToStartingTilePass();
    this.flipTilesToFront();
  }

  private generateConnectedRandomMap(maxRows , maxCols, maxTiles) {
    this.placeRandomTile(maxRows , maxCols);
    this.getConnectedTiles(maxRows , maxCols);
    let tilesPlaced = 1;
    while(this.connected.size && tilesPlaced < maxTiles) {
      tilesPlaced++;
      this.placeTileById(
        [...this.connected][Math.floor(Math.random()*this.connected.size)],
        maxRows,
        maxCols
      );
    }
    console.log('TILES PLACED: ', tilesPlaced)
  }

  private distance(x1, y1, x2, y2) {
    const a = x1 - x2;
    const b = y1 - y2;
    return Math.sqrt( a*a + b*b );
  }

  // calculate a tiles total distance to all other tiles (lower is more central)
  calculateReachability(tiles: any) {
    tiles.forEach((tile) => {
      tile.reachability = 0;
      tiles.forEach((tileCompared) => {
        const dist = this.distance(tile.row, tileCompared.row, tile.col, tileCompared.col)
        if (dist > tile.reachability) {
          tile.reachability = dist;
        }
        // tile.reachability += this.distance(tile.row, tileCompared.row, tile.col, tileCompared.col)
      });
    });
    return tiles;
  }

  placeStartingTownsPass(playerCount = 2) {
    const tiles:any = [...this.tilesService.tileList];
    const furthestPoints = this.calc.getFurthestTwoPoints(tiles);
    const possibleTownTiles: any = [];
    possibleTownTiles.push(furthestPoints.tileOne);
    if (playerCount > 1) {
      possibleTownTiles.push(furthestPoints.tileTwo);
    }

    const neighbourTiles = this.calc.getNeighbours(tiles, possibleTownTiles);

    // const mid = this.calc.midPoint(furthestPoints.tileOne.row, furthestPoints.tileOne.col, furthestPoints.tileTwo.row, furthestPoints.tileTwo.col);
    const tilesCleaned = this.calc.removeFromArray(tiles, [...possibleTownTiles,...neighbourTiles]);
    const three = this.calc.getFurthestFromTwoPoint(
      possibleTownTiles[0].row,
      possibleTownTiles[0].col,
      possibleTownTiles[1].row,
      possibleTownTiles[1].col,
      tilesCleaned
    );
    // const three = this.calc.getFurthestFromPoint(mid, tilesCleaned);
    possibleTownTiles.push(three);

    // calc center of 2 furthest points
    // get tile furthest from that point










    for (let i = 0; i < playerCount && i < possibleTownTiles.length; i++) {
      possibleTownTiles[i].tileId = 'S0'
      this.tilesService.updateTileData(possibleTownTiles[i]);
    }
    // possibleTownTiles[playerCount].tileId = 'C1'
    // this.tilesService.updateTileData(possibleTownTiles[playerCount]);



    return;
    if (playerCount === 1) {
      const tile = tiles[Math.floor(Math.random()*tiles.length)];
      tile.tileId = 'S1'
      this.tilesService.updateTileData(tile);
    }

    if (playerCount === 2) {
      // Sort tiles based on their flat distance.
      tiles.sort((a,b) => {
        return b.reachability - a.reachability;
      });

      console.log(tiles.map(tile => tile.reachability))

      const possibleTownTiles = tiles.slice(0, 3);

      tiles[0].tileId = 'S0'
      this.tilesService.updateTileData(tiles[0]);
      tiles[tiles.length-1].tileId = 'S0'
      this.tilesService.updateTileData(tiles[tiles.length-1]);
    }
    if (playerCount === 3) {
      // TODO create algorithm
    }
    if (playerCount === 4) {
      // TODO create algorithm
    }
  }

  private connectToStartingTilePass() {
    const tiles = [...this.tilesService.tileList];
    tiles.sort((a,b) => {
      return (a.row + a.col) - (b.row + b.col);
    });
    // TODO create algorithm
    const towns = tiles.filter((tile) => {
      if (this.config.getGroupById(tile.tileId) === this.config.GROUP.STARTINGTILE || tile.tileId === "S0") {
        return tile;
      }
    });
  }

  private flipTilesToFront() {
    // Flip towns:
    const towns = ['#S1', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
    this.tilesService.tileList.map((tile) => {
      if (tile.tileId === "S0") {
        const pick = towns.splice(this.random(0,towns.length-1), 1);
        tile.tileId = pick;
      }
    });

    // Flip others:
  }

  private placeTileById(id: any, maxRows:number, maxCols:number) {
    const pos = id.split('.').map((a)=>{return Number(a)});
    const row = pos[0];
    const col = pos[1];
    this.tilesService.registerNewTile({
      row: row,
      col: col,
      id: this.generateGuid(),
      tileId: "C0",
      cubes: [0,0,0,0,0,0,0],
      hero: [0,0,0,0,0,0,0],
      rotation: 0,
    });
    this.getConnectedTiles(maxRows, maxCols);
  }

  private getConnectedTiles(maxRows = 100 , maxCols = 100) {
    this.connected = new Set();
    const addConnectedWithinBounds = (row, col, increasedChance: 0 | 1 = 0) => {
      if (row < 1 || row >= maxRows) {
        return;
      }

      if(this.isEven(row)) {
        if (col < 2 || col >=maxCols) {
          return;
        }
      } else {
        if (col < 1 || col >=maxCols) {
          return;
        }
      }

      for (let i = 0; i <= increasedChance; i++) {
        this.connected.add(`${row}.${col}` + '.'.repeat(i));
      }
    }


    this.tilesService.tileList.forEach((tile) => {
      if(this.isEven(tile.row)) {
        addConnectedWithinBounds(tile.row-3, tile.col-2);
        addConnectedWithinBounds(tile.row-3, tile.col-1, 1);
        addConnectedWithinBounds(tile.row-3, tile.col, 1);
        addConnectedWithinBounds(tile.row-3, tile.col+1);

        addConnectedWithinBounds(tile.row+3, tile.col-2);
        addConnectedWithinBounds(tile.row+3, tile.col-1, 1);
        addConnectedWithinBounds(tile.row+3, tile.col, 1);
        addConnectedWithinBounds(tile.row+3, tile.col+1);

        addConnectedWithinBounds(tile.row-2, tile.col-2,1);
        addConnectedWithinBounds(tile.row-1, tile.col-3,1);
        addConnectedWithinBounds(tile.row, tile.col-3);
        addConnectedWithinBounds(tile.row+1, tile.col-3,1);
        addConnectedWithinBounds(tile.row+2, tile.col-2,1);

        addConnectedWithinBounds(tile.row-2, tile.col+2,1);
        addConnectedWithinBounds(tile.row-1, tile.col+2,1);
        addConnectedWithinBounds(tile.row, tile.col+3);
        addConnectedWithinBounds(tile.row+1, tile.col+2,1);
        addConnectedWithinBounds(tile.row+2, tile.col+2,1);

      } else {
        addConnectedWithinBounds(tile.row-3, tile.col-1);
        addConnectedWithinBounds(tile.row-3, tile.col,1);
        addConnectedWithinBounds(tile.row-3, tile.col+1,1);
        addConnectedWithinBounds(tile.row-3, tile.col+2);

        addConnectedWithinBounds(tile.row+3, tile.col-1);
        addConnectedWithinBounds(tile.row+3, tile.col,1);
        addConnectedWithinBounds(tile.row+3, tile.col+1,1);
        addConnectedWithinBounds(tile.row+3, tile.col+2);

        addConnectedWithinBounds(tile.row-2, tile.col-2,1);
        addConnectedWithinBounds(tile.row-1, tile.col-2,1);
        addConnectedWithinBounds(tile.row, tile.col-3);
        addConnectedWithinBounds(tile.row+1, tile.col-2,1);
        addConnectedWithinBounds(tile.row+2, tile.col-2,1);


        addConnectedWithinBounds(tile.row-2, tile.col+2,1);
        addConnectedWithinBounds(tile.row-1, tile.col+3,1);
        addConnectedWithinBounds(tile.row, tile.col+3);
        addConnectedWithinBounds(tile.row+1, tile.col+3,1);
        addConnectedWithinBounds(tile.row+2, tile.col+2,1);
      }
    });

    this.connected = this.difference(this.connected, this.tilesService.blockedCells);
    const increasedChangeSet = this.createIncreasedChanceSet(this.tilesService.blockedCells)
    this.connected = this.difference(this.connected, increasedChangeSet);
  }

  private isEven(n) {
    return n % 2 == 0;
  }

  private difference(s1: any, s2: any): Set<string>{
    let newSet: Set<string> = new Set();
    s1.forEach(elem => newSet.add(elem));
    s2.forEach(elem => newSet.delete(elem));
    return newSet;
  }

  private createIncreasedChanceSet(set: any): Set<string> {
    let newSet: Set<string> = new Set();
    set.forEach(elem => newSet.add(elem + '.'));
    return newSet;
  }

  private placeRandomTile(maxRows = 10 , maxCols = 10) {
    const row = this.random(1,maxRows);
    const col = this.random(2,maxCols+1);
    const id = row + '.' + col;
    if(!this.tilesService.isValidSnapSpace(row + '.' + col)) {
      this.placeRandomTile();
      return;
    }

    this.tilesService.registerNewTile({
      row: row,
      col: col,
      id: this.generateGuid(),
      tileId: "C0",
      cubes: [0,0,0,0,0,0,0],
      hero: [0,0,0,0,0,0,0],
      rotation: 0,
    });
  }

  private random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private generateGuid() {
    let result, i, j;
    result = '';
    for(j=0; j<32; j++) {
      if( j == 8 || j == 12 || j == 16 || j == 20)
        result = result + '-';
      i = Math.floor(Math.random()*16).toString(16).toUpperCase();
      result = result + i;
    }
    return result;
  }

  private clearGrid() {
    this.tilesService.clearGrid();
  }

}
