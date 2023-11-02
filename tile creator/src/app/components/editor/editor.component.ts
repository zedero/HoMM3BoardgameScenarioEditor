import {Component, EventEmitter, Input, Output} from '@angular/core';

export type SaveData = {
  cell: number,
  enemy: string,
  icon: string,
  blocked: boolean,
  border: boolean
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {
  uuid: any = this.generateUUID();

  toRoman: any = ['','I','II','III','IV','V','VI','VII']
  enemies: any[] = [
    {value: '0', name: '- Enemy -'},
    {value: '1', name: 'Level 1'},
    {value: '2', name: 'Level 2'},
    {value: '3', name: 'Level 3'},
    {value: '4', name: 'Level 4'},
    {value: '5', name: 'Level 5'},
    {value: '6', name: 'Level 6'},
    {value: '7', name: 'Level 7'},
  ];
  enemySelected: string = '0';

  icons: any = [
    {value: '', name: '- Locations -'},
    {value: 'orepit', name: 'Ore pit'},
    {value: 'sawmill', name: 'Sawmill'},
    {value: 'campfire', name: 'Campfire'},
    {value: 'wagon', name: 'Wagon'},


    {value: 'necropolis', name: 'Necropolis'},
    {value: 'dungeon', name: 'Dungeon'},
    {value: 'castle', name: 'Castle'},
    {value: 'tower', name: 'Tower'},
    {value: 'rampart', name: 'Rampart'},
    {value: 'fortress', name: 'Fortress'},
    {value: 'inferno', name: 'Inferno'},
    // {value: 'crystalCaverns', name: 'Crystal Caverns'},
    // {value: 'alchemistLab', name: "Alchemist's Lab"},
    // {value: 'sulfurDune', name: 'Sulfur Dune'},
    // {value: 'goldMine', name: 'Gold Mine'},
  ];
  iconSelected: string = '';

  blockedSpace: boolean = false;
  blockedBorder: boolean = false;

  _cellData:SaveData = {
    cell: 0,
    enemy: '0',
    icon: '',
    blocked: false,
    border: false
  }


  @Input({ required: true }) tileName = '';

  @Input({ required: true }) set cellData(value: SaveData) {
    if(!value) {
      return
    }
    this._cellData = value;
    this.enemySelected = value.enemy;
    this.blockedSpace = value.blocked;
    this.blockedBorder = value.border;
    this.iconSelected = value.icon;
  }

  @Output() saveData = new EventEmitter<SaveData>();

  selectEnemy(enemy: any) {
    this.saveChanges();
  }

  selectIcon(icon: any) {
    this.saveChanges();
  }

  selectBlockedField(state: any) {
    this.saveChanges();
  }

  selectBlockedBorder(state: any) {
    this.saveChanges();
  }

  getBorderClass() {
    return 'border_' + this._cellData.cell;
  }

  private generateUUID() {
    return (new Date().getTime() + Math.floor(Math.random() * 1000000000000 )).toString(16);
  }

  saveChanges() {
    this.saveData.next({
      cell: this._cellData.cell,
      enemy: this.enemySelected,
      icon: this.iconSelected,
      blocked: this.blockedSpace,
      border: this.blockedBorder
    })
  }

}
