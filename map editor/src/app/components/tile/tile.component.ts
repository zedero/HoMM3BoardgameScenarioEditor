import { Component, Input, OnInit} from '@angular/core';
import {TileData, TilesService} from "../../service/tiles.service";
import { tilesConfiguration } from "../../config";
import {MatDialog} from "@angular/material/dialog";
import {EditDialogComponent} from "../edit-dialog/edit-dialog.component";

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {

  constructor(public tilesService: TilesService, public dialog: MatDialog) {}

  public image = '';

  public dragPosition = {x: 0, y: 0};

  public rotation = '0deg';

  private config: TileData = {
    row: 0,
    col: 0,
    id: '-1', // UUID
    tileId: '', // type of tile, random tile or starting town tile
    cubes: [0,0,0,0,0,0,0],
    hero: [0,0,0,0,0,0,0],
    rotation: 0,
  };

  @Input()
  public set setConfig(configData: any) {
    this.config = configData;
    this.rotation = (this.config.rotation * 60) + 'deg';
    this.setImage();
  }

  private setImage() {
    if (tilesConfiguration[this.config.tileId]) {
      this.image = tilesConfiguration[this.config.tileId].img;
    } else {
      this.image = 'default'
    }
  }

  ngOnInit() {
    this.snapToCell(this.generateId(this.config));
  }

  public snap(event: any) {
    let x,y;
    if (event.type === 'mouseup') {
      x = event.clientX;
      y = event.clientY;
    } else {
      x = event.changedTouches[0].clientX;
      y = event.changedTouches[0].clientY;
    }

    const collisionElements = document.elementsFromPoint(x, y);

    const target = collisionElements.find((element: Element) => {
      return element.className === "cell";
    });

    if (!target?.id) {
      this.snapToCell(this.generateId(this.config));
      return
    }

    // this.tilesService.isValidSnapSpace(target.id, this.config);

    this.snapToCell(target.id);

  }

  private generateId(data: any) {
    return `${data.row}.${data.col}`
  }

  private snapToCell = (id: string) => {
    const element = document.getElementById(id);
    if (!element) {
      return
    }

    this.dragPosition = {
      x: element.offsetLeft - 86,
      y: element.offsetTop - 74
    }
    this.savePos(id);
  }

  private savePos(cellId: string) {
    const pos = cellId.split('.').map((a)=>{return Number(a)});
    this.config.row = pos[0];
    this.config.col = pos[1];
    this.saveTileData();
  }

  private saveTileData() {
    this.tilesService.updateTileData(this.config);
  }

  public rotate() {
    this.config.rotation++;
    if (this.config.rotation >= 6) {
      this.config.rotation = 0;
    }
    this.rotation = (this.config.rotation * 60) + 'deg';
    this.saveTileData();
  }

  public delete() {
    this.tilesService.deleteTile(this.config.id);
  }

  public editTile() {
    let dialogRef = this.dialog.open(EditDialogComponent, {
      height: '400px',
      width: '100%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      // if (result) {
      //   this.tilesService.registerNewTile({
      //     row: data.row,
      //     col: data.col,
      //     id: this.generateGuid(),
      //     tileId: result,
      //     cubes: [0,0,0,0,0,0,0],
      //     rotation: 0,
      //   });
      // }
    });
  }
}

