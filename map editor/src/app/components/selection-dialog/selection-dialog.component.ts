import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder} from '@angular/forms';
import {ConfigService} from "../../service/config.service";
import { TilesService } from 'src/app/service/tiles.service';

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
  public placedFilter;
  public config: ConfigService;
  public tilesLeft: any;

  constructor(
    public tilesService: TilesService,
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
    this.placedFilter = this.getPlacedTiles();
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

    Object.entries(this.config.filterOptions).forEach(([key,val]) => {
      if (group[key]) {
        group[key] = val;
      }
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

  saveFilterOptions() {
    this.config.saveFilterOptions(this.sets.value);
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

  getLeft(group: any) {
    if (group === "RANDOM") {
      // const t = Object.entries(this.tilesLeft).filter(([key, val]) => {
      //   return !key.includes('_MAX')
      // }).reduce((acc: number, [key, val]) => {
      //   // @ts-ignore
      //   return acc += val
      // }, 0)
      // console.log(t)


      return {
        current: Object.entries(this.tilesLeft).filter(([key, val]) => {
          return !key.includes('_MAX')
        }).reduce((acc: number, [key, val]) => {
          // @ts-ignore
          return acc += val
        }, 0),
        total: Object.entries(this.tilesLeft).filter(([key, val]) => {
          return key.includes('_MAX')
        }).reduce((acc: number, [key, val]) => {
          // @ts-ignore
          return acc += val
        }, 0)
      }
    }
    return {
      current: this.tilesLeft[group.replace('STARTINGTILE', 'TOWN')],
      total: this.tilesLeft[group.replace('STARTINGTILE', 'TOWN') + '_MAX']
    };
  }

  getPlacedTiles() {
    this.getTilesLeft();
    const placed = new Set();
    this.tilesService.tileList.forEach((tile) => {
      if (this.config.EXPANSION[this.config.TILES[tile.tileId].expansionID] !== "RANDOM") {
        placed.add(tile.tileId)
      }
    });
    return placed;
  }

  getTilesLeft() {
    const totals = {
      TOWN: 0,
      FAR: 0,
      NEAR: 0,
      CENTER: 0,
      TOWN_MAX: 0,
      FAR_MAX: 0,
      NEAR_MAX: 0,
      CENTER_MAX: 0,
    }
    this.getExpansionSelection().forEach((selectedExpansion: any) => {
      const content = this.config.EXPANSION_CONTENTS[this.config.EXPANSION[selectedExpansion]];
      totals.TOWN += content.TOWN;
      totals.FAR += content.FAR;
      totals.NEAR += content.NEAR;
      totals.CENTER += content.CENTER;
      totals.TOWN_MAX += content.TOWN;
      totals.FAR_MAX += content.FAR;
      totals.NEAR_MAX += content.NEAR;
      totals.CENTER_MAX += content.CENTER;
    });

    this.tilesService.tileList.forEach((tile) => {
      const groupId = this.config.GROUP[this.config.TILES[tile.tileId].group];
      if (this.config.GROUP[groupId] === this.config.GROUP.STARTINGTILE) {
        totals.TOWN--;
      }
      if (this.config.GROUP[groupId] === this.config.GROUP.FAR) {
        totals.FAR--;
      }
      if (this.config.GROUP[groupId] === this.config.GROUP.NEAR) {
        totals.NEAR--;
      }
      if (this.config.GROUP[groupId] === this.config.GROUP.CENTER) {
        totals.CENTER--;
      }
      if (this.config.GROUP[groupId] === this.config.GROUP.RANDOM) {
        if (tile.tileId === "S0") {
          totals.TOWN--;
        }
        if (tile.tileId === "F0") {
          totals.FAR--;
        }
        if (tile.tileId === "N0") {
          totals.NEAR--;
        }
        if (tile.tileId === "C0") {
          totals.CENTER--;
        }
      }
    })
    this.tilesLeft = totals;
   return totals;
  }

  getGroup(config: any, groupEnum: number) {
    const selectedExpansionsIDs = this.getExpansionSelection();
    const left = this.getTilesLeft();

    if ( groupEnum === this.config.GROUP.RANDOM ) {
      return config.filter((item) => {
        return item.group === groupEnum && selectedExpansionsIDs.has(item.expansionID) && item.id !== "PLACEHOLDER";
      }).filter((item) => {
        if (item.id === "S0" && left.TOWN > 0) {
          return true
        }
        if (item.id === "F0" && left.FAR > 0) {
          return true
        }
        if (item.id === "N0" && left.NEAR > 0) {
          return true
        }
        if (item.id === "C0" && left.CENTER > 0) {
          return true
        }
        return false;
      })
    }

    return config.filter((item) => {
      return item.group === groupEnum && selectedExpansionsIDs.has(item.expansionID) && item.id !== "PLACEHOLDER";
    }).filter((item) => {
      // check if tile has been placed already
      return !this.placedFilter.has(item.id);
    }).filter((item) => {
      // check if there are tiles left of this sort.
      return left[this.config.GROUP[item.group].replace('STARTINGTILE', 'TOWN')] > 0;
    });
  }

}
