import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {tilesConfiguration} from "../../config";
import { GROUP } from '../../config'
import {FormBuilder} from '@angular/forms';
import {EXPANSION} from '../../config'
import {ConfigService} from "../../service/config.service";

@Component({
  selector: 'app-selection-dialog',
  templateUrl: './selection-dialog.component.html',
  styleUrls: ['./selection-dialog.component.scss'],
})
export class SelectionDialogComponent {
  public tilesConfiguration = Object.values(tilesConfiguration);
  public GROUP;
  public sets = this._formBuilder.group({
    RANDOM: true,
    CORE: true,
    TOWER: true,
    RAMPART: true,
    FORTRESS: true,
    INFERNO: true
  });
  public EXPANSION;

  private config: ConfigService;

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    config: ConfigService,
  ) {
    this.config = config;
    this.GROUP = config.GROUP;
    this.EXPANSION = config.EXPANSION
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  close(id?: any): void {
    this.dialogRef.close(id);
  }

  getExpansionSelection() {
    const selectedExpansions = new Set();
    Object.entries(this.sets.value).map((entry) => {
      if (entry[1]) {
        selectedExpansions.add(EXPANSION[entry[0]]);
      }
    });
    return selectedExpansions;
  }

  getGroup(config: any, groupEnum: number) {
    const selectedExpansionsIDs = this.getExpansionSelection()
    return config.filter((item) => {
      return item.group === groupEnum && selectedExpansionsIDs.has(item.expansionID);
    });
  }

}
