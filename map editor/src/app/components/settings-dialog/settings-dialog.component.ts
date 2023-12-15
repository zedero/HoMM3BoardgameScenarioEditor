import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RandomMapGenerationService } from 'src/app/service/random-map-generation.service';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent {
  private randomMapGenerationService: RandomMapGenerationService;
  public settings: any = {}
  public flip = [
    {name: "TOWN", desc: "town"},
    // {name: "FAR", desc: "far"},
    // {name: "NEAR", desc: "near"},
    {name: "CENTER", desc: "center"},
  ];
  public flipGroup;

  selectedMapSize = 'MEDIUM';
  mapSizeOptions: any[] = [
    {value: 'SMALL', name: 'Small'},
    {value: 'MEDIUM', name: 'Medium'},
    {value: 'LARGE', name: 'Large'},
  ];

  selectedPlayers = '2';
  playerOptions: any[] = [
    {value: '1', name: 'Solo'},
    {value: '2', name: '2 Players'},
    {value: '3', name: '3 Players'},
    {value: '4', name: '4 Players'},
    {value: '5', name: '5 Players'},
    {value: '6', name: '6 Players'},
    {value: '7', name: '7 Players'},
  ];

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    randomMapGenerationService: RandomMapGenerationService
  ) {
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
}
