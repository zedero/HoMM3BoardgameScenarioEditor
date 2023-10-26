import { Injectable } from '@angular/core';

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

  constructor() {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      this.tileList = JSON.parse(data)[this.mapSelection];
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
}
