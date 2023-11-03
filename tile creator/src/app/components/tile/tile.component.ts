import {Component, EventEmitter, Input, Output} from '@angular/core';
import * as htmlToImage from 'html-to-image';
import {SaveData} from "../editor/editor.component";

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent {
  elementId = this.generateGuid();
  terrains: any[] = [
    {value: 'grass', name: 'Grass'},
    {value: 'dirt', name: 'Dirt'},
    {value: 'subterrain', name: 'Subterrain'},
    {value: 'snow', name: 'Snow'},
    {value: 'lava', name: 'Lava'},
    {value: 'cursed', name: 'Cursed'},
    {value: 'swamp', name: 'Swamp'},
  ];
  @Input() terrainSelected: string = 'grass';

  @Output() updateTile = new EventEmitter<any>();

  @Output() deleteTile = new EventEmitter<any>();

  @Input({ required: true }) id: string = '?';

  @Input({ required: true }) guid:string = ''

  @Input({ required: true }) saveData:SaveData[] = [
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
    },
  ]


  public selectTerrain(val: any) {
    this.save();
  }

  public download(dataurl: any, filename: string) {
    const link = document.createElement("a");
    link.href = dataurl;
    link.download = filename;
    link.click();
  }

  generateImage(){
    let node:any = document.getElementById(this.guid);
    console.log('@', node)
    htmlToImage.toPng(node)
      .then( (dataUrl) => {
        this.download(dataUrl, `${this.id}.png`)
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
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

  saveTileId(event: any) {
    this.id = event.target.value;
    this.save();
  }

  saveCell(data: any) {
    this.saveData[data.cell] = data;
    this.save();
  }

  save() {
    this.updateTile.next({
      terrain: this.terrainSelected,
      tileId: this.id,
      guid: this.guid,
      data: this.saveData
    })
  }

  delete() {
    this.deleteTile.next(this.guid);
  }
}
