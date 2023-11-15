import { Injectable } from '@angular/core';
import { TilesService } from './tiles.service';

export type RandomMapSettings = {
  size?: 'SMALL' | 'MEDIUM' | 'LARGE',
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

  constructor(public tilesService: TilesService,) {
    this.getConnectedTiles();
  }

  generateRandomMap(settings: RandomMapSettings = {}) {
    // TODO Get rows and cols based on defined map size
    this.clearGrid();
    this.generateConnectedRandomMap();
    // alternative that is based on predefined layouts: generatePredefinedRandomMap();
    this.placeStartingTownsPass();
    this.connectToStartingTilePass();
    this.flipTilesToFront();
  }

  private generateConnectedRandomMap(maxRows = 10 , maxCols = 10) {
    this.placeRandomTile();
    this.getConnectedTiles();
    let tilesPlaced = 0;
    while(this.connected.size && tilesPlaced < 50) {
      tilesPlaced++;
      this.placeTileById([...this.connected][Math.floor(Math.random()*this.connected.size)]);
    }
  }

  placeStartingTownsPass(playerCount = 2) {
    const tiles = [...this.tilesService.tileList];
    if (playerCount === 1) {
      const tile = tiles[Math.floor(Math.random()*tiles.length)];
      tile.tileId = 'S1'
      this.tilesService.updateTileData(tile);
    }

    if (playerCount === 2) {
      // Sort tiles based on their flat distance.
      tiles.sort((a,b) => {
        return (a.row + a.col)- (b.row + b.col);
      });

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
    // TODO create algorithm
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

  private placeTileById(id: any) {
    const pos = id.split('.').map((a)=>{return Number(a)});
    const row = pos[0];
    const col = pos[1];
    this.tilesService.registerNewTile({
      row: row,
      col: col,
      id: this.generateGuid(),
      tileId: "F0",
      cubes: [0,0,0,0,0,0,0],
      hero: [0,0,0,0,0,0,0],
      rotation: 0,
    });
    this.getConnectedTiles();
  }

  private getConnectedTiles(maxRows = 10 , maxCols = 10) {
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
      tileId: "F0",
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
