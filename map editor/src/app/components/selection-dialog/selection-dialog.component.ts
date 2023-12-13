import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder} from '@angular/forms';
import {ConfigService} from "../../service/config.service";

@Component({
  selector: 'app-selection-dialog',
  templateUrl: './selection-dialog.component.html',
  styleUrls: ['./selection-dialog.component.scss'],
})
export class SelectionDialogComponent {
  public tilesConfiguration;
  public GROUP;
  public EXPANSION;
  public sets;
  public expansionsFilter;

  public config: ConfigService;

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    config: ConfigService,
  ) {
    this.config = config;
    this.GROUP = config.GROUP;
    this.EXPANSION = config.EXPANSION
    this.tilesConfiguration = Object.values(this.config.TILES);

    this.sets = this._formBuilder.group(this.generateFormBuilderGroup(config.EXPANSION_FILTER_DESC));
    this.expansionsFilter = this.generateFilterList(config.EXPANSION, config.EXPANSION_FILTER_DESC);
  }

  enumToList(obj: any) {
    return Object.keys(obj).filter((val) => {
      return isNaN(parseInt(val))
    })
  }

  generateFormBuilderGroup(descObj: any) {
    const group = {}
    Object.keys(descObj).forEach((val: any) => {
     group[val] = true;
    })
    return group;
  }

  generateFilterList(filterObj: any, descObj: any) {
    // change enum obj to string list of keys
    const filterList = Object.keys(filterObj).filter((val) => {
      return isNaN(parseInt(val))
    });
    return filterList.map((val: any) => {
      return {
        name: val,
        desc: descObj[val]
      }
    });
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
        selectedExpansions.add(this.EXPANSION[entry[0]]);
      }
    });
    return selectedExpansions;
  }

  getGroup(config: any, groupEnum: number) {
    const selectedExpansionsIDs = this.getExpansionSelection();
    return config.filter((item) => {
      return item.group === groupEnum && selectedExpansionsIDs.has(item.expansionID) && item.id !== "PLACEHOLDER";
    });
  }

}
