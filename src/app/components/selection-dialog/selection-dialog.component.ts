import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {tilesConfiguration} from "../../config";
import { GROUP } from '../../config'

@Component({
  selector: 'app-selection-dialog',
  templateUrl: './selection-dialog.component.html',
  styleUrls: ['./selection-dialog.component.scss'],
  // standalone: true,
})
export class SelectionDialogComponent {
  public tilesConfiguration = Object.values(tilesConfiguration);
  public GROUP;

  constructor(
    public dialogRef: MatDialogRef<SelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.GROUP = GROUP
  }

  onNoClick(): void {
    this.dialogRef.close('S1');
  }

  close(id?: any): void {
    console.log(tilesConfiguration)
    this.dialogRef.close(id);
  }

  getGroup(config: any, groupEnum: number) {

    return config.filter((item) => {
      return item.group === groupEnum;
    });
  }

}
