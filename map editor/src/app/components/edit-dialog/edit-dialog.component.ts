import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {tilesConfiguration} from "../../config";
import {TilesService} from "../../service/tiles.service";

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent {
  public config: any;
  public image: string = "";

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public tilesService: TilesService
  ) {
    this.config = data;
    this.setImage();
  }

  onNoClick = () => {
    this.dialogRef.close(this.config);
  }

  close(): void {
    this.dialogRef.close(this.config);
  }

  private setImage() {
    if (tilesConfiguration[this.config.tileId]) {
      this.image = tilesConfiguration[this.config.tileId].img;
    } else {
      this.image = 'default'
    }
  }

  update = (data) => {
    this.config = data;
    this.tilesService.updateTileData(this.config);
  }
}
