import { Component } from '@angular/core';
import {SaveData} from "./components/editor/editor.component";
import * as htmlToImage from "html-to-image";

export type StorageSaveData = {
  terrain: string;
  group: string;
  expansion: string;
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

    // console.log(getStringValue("#S1"))
    // const t = "S1"
    // console.log("#S1".charCodeAt(0))
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
      group: 'far',
      expansion: 'core',
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
          this.download(dataUrl, `${tile.tileId.replace("#", "_")}.png`)
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        });
    })
  }

  sort() {
    const getStringValue = function(text: string) {
      const charList = text.replace(/[0-9]/g, '').split("");
      const number = text.replace(/\D/g, '');
      const res = charList.map((letter: string) => {
        if (/^\d+$/.test(letter)) {
          return parseInt(letter);
        }
        return letter.charCodeAt(0) * 100;
      }).reduce((acc: number, val: number) => {
        return acc + val
      }, 0) + parseInt(number);
      return res;
    }
    this.tileList.sort((tileA:StorageSaveData, tileB:StorageSaveData) => {
      return getStringValue(tileA.tileId) - getStringValue(tileB.tileId)
    })
    this.save();
  }

  test() {
    const generateBlockedList = (tile: any) => {
      const getBlockedFromCellData = (cellId: number) => {
        return tile.data[cellId].blocked || tile.data[cellId].border ? 1 : 0;
      }

      return [
        getBlockedFromCellData(1),
        getBlockedFromCellData(4),
        getBlockedFromCellData(6),
        getBlockedFromCellData(5),
        getBlockedFromCellData(2),
        getBlockedFromCellData(0)
      ]
    }
    const generateDesc = (tile: any) => {
      return tile.group.charAt(0).toUpperCase() + tile.group.slice(1) + " Tile " + tile.tileId
    }

    const result: any = {}
    this.tileList.map(tile => {
      const t = {
        id: tile.tileId,
        img: "assets/tiles/" + tile.tileId.replace("#", "_") + ".png",
        desc: generateDesc(tile),
        expansionID: "EXPANSION." + tile.expansion?.toUpperCase(),
        groundType: "GROUNDTYPE." + tile.terrain.toUpperCase(),
        group: "GROUP." + tile.group?.toUpperCase(),
        blocked: generateBlockedList(tile)
      }
      result[tile.tileId] = t;
    });
    console.log(JSON.stringify(result))
  }
}
