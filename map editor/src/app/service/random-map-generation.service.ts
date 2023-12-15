import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { TilesService } from './tiles.service';
import { Helper } from '../utility/helper';

export type RandomMapSettings = {
  size: string,
  playerCount: number;
  selectedTowns?: Array<string>;
  flipTownTiles?: boolean;
  flipFarTiles?: boolean;
  flipNearTiles?: boolean;
  flipCenterTiles?: boolean;
  grid: {
    rows: number,
    cols: number,
    tiles: number
  }
}

@Injectable({
  providedIn: 'root'
})
export class RandomMapGenerationService {
  public storageKey = 'scenarioCreatorGenerationSettings';
  public connected = new Set();
  public settings: RandomMapSettings = {
    playerCount: 2,
    size: 'MEDIUM',
    flipTownTiles: true,
    flipFarTiles: false,
    flipNearTiles: false,
    flipCenterTiles: false,
    grid: {
      rows: 10,
      cols: 10,
      tiles: 10
    }
  }

  constructor(public tilesService: TilesService, private config: ConfigService, private calc: Helper) {
    this.getConnectedTiles();
    this.loadSettings();
  }

  loadSettings() {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      this.settings = {
        ...this.settings,
        ...JSON.parse(data)
      }
    } else {
      this.saveSettings();
    }
  }

  saveSettings() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
  }


  public setSettings(settings: RandomMapSettings) {
    this.settings = settings;
    this.saveSettings();
  }

  public getSettings() {
    return this.settings;
  }

  public getGridSizeFromSetting() {
    const settings = this.settings;
    const players = settings.playerCount;
    if(settings.size === "SMALL") {
      settings.grid =  {
        rows: 10,
        cols: 10,
        tiles: (players * 3) + this.random(0,1)
      }
    }
    if(settings.size === "MEDIUM") {
      settings.grid =  {
        rows: 13,
        cols: 13,
        tiles: (players * 4) + this.random(0,2)
      }
    }
    if(settings.size === "LARGE") {
      settings.grid =  {
        rows: 20,
        cols: 20,
        tiles: (players * 4) + this.random(4,7)
      }
    }
    console.log('S', settings.grid.tiles)
    return settings;
  }

  generateRandomMap() {
    const settings = this.settings;
    // TODO Get rows and cols based on defined map size
    this.clearGrid();
    this.generateConnectedRandomMap(settings?.grid?.rows, settings?.grid?.cols, settings?.grid?.tiles);
    // alternative that is based on predefined layouts: generatePredefinedRandomMap();
    this.test();
    this.placeStartingTownsPass(settings.playerCount);
    this.connectToStartingTilePass();
    this.replacePlaceholderTilesPass(settings.playerCount);
    this.flipTilesToFront();
    this.moveAllToTopLeft();
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
  }

  // private distance(x1, y1, x2, y2) {
  //   const a = x1 - x2;
  //   const b = y1 - y2;
  //   return Math.sqrt( a*a + b*b );
  // }

  // calculate a tiles total distance to all other tiles (lower is more central)
  // calculateReachability(tiles: any) {
  //   tiles.forEach((tile) => {
  //     tile.reachability = 0;
  //     tiles.forEach((tileCompared) => {
  //       const dist = this.calc.distance(tile.row, tileCompared.row, tile.col, tileCompared.col)
  //       if (dist > tile.reachability) {
  //         tile.reachability = dist;
  //       }
  //       // tile.reachability += this.distance(tile.row, tileCompared.row, tile.col, tileCompared.col)
  //     });
  //   });
  //   return tiles;
  // }

  test(playerCount = 2) {
    const tiles:any = [...this.tilesService.tileList];
    const solution: any[] = [];
    const addToSolution = (tile: any) => {
      const tileListIndex = tiles.findIndex((element: any) => {
        return element.id === tile.id;
      });
      tiles.splice(tileListIndex, 1);
      solution.push(tiles[tileListIndex]);
    }

    addToSolution(tiles[0]);



  }

  placeStartingTownsPass(playerCount = 2) {
    const tiles:any = [...this.tilesService.tileList];
    const furthestPoints = this.calc.getFurthestTwoPoints(tiles);
    let possibleTownTiles: any = [];

    if (playerCount == 1) {
      possibleTownTiles.push(furthestPoints.tileOne);
    } else {
      possibleTownTiles = this.calc.getKFurthestPoints(playerCount, tiles);
    }

    for (let i = 0; i < playerCount && i < possibleTownTiles.length; i++) {
      possibleTownTiles[i].tileId = 'S0'
      this.tilesService.updateTileData(possibleTownTiles[i]);
    }
  }

  getMostCenterTileFromTowns() {
    const tiles:any = [...this.tilesService.tileList];
    const walkable = this.calc.generateWalkableCellsList(tiles);
    const townTiles = tiles.filter((tile) => {
      if (tile.tileId === "S0") {
        return tile;
      }
    });
    const remainingTiles = tiles.filter((tile) => {
      if (tile.tileId === "PLACEHOLDER") {
        return tile;
      }
    });

    const calcDistanceToTowns = remainingTiles.map((tile) => {
      const t = townTiles.reduce((acc, town) => {
        const distance = this.calc.walkDistance(tile.row, town.row, tile.col, town.col, walkable);
        acc.total = acc.total + distance;
        if (distance > acc.max) acc.max = distance;
        if (acc.minimum === -1 || distance < acc.minimum) {
          acc.minimum = distance;
        }
        return acc;
      }, {
        total: 0,
        minimum: -1,
        max: 0,
        id: tile.row + '.' + tile.col,
        worth: 0,
        tile: tile
      });
      return t
    })

    // asign worth based on minimum distance
    calcDistanceToTowns.sort((a,b) => {
      return a.minimum - b.minimum;
    }).forEach((tile, index) => {
      tile.worth += index
    });

    // asign worth based on max distance
    calcDistanceToTowns.sort((a,b) => {
      return b.max - a.max;
    }).forEach((tile, index) => {
      tile.worth += index;
    });

    // asign worth based on total distances
    calcDistanceToTowns.sort((a,b) => {
      return b.total - a.total;
    }).forEach((tile, index) => {
      tile.worth += index;
    });

    // sort by worth
    calcDistanceToTowns.sort((a,b) => {
      return b.worth - a.worth;
    })

    console.log(calcDistanceToTowns)

    return calcDistanceToTowns[0];
  }

  private replacePlaceholderTilesPass(playerCount) {
    const mostMid = this.getMostCenterTileFromTowns();
    if (mostMid) {
      mostMid.tile.tileId = "C0"
      this.tilesService.updateTileData(mostMid.tile)
    }

    const count = (ID: string) => {
      return this.tilesService.tileList.reduce((acc, current) => {
        if (current.tileId === ID) {
          acc++;
        }
        return acc;
      },0);
    }
    const countPlaceholders = count("PLACEHOLDER");
    const farArr = new Array(playerCount - count("F0")).fill("F0");
    const nearArr = new Array(playerCount - count("N0")).fill("N0");
    const remainder = count("PLACEHOLDER") - farArr.length - nearArr.length;
    let randomArr: any = []
    if (remainder > 0) {
      const randomTile = function() {
        const options = ['F0', 'N0']
        return options[Math.floor(Math.random()*options.length)]
      }
      // @ts-ignore
      // randomArr = new Array(remainder + 1).fill('C0');
      for (let i = 0; i < remainder; i++) {
        randomArr.push(randomTile());
      }

    }


    const placeable = [...farArr, ...nearArr, ...randomArr];



    this.tilesService.tileList.map((tile) => {
      if (tile.tileId === "PLACEHOLDER" && placeable.length) {
        const pick = placeable.splice(this.random(0,placeable.length-1), 1)[0];
        tile.tileId = pick;
        // const pick = tileList[this.random(0,tileList.length-1)];
        // tile.tileId = pick;
      }
    });
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

    towns.forEach((town) => {
      const neighbours = this.calc.getNeighbours(tiles, [town]);
      const randomNeighbour = this.random(0, neighbours.length-1);
      neighbours[randomNeighbour].tileId = "F0";
      this.tilesService.updateTileData(neighbours[randomNeighbour]);
    })

    const farTiles = tiles.filter((tile) => {
      if (tile.tileId === "F0") {
        return tile;
      }
    });

    farTiles.forEach((town) => {
      const neighbours = this.calc.getNeighbours(tiles, [town]);
      const tile = neighbours.find((neightbour) => neightbour.tileId !== "S0" && neightbour.tileId !== "F0")
      if (!tile) {
        console.log(neighbours, tile)
        return;
      }
      tile.tileId = "N0";
      this.tilesService.updateTileData(tile);
    })
  }

  private flipTilesToFront() {
    // Flip towns:
    const towns = ['#S1', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
    const random = ["F0", "N0", "C0"]
    this.tilesService.tileList.map((tile) => {
      if (this.settings.flipTownTiles) {
        if (tile.tileId === "S0") {
          const pick = towns.splice(this.random(0,towns.length-1), 1)[0];
          // tile.tileId = pick;
          this.flipAndValidate(tile, pick);
        }
      }

      if(this.settings.flipCenterTiles) {
        if (tile.tileId === "C0") {
          this.flipAndValidate(tile, "C1")
        }
      }


    });

    // Flip others:
  }

  private flipAndValidate(tile, tileId) {
    tile.tileId = tileId;
    for(let i = 1; i< 6; i++) {
      if (this.tilesService.isValid()) {
        break;
      };
      tile.rotation = i;
    }
  }

  private placeTileById(id: any, maxRows:number, maxCols:number) {
    const pos = id.split('.').map((a)=>{return Number(a)});
    const row = pos[0];
    const col = pos[1];
    this.tilesService.registerNewTile({
      row: row,
      col: col,
      id: this.generateGuid(),
      tileId: "PLACEHOLDER",
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
      tileId: "PLACEHOLDER",
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

  private moveAllToTopLeft() {
    for (let i = 0; i < 10; i++) {
      this.tilesService.moveAllUpRight();
    }
    for (let i = 0; i < 10; i++) {
      this.tilesService.moveAllUpLeft();
    }
    for (let i = 0; i < 10; i++) {
      this.tilesService.moveAllLeft();
    }
  }

}
