import {Component, NgZone, OnInit} from '@angular/core';
import {TilesService} from "./service/tiles.service";
import * as htmlToImage from 'html-to-image';
import {MatDialog} from "@angular/material/dialog";
import {SelectionDialogComponent} from "./components/selection-dialog/selection-dialog.component";
import {ImportExportDialogComponent} from "./components/import-export-dialog/import-export-dialog.component";
import {ConfigService} from "./service/config.service";
import { RandomMapGenerationService, RandomMapSettings } from './service/random-map-generation.service';
import { SettingsDialogComponent } from './components/settings-dialog/settings-dialog.component';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public tilesPerRow = 7;
  public tilesPerColumn = 7;

  public tileContainerHeight = '200px';
  public tileContainerWidth = '200px';
  public rows = Array(this.tilesPerRow * 3);
  public columns = Array(this.tilesPerColumn * 3);
  public moveMenuVisible = false;
  public loading: boolean = false;

  public tileList:any = [];

  public loaded = false;

  constructor(
    public tilesService: TilesService,
              public dialog: MatDialog,
              private configService: ConfigService,
              private randomMapGenerationService: RandomMapGenerationService,
              public zone: NgZone
  ) {
    configService.load().then(() => {
      this.loaded = true;
    });
  }

  ngOnInit() {
    this.tilesService.rows = this.rows;
    this.tilesService.columns = this.columns;
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

  openSettings(event: any) {
    event.preventDefault();
    event.stopPropagation();

    let dialogRef = this.dialog.open(SettingsDialogComponent, {
      height: '400px',
      width: '100%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.generateRandomMap();
      }
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
    this.rows = Array(parseInt($event.target.value));
    this.tilesService.rows = this.rows;
  }

  changeCols($event: any) {
    if (!$event.target.value) {
      return
    }
    this.columns = Array(parseInt($event.target.value))
    this.tilesService.columns = this.columns;
  }

  toggleMoveMenu() {
    this.moveMenuVisible = !this.moveMenuVisible;
  }
  moveUpLeft() {
    this.tilesService.moveAllUpLeft();
  }
  moveUpRight() {
    this.tilesService.moveAllUpRight();
  }
  moveLeft() {
    this.tilesService.moveAllLeft();
  }
  moveRight() {
    this.tilesService.moveAllRight();
  }
  moveDownRight() {
    this.tilesService.moveAllDownRight();
  }
  moveDownLeft() {
    this.tilesService.moveAllDownLeft();
  }

  generateRandomMap() {
    const settings = this.randomMapGenerationService.getGridSizeFromSetting();
    this.changeRows({
      target: {
        value: settings.grid.rows + 2
      }
    })
    this.changeCols({
      target: {
        value: settings.grid.cols + 2
      }
    })
    this.loading = true;
    setTimeout(() => {
      this.randomMapGenerationService.generateRandomMap();
      this.loading = false;
    }, 100)
  }

}
