import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TilesService {

  public storageKey = 'scenarioCreatorData';
  public tileList:any = [];

  constructor() {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      this.tileList = JSON.parse(data);
    }
  }

  public registerNewTile(tileData: any) {
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
    localStorage.setItem(this.storageKey, JSON.stringify(this.tileList));
  }

  public deleteTile(id: any) {
    const tileListIndex = this.tileList.findIndex((element: any) => {
      return element.id === id;
    });

    this.tileList.splice(tileListIndex, 1);
    this.saveTileData();
  }
}
