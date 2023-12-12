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
    this.dialogRef.close();
  }

  close(id?: any): void {
    this.dialogRef.close(id);
  }
}
