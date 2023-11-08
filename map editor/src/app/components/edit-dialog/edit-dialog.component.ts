import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TilesService} from "../../service/tiles.service";
import {ConfigService} from "../../service/config.service";

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent {
  public config: any;
  public image: string = "";
  public desc = '';

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public tilesService: TilesService,
    public configService: ConfigService
  ) {
    this.config = data;
    this.setImage();
    this.setDesc();
  }

  onNoClick = () => {
    this.dialogRef.close(this.config);
  }

  close(): void {
    this.dialogRef.close(this.config);
  }

  private setImage() {
    if (this.configService.TILES[this.config.tileId]) {
      this.image = this.configService.TILES[this.config.tileId].img;
    } else {
      this.image = 'default'
    }
  }

  private setDesc() {
    if (this.configService.TILES[this.config.tileId]) {
      this.desc = this.configService.TILES[this.config.tileId].desc;
    } else {
      this.desc = '';
    }
  }

  update = (data) => {
    this.config = data;
    this.tilesService.updateTileData(this.config);
  }
}
