import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

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
  public mapSelection = "default";

  public tilesUpdated: any = new BehaviorSubject('');

  constructor() {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      this.tileList = JSON.parse(data)[this.mapSelection];
      console.log(JSON.stringify(this.tileList))
    } else {
      this.saveTileData();
    }
  }

  public registerNewTile(tileData: TileData) {
    this.tileList.push(tileData);
  }

  public updateTileData(tileData:any) {
    const tileListIndex = this.tileList.findIndex((element: any) => {
      return element.id === tileData.id;
    })

    this.tileList[tileListIndex] = tileData;
    this.saveTileData();
  }

  public saveTileData() {
    setTimeout(() => {
      this.tilesUpdated.next(new Date().toString());
    },10)
    const save = {
      'default': this.tileList
    };
    localStorage.setItem(this.storageKey, JSON.stringify(save));
  }

  public deleteTile(id: any) {
    const tileListIndex = this.tileList.findIndex((element: any) => {
      return element.id === id;
    });

    this.tileList.splice(tileListIndex, 1);
    this.saveTileData();
  }

  public clearGrid() {
    this.tileList = [];
    this.saveTileData();
  }

  isEven(n) {
    return n % 2 == 0;
  }

  generateBlockedcellsList(excludeGuid?: string) {
    const blockedCells = new Set();
    this.tileList.forEach((tile) => {
      if (tile.id === excludeGuid) {
        return;
      }
      blockedCells.add(`${tile.row}.${tile.col}`);
      blockedCells.add(`${tile.row}.${tile.col-1}`);
      blockedCells.add(`${tile.row}.${tile.col+1}`);
      if(this.isEven(tile.row)) {
        blockedCells.add(`${tile.row-1}.${tile.col-1}`);
        blockedCells.add(`${tile.row-1}.${tile.col}`);
        blockedCells.add(`${tile.row+1}.${tile.col-1}`);
        blockedCells.add(`${tile.row+1}.${tile.col}`);
      } else {
        blockedCells.add(`${tile.row-1}.${tile.col}`);
        blockedCells.add(`${tile.row-1}.${tile.col+1}`);
        blockedCells.add(`${tile.row+1}.${tile.col}`);
        blockedCells.add(`${tile.row+1}.${tile.col+1}`);
      }
    })

    return blockedCells;
  }

  public isValidSnapSpace(id: string, config?: any) {
    this.generateBlockedcellsList(config.id);
    const pos = id.split('.').map((a)=>{return Number(a)});
    const row = pos[0];
    const col = pos[1];
    console.log(this.generateBlockedcellsList(config.id).has(id))
  }
}
