import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent {
  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

  }

  public settings: any = {
    nrOfPlayers: 2,
    mapSize: 'MEDIUM'
  }

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

  selectMapSize($event) {
    console.log($event)
  }

  selectPlayerAmmount($event) {
    console.log($event)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  close(id?: any): void {
    this.dialogRef.close(id);
  }
}
