import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TilesService} from "../../service/tiles.service";

@Component({
  selector: 'app-import-export-dialog',
  templateUrl: './import-export-dialog.component.html',
  styleUrls: ['./import-export-dialog.component.scss']
})
export class ImportExportDialogComponent {
  // tilesService: TilesService;
  public exportValue = '';
  public importValue = '';

  constructor(
    public dialogRef: MatDialogRef<ImportExportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public tilesService: TilesService
  ) {
      this.tilesService = tilesService;
      this.exportValue = tilesService.export();
  }

  onNoClick = () => {
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  import() {
    this.tilesService.import(this.importValue).then(() => {
      this.close();
    }).catch(() => {
      alert('Invalid savedata')
    });
  }
}
