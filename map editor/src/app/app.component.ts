import {Component, OnInit} from '@angular/core';
import {TilesService} from "./service/tiles.service";
import * as htmlToImage from 'html-to-image';
import {MatDialog} from "@angular/material/dialog";
import {SelectionDialogComponent} from "./components/selection-dialog/selection-dialog.component";
import {ImportExportDialogComponent} from "./components/import-export-dialog/import-export-dialog.component";
import {ConfigService} from "./service/config.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public tilesPerRow = 5;
  public tilesPerColumn = 5;

  public tileContainerHeight = '200px';
  public tileContainerWidth = '200px';
  public rows = Array(this.tilesPerRow * 3);
  public columns = Array(this.tilesPerColumn * 3);

  public tileList:any = [];

  public loaded = false;

  constructor(public tilesService: TilesService, public dialog: MatDialog, private configService: ConfigService) {
    configService.load().then(() => {
      this.loaded = true;
    });
  }

  ngOnInit() {
    this.tilesService.tilesUpdated.subscribe((val) => {
      this.setTileContainerDimensions();
    });
  }

  private setTileContainerDimensions() {
    let maxRowId = 0;
    let maxColId = 0;
    this.tilesService.tileList.forEach((val) => {
      if (val.row > maxRowId) {
        maxRowId = val.row
      }
      if (val.col > maxColId) {
        maxColId = val.col
      }
    });

    maxRowId++;
    maxColId++;
    this.tileContainerHeight = (((maxRowId + 1) * 100) + (maxRowId * -26)) + 'px';
    this.tileContainerWidth = (((maxColId + 1) * 86)) + 'px';
  }

  public createTile(data: any) {
    let dialogRef = this.dialog.open(SelectionDialogComponent, {
      height: '400px',
      width: '100%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tilesService.registerNewTile({
          row: data.row,
          col: data.col,
          id: this.generateGuid(),
          tileId: result,
          cubes: [0,0,0,0,0,0,0],
          hero: [0,0,0,0,0,0,0],
          rotation: 0,
        });
      }
    });
  }

  importExport() {
    let dialogRef = this.dialog.open(ImportExportDialogComponent, {
      height: '400px',
      width: '100%',
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

  public download(dataurl: any, filename: string) {
    const link = document.createElement("a");
    link.href = dataurl;
    link.download = filename;
    link.click();
  }

  generateImage(){
    let node:any = document.getElementById('tilesContainer');
    htmlToImage.toPng(node)
      .then( (dataUrl) => {
        this.download(dataUrl, `scenario-map-${new Date().getTime()}.png`)
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  }

  clearGrid() {
    this.tilesService.clearGrid();
  }

  changeRows($event: any) {
    if (!$event.target.value) {
      return
    }
    this.rows = Array(parseInt($event.target.value))
  }

  changeCols($event: any) {
    if (!$event.target.value) {
      return
    }
    this.columns = Array(parseInt($event.target.value))
  }

  generateRandomMap(r = 0 , c = 0) {
    console.log(this.tilesService.blockedCells);
    this.isFull();
    this.placeRandomTile();
    this.placeRandomTile();
    this.placeRandomTile();
    this.placeRandomTile();
    this.placeRandomTile();
    this.placeRandomTile();
    this.placeRandomTile();
  }

  isFull(r = 0 , c = 0) {
    const cellsInRange = new Set();
    for (let i = 1; i <= 10; i++) {

    }

    // create Set of all cells in range
    // do a set Difference with the blocked list
    // take the length of the result, subtract it from the blocked list size
    // if the remaining size is larger or equal then rows * cols then the grid is full
  }

  nothingDisconnected() {
    // check if a cell is connected to any other cell
    // make recursive so it keeps checking until nothing is disconnected.
  }

  placeRandomTile() {
    const row = this.random(2,11);
    const col = this.random(2,11);
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

  random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
