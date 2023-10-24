import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {TilesService} from "../../service/tiles.service";
import {tilesConfiguration} from "../../config";
import {CommonModule, NgFor} from "@angular/common";

@Component({
  selector: 'app-selection-dialog',
  templateUrl: './selection-dialog.component.html',
  styleUrls: ['./selection-dialog.component.scss'],
  // standalone: true,
})
export class SelectionDialogComponent {
  public tilesConfiguration = Object.values(tilesConfiguration);

  constructor(
    public dialogRef: MatDialogRef<SelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {


  }

  onNoClick(): void {
    this.dialogRef.close('S1');
  }

  close(id?: any): void {
    console.log(tilesConfiguration)
    this.dialogRef.close(id);
  }
}
