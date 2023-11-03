import { Component } from '@angular/core';
import {SaveData} from "./components/editor/editor.component";
import * as htmlToImage from "html-to-image";

export type StorageSaveData = {
  terrain: string;
  tileId: string;
  data: SaveData[];
  guid: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public storageKey = 'tileCreatorData';
  public tileList:StorageSaveData[] = [];


  constructor() {
    this.load();
  }

  load() {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      this.tileList = JSON.parse(data);
    } else {
      this.init();
    }
  }

  updateTile(data: any) {
    const index = this.tileList.findIndex((tile) => {
      return tile.guid === data.guid;
    })
    this.tileList[index] = data;
    this.save();
  }

  deleteTile(guid: string) {
    if (!confirm("Are you sure you want to delete this tile?")) {
      return;
    }

    const index = this.tileList.findIndex((tile) => {
      return tile.guid === guid;
    })
    this.tileList.splice(index, 1);
    console.log('@', index, guid)
    this.save();
  }

  save(){
    localStorage.setItem(this.storageKey, JSON.stringify(this.tileList));
  }

  newTile() {
    const tile: StorageSaveData = {
      terrain: 'grass',
      tileId: '',
      guid: this.generateGuid(),
      data: this.getEmptyTileData()
    }

    this.tileList.unshift(tile);
  }

  init() {
    this.newTile();
    this.save();
  }

  getEmptyTileData(): SaveData[] {
    return [
      {
        cell: 0,
        enemy: '0',
        icon: '',
        blocked: false,
        border: false
      },
      {
        cell: 1,
        enemy: '0',
        icon: '',
        blocked: false,
        border: false
      },
      {
        cell: 2,
        enemy: '0',
        icon: '',
        blocked: false,
        border: false
      },
      {
        cell: 3,
        enemy: '0',
        icon: '',
        blocked: false,
        border: false
      },
      {
        cell: 4,
        enemy: '0',
        icon: '',
        blocked: false,
        border: false
      },
      {
        cell: 5,
        enemy: '0',
        icon: '',
        blocked: false,
        border: false
      },
      {
        cell: 6,
        enemy: '0',
        icon: '',
        blocked: false,
        border: false
      }]
  }

  private generateGuid():string {
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


  public download(dataurl: any, filename: string) {
    const link = document.createElement("a");
    link.href = dataurl;
    link.download = filename;
    link.click();
  }

  generate() {
    this.tileList.forEach((tile) => {
      let node:any = document.getElementById(tile.guid);
      htmlToImage.toPng(node)
        .then( (dataUrl) => {
          this.download(dataUrl, `${tile.tileId}.png`)
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        });
    })
  }

  sort() {
    console.log(this.tileList)
    this.tileList = this.tileList.sort((tileA:StorageSaveData, tileB:StorageSaveData) => {
      return tileA.tileId.replace('#', 'Z').localeCompare(tileB.tileId.replace('#', 'Z'))
    });
  }
}
