import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import * as zlib from 'pako';
import { ConfigService } from './config.service';
import { Helper } from '../utility/helper';

export interface TileData {
  row: number;
  col: number;
  id: string;
  tileId: string;
  cubes: Array<number>;
  hero: Array<number>;
  rotation: number;
}

@Injectable({
  providedIn: 'root'
})
export class TilesService {

  public storageKey = 'scenarioCreatorData';
  public tileList:any = [];
  public blockedCells:any = new Set();
  public walkableCells:any = new Set();
  public mapSelection = "default";
  public isValidMap:boolean = true;

  public rows: any[] = [];
  public columns: any[] = [];

  public tilesUpdated: any = new BehaviorSubject('');

  constructor(private config: ConfigService, private calc:Helper) {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      this.tileList = JSON.parse(data)[this.mapSelection];
      this.updateLists();
    } else {
      this.saveTileData();
    }
  }

  public registerNewTile(tileData: TileData) {
    this.tileList.push(tileData);
    this.updateLists();
  }

  public updateTileData(tileData:any) {
    const tileListIndex = this.tileList.findIndex((element: any) => {
      return element.id === tileData.id;
    });

    this.tileList[tileListIndex] = tileData;
    this.updateLists();
    this.saveTileData();
  }

  public saveTileData() {
    setTimeout(() => {
      this.tilesUpdated.next(new Date().toString());
    },10)
    this.fixTileList();
    const save = {
      'default': this.tileList
    };
    localStorage.setItem(this.storageKey, JSON.stringify(save));
  }

  private fixTileList() {
    this.tileList.forEach((tile) => {
      if (Array.isArray(tile.tileId)) {
        console.log('FIX', tile)
        tile.tileId = tile.tileId[0];
      }
    })
  }

  public deleteTile(id: any) {
    const tileListIndex = this.tileList.findIndex((element: any) => {
      return element.id === id;
    });

    this.tileList.splice(tileListIndex, 1);
    this.updateLists();
    this.saveTileData();
  }

  public clearGrid() {
    this.tileList = [];
    this.updateLists();
    this.saveTileData();
  }

  public updateLists() {
    this.generateBlockedCellsList();
    setTimeout(() => {
      this.isValidMap = this.isValid();
    })
  }

  isEven(n) {
    return n % 2 == 0;
  }

  isValid() {
    const walkable = this.generateWalkableCellsList();
    if (!this.tileList.length) {
      console.log('EMPTY LIST')
      return true;
    }
    const start = this.tileList[0].row + '.' + this.tileList[0].col;

    const frontier: any = [];
    frontier.push(start);
    const reached = new Set();
    reached.add(start);

    while (frontier.length > 0) {
      const current = frontier.shift();
      const pos = current.split('.').map((a)=>{return Number(a)});
      const row = pos[0];
      const col = pos[1];
      this.calc.getCellNeighbours(row,col).forEach((next) => {
        if(!reached.has(next) && walkable.has(next)) {
          frontier.push(next);
          reached.add(next);
        }
      });
    }
    return reached.size === walkable.size;
  }

  generateWalkableCellsList() {
    const walkableCells = new Set();
    this.tileList.forEach((tile) => {
      let blockedList = this.config.TILES[tile.tileId]?.blocked;
      if (!blockedList) {
        return
      }
      // double the list for easier cell rotation calculation
      blockedList = [...blockedList, ...blockedList];
      const cells = this.calc.getCellNeighbours(tile.row,tile.col);
      walkableCells.add(tile.row + '.' + tile.col);
      cells.forEach((cell, index) => {
        if (!blockedList[index + 6 - tile.rotation]) {
          walkableCells.add(cell);
        }
      });
    });
    return walkableCells;
  }

  generateBlockedCellsList(excludeGuid?: string) {
    const blockedCells = new Set();
    this.tileList?.forEach((tile) => {
      if (tile.id === excludeGuid) {
        return;
      }
      blockedCells.add(`${tile.row}.${tile.col}`);
      blockedCells.add(`${tile.row}.${tile.col-1}`);
      blockedCells.add(`${tile.row}.${tile.col+1}`);

      blockedCells.add(`${tile.row}.${tile.col-2}`);
      blockedCells.add(`${tile.row}.${tile.col+2}`);
      if(this.isEven(tile.row)) {
        blockedCells.add(`${tile.row-1}.${tile.col-1}`);
        blockedCells.add(`${tile.row-1}.${tile.col}`);
        blockedCells.add(`${tile.row+1}.${tile.col-1}`);
        blockedCells.add(`${tile.row+1}.${tile.col}`);

        blockedCells.add(`${tile.row-1}.${tile.col-2}`);
        blockedCells.add(`${tile.row-1}.${tile.col+1}`);
        blockedCells.add(`${tile.row+1}.${tile.col-2}`);
        blockedCells.add(`${tile.row+1}.${tile.col+1}`);

        blockedCells.add(`${tile.row-2}.${tile.col-1}`);
        blockedCells.add(`${tile.row-2}.${tile.col}`);
        blockedCells.add(`${tile.row-2}.${tile.col+1}`);
        blockedCells.add(`${tile.row+2}.${tile.col-1}`);
        blockedCells.add(`${tile.row+2}.${tile.col}`);
        blockedCells.add(`${tile.row+2}.${tile.col+1}`);

      } else {
        blockedCells.add(`${tile.row-1}.${tile.col}`);
        blockedCells.add(`${tile.row-1}.${tile.col+1}`);
        blockedCells.add(`${tile.row+1}.${tile.col}`);
        blockedCells.add(`${tile.row+1}.${tile.col+1}`);

        blockedCells.add(`${tile.row-1}.${tile.col-1}`);
        blockedCells.add(`${tile.row-1}.${tile.col+2}`);
        blockedCells.add(`${tile.row+1}.${tile.col-1}`);
        blockedCells.add(`${tile.row+1}.${tile.col+2}`);

        blockedCells.add(`${tile.row-2}.${tile.col-1}`);
        blockedCells.add(`${tile.row-2}.${tile.col}`);
        blockedCells.add(`${tile.row-2}.${tile.col+1}`);
        blockedCells.add(`${tile.row+2}.${tile.col-1}`);
        blockedCells.add(`${tile.row+2}.${tile.col}`);
        blockedCells.add(`${tile.row+2}.${tile.col+1}`);
      }
    })
    this.blockedCells = blockedCells;
    return blockedCells;
  }

  public isValidSnapSpace(id: string, config?: any) {
    this.generateBlockedCellsList(config?.id)
    const pos = id.split('.').map((a)=>{return Number(a)});
    const row = pos[0];
    const col = pos[1];
    return !this.blockedCells.has(id);
  }

  export() {
    return btoa(
      zlib.deflate(JSON.stringify(this.tileList), { to: 'string' })
    )
  }

  import(data) {
    return new Promise((resolve, reject) => {
      try {
        this.tileList = JSON.parse(
          zlib.inflate(atob(data), { to: 'string' })
        );
        resolve('');
      } catch (err) {
        reject();
      }
    })
  }

  moveAllUpLeft() {
    const list = JSON.parse(JSON.stringify(this.tileList));
    const lowestTopPos = list.reduce((acc, value) => {
      if (acc === -1 || value.row < acc) {
        return value.row;
      } else {
        return acc;
      }
    }, -1)

    const lowestLeftPos = list.reduce((acc, value) => {
      if (acc === -1 || value.col < acc) {
        return value.col;
      } else {
        return acc;
      }
    }, -1)

    if (lowestTopPos <= 1 || lowestLeftPos <= 2) {
      return
    }

    list.map((tile: any) => {
      if (!(tile.row & 1)) {
        tile.col = tile.col -1;
      }
      tile.row = tile.row -1;
      this.updateTileData(tile);
    });
    this.tileList = list;
  }

  moveAllUpRight() {
    const list = JSON.parse(JSON.stringify(this.tileList));
    const lowestTopPos = list.reduce((acc, value) => {
      if (acc === -1 || value.row < acc) {
        return value.row;
      } else {
        return acc;
      }
    }, -1)

    const HighestRightPos = list.reduce((acc, value) => {
      if (acc === -1 || value.col > acc) {
        return value.col;
      } else {
        return acc;
      }
    }, -1);

    if (lowestTopPos <= 1 || HighestRightPos >= this.rows.length - 2) { // TODO ADD RIGHT MAX CHECK
      return
    }

    list.map((tile: any) => {
      if ((tile.row & 1)) {
        tile.col = tile.col + 1;
      }
      tile.row = tile.row -1;
      this.updateTileData(tile);
    });
    this.tileList = list;
  }

  moveAllLeft() {
    const list = JSON.parse(JSON.stringify(this.tileList));
    const lowestLeftPos = list.reduce((acc, value) => {
      if (acc === -1 || value.col < acc) {
        return value.col;
      } else {
        return acc;
      }
    }, -1)

    if (lowestLeftPos <= 2) {
      return
    }

    list.map((tile) => {
      tile.col = tile.col -1;
      this.updateTileData(tile);
    });
    this.tileList = list;
  }

  moveAllRight() {
    const list = JSON.parse(JSON.stringify(this.tileList));
    const HighestRightPos = list.reduce((acc, value) => {
      if (acc === -1 || value.col > acc) {
        return value.col;
      } else {
        return acc;
      }
    }, -1);

    if (HighestRightPos >= this.rows.length - 2) {
      return
    }

    list.map((tile) => {
      tile.col = tile.col + 1;
      this.updateTileData(tile);
    });
    this.tileList = list;
  }

  moveAllDownRight() {
    const list = JSON.parse(JSON.stringify(this.tileList));
    const highestTopPos = list.reduce((acc, value) => {
      if (acc === -1 || value.row > acc) {
        return value.row;
      } else {
        return acc;
      }
    }, -1)

    const HighestRightPos = list.reduce((acc, value) => {
      if (acc === 0 || value.col > acc) {
        return value.col;
      } else {
        return acc;
      }
    }, -1);

    if (highestTopPos >= this.columns.length - 2 || HighestRightPos >= this.rows.length - 2) { // TODO ADD RIGHT MAX CHECK
      return
    }

    list.map((tile: any) => {
      if ((tile.row & 1)) {
        tile.col = tile.col + 1;
      }
      tile.row = tile.row +1;
      this.updateTileData(tile);
    });
    this.tileList = list;
  }

  moveAllDownLeft() {
    const list = JSON.parse(JSON.stringify(this.tileList));
    const highestTopPos = list.reduce((acc, value) => {
      if (acc === -1 || value.row > acc) {
        return value.row;
      } else {
        return acc;
      }
    }, -1)

    const lowestLeftPos = list.reduce((acc, value) => {
      if (acc === -1 || value.col < acc) {
        return value.col;
      } else {
        return acc;
      }
    }, -1);

    if (highestTopPos >= this.columns.length - 2 || lowestLeftPos <=  2) { // TODO ADD RIGHT MAX CHECK
      return
    }

    list.map((tile: any) => {
      if (!(tile.row & 1)) {
        tile.col = tile.col -1;
      }
      tile.row = tile.row + 1;
      this.updateTileData(tile);
    });
    this.tileList = list;
  }
}
