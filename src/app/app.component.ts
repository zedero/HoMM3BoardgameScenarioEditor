import {Component, OnInit} from '@angular/core';
import {TilesService} from "./service/tiles.service";
import * as htmlToImage from 'html-to-image';
import {MatDialog} from "@angular/material/dialog";
import {SelectionDialogComponent} from "./components/selection-dialog/selection-dialog.component";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private tilePerRow = 5;
  private tilesPerColumn = 5;
  public rows = Array(this.tilePerRow * 3);
  public columns = Array(this.tilesPerColumn * 3);

  public tileList:any = [];

  constructor(public tilesService: TilesService, public dialog: MatDialog) {}

  ngOnInit() {
    // this.createTile({row: 3, col: 4});
  }

  public createTile(data: any) {
    let dialogRef = this.dialog.open(SelectionDialogComponent, {
      height: '400px',
      width: '100%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);

      this.tilesService.registerNewTile({
        row: data.row,
        col: data.col,
        id: this.generateGuid(),
        tileId: 'S1',
        cubes: [0,0,0,0,0,0,0],
        rotation: 0,
      });
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
}
