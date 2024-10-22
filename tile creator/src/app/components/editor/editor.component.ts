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
    {value: 'orepit-grass', name: 'Ore pit (Grass)'},
    {value: 'orepit-lava', name: 'Ore pit (Lava)'},
    {value: 'orepit-swamp', name: 'Ore pit (Swamp)'},
    {value: 'sawmill', name: 'Sawmill'},
    {value: 'gempond', name: 'Gem Pond'},
    {value: 'gempond-snow', name: 'Gem Pond (Snow)'},
    {value: 'campfire', name: 'Campfire'},
    {value: 'campfire-chest', name: 'Campfire (chest dice)'},
    {value: 'tavern', name: 'Tavern'},
    {value: 'university', name: 'University'},
    {value: 'crypt', name: 'Crypt'},
    {value: 'hillfort', name: 'Hillfort'},
    {value: 'wagon', name: 'Wagon'},
    {value: 'fountain-of-youth', name: 'Fountain of Youth'},
    {value: 'pandora', name: "Pandora's Box"},
    {value: 'prison', name: "Prison"},
    {value: 'shrine-gesture', name: "Shrine of Magic Gesture"},
    {value: 'magicshrine', name: "Shrine of Magic Incantation"},
    {value: 'mystical-garden', name: "Mystical Garden"},
    {value: 'warriors-tomb', name: "Warriors Tomb"},
    {value: 'temple', name: "Temple"},
    {value: 'tree-of-knowledge', name: "Tree of Knowledge"},
    {value: 'grail', name: 'Grail'},
    {value: 'dragon-utopia', name: 'Dragon Utopia'},
    {value: 'stables', name: 'Stables'},
    {value: 'observatory', name: 'Observatory'},
    {value: 'observatory-snow', name: 'Observatory (Snow)'},
    {value: 'tradingpost', name: 'Tradingpost'},
    {value: 'skeleton', name: 'Skeleton'},
    {value: 'windmill', name: 'Windmill'},
    {value: 'chest', name: 'Chest'},
    {value: 'learning-stone', name: 'Learning Stone'},
    {value: 'witchhut', name: 'Witch Hut'},
    {value: 'sanctuary', name: 'Sanctuary'},
    {value: 'waterwheel', name: 'Water Wheel'},
    {value: 'marketoftime', name: 'Market of Time'},
    {value: 'obelisk', name: 'Obelisk'},
    {value: 'magicspring', name: 'Magic Spring'},
    {value: 'staraxis', name: 'Star Axis'},
    {value: 'scholar', name: 'Scholar'},
    {value: 'warmachine', name: 'War Machine Factory'},


    {value: 'random-necro', name: 'Random Town Necro'},
    {value: 'random-castle', name: 'Random Town Castle'},
    {value: 'random-tower', name: 'Random Town Tower'},
    {value: 'random-dungeon', name: 'Random Town Dungeon'},
    {value: 'random-inferno', name: 'Random Town Inferno'},
    {value: 'random-rampart', name: 'Random Town Rampart'},
    {value: 'random-fortress', name: 'Random Town Fortress'},
    {value: 'random-town', name: 'Random Town'},
    {value: 'necropolis', name: 'Necropolis'},
    {value: 'dungeon', name: 'Dungeon'},
    {value: 'castle', name: 'Castle'},
    {value: 'tower', name: 'Tower'},
    {value: 'rampart', name: 'Rampart'},
    {value: 'fortress', name: 'Fortress'},
    {value: 'inferno', name: 'Inferno'},
    {value: 'crystalcavern', name: 'Crystal Caverns'},
    {value: 'alchemistlab', name: "Alchemist's Lab"},
    {value: 'alchemistlab-snow', name: "Alchemist's Lab (Snow)"},
    {value: 'sulfurdune', name: 'Sulfur Dune'},
    {value: 'goldmine', name: 'Gold Mine'},
    {value: 'goldmine-snow', name: 'Gold Mine (Snow)'},
    {value: 'goldmine-barren', name: 'Gold Mine (Barren)'},
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

  @Input({ required: true }) terrain = '';

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

  getBlockedVisualImage() {
    return '-' + this.terrain;
  }

}
