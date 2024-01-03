import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from 'src/app/service/config.service';
import { RandomMapGenerationService } from 'src/app/service/random-map-generation.service';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent {
  private randomMapGenerationService: RandomMapGenerationService;
  public config: ConfigService;
  public sets;
  public expansionsFilter;
  public settings: any = {}
  public flip = [
    {name: "TOWN", desc: "town"},
    {name: "FAR", desc: "far"},
    {name: "NEAR", desc: "near"},
    {name: "CENTER", desc: "center"},
  ];
  public flipGroup;

  selectedMapSize = 'MEDIUM';
  mapSizeOptions: any[] = [
    {value: 'SMALL', name: 'S'},
    {value: 'MEDIUM', name: 'M'},
    {value: 'LARGE', name: 'L'},
  ];

  selectedPlayers = '2';
  playerOptions: any[] = [
    {value: '1', name: '1'},
    {value: '2', name: '2'},
    {value: '3', name: '3'},
    {value: '4', name: '4'},
    // {value: '5', name: '5'},
    // {value: '6', name: '6'},
    // {value: '7', name: '7'},
  ];

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    randomMapGenerationService: RandomMapGenerationService,
    config: ConfigService
  ) {
    this.config = config;
    this.randomMapGenerationService = randomMapGenerationService;
    this.settings = randomMapGenerationService.getSettings();
    this.selectedMapSize = this.settings.size;
    this.selectedPlayers = this.settings.playerCount;
    this.flipGroup = this._formBuilder.group({
      TOWN: this.settings.flipTownTiles,
      FAR: this.settings.flipFarTiles,
      NEAR: this.settings.flipNearTiles,
      CENTER: this.settings.flipCenterTiles,
    });
    this.sets = this._formBuilder.group(this.generateFormBuilderGroup(config.EXPANSION_FILTER_DESC));
    this.expansionsFilter = this.generateFilterList(config.EXPANSION, config.EXPANSION_FILTER_DESC);
  }

  toggleSetting(event) {
    this.settings.flipTownTiles = this.flipGroup.value.TOWN;
    this.settings.flipFarTiles = this.flipGroup.value.FAR;
    this.settings.flipNearTiles = this.flipGroup.value.NEAR;
    this.settings.flipCenterTiles = this.flipGroup.value.CENTER;
    this.saveSettings();
  }

  saveSettings() {
    this.randomMapGenerationService.setSettings(this.settings);
  }

  selectMapSize(size) {
    this.settings.size = size;
    this.saveSettings();
  }

  selectPlayerAmmount(ammount) {
    this.settings.playerCount = ammount;
    this.saveSettings();
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  close(id?: any): void {
    this.dialogRef.close(false);
  }

  generateRandomMap() {
    this.dialogRef.close(true);
  }

  saveFilterOptions() {
    this.config.saveFilterOptions(this.sets.value);
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
}
