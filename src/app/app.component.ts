import {Component, OnInit} from '@angular/core';
import {TilesService} from "./service/tiles.service";
import * as htmlToImage from 'html-to-image';


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

  constructor(public tilesService: TilesService) {}

  ngOnInit() {
    // this.createTile({row: 3, col: 4});
  }

  public createTile(data: any) {
    this.tilesService.registerNewTile({
      row: data.row,
      col: data.col,
      id: this.generateGuid(),
      tileId: 'S1',
      cubes: [0,0,0,0,0,0,0],
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
        console.log('dataUrl', dataUrl)
        let img = new Image();
        img.src = dataUrl;
        document.body.appendChild(img);
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  }
}
