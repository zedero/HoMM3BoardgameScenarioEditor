import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfigService} from "../../service/config.service";

@Component({
  selector: 'app-cell-editor',
  templateUrl: './cell-editor.component.html',
  styleUrls: ['./cell-editor.component.scss']
})
export class CellEditorComponent  implements OnInit {
  @Input({ required: true }) config: any = {};

  @Input({ required: true }) index = -1;
  @Output() saveData = new EventEmitter<any>();


  selectedHero = '';
  heroes: any[] = [
    {value: '0', name: '- No Hero -', faction: "CASTLE"},
  ];

  selectedCube = 0;
  cubes: any[] = [
    {value: '0', name: '- No Cube -'},
    {value: '1', name: 'Black cube'},
    {value: '2', name: 'Necropolis cube'},
    {value: '3', name: 'Castle cube'},
    {value: '4', name: 'Dungeon cube'},
    {value: '5', name: 'Tower cube'},
    {value: '6', name: 'Rampart cube'},
    {value: '7', name: 'Fortress cube'},
    {value: '8', name: 'Inferno cube'},
  ];

  public configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
    this.createHeroesSelect();
  }

  createHeroesSelect() {
    this.heroes = Object.entries(this.configService.PORTRAITS)
      .sort((a: any,b: any) => {
        const one = a[1].faction;
        const two = b[1].faction;
        if (one < two) {
          return -1;
        }
        if (one > two) {
          return 1;
        }
        return 0;
      })
      .map(([key, val]: any) => {
        return {
          value: key,
          name: val.desc + ' - ' + this.configService.FACTIONS[val.faction],
          faction: val.faction
        }
      })

    this.heroes.unshift({value: '0', name: '- No Hero -'});
  }

  ngOnInit() {
    this.selectedCube = this.config.cubes[this.index];
    this.selectedHero = this.config.hero[this.index];
  }

  selectHero(hero: any) {
    this.config.hero[this.index] = hero;
    this.saveData.next(this.config);
  }

  selectCube(cube: any) {
    this.config.cubes[this.index] = parseInt(cube);
    this.saveData.next(this.config);
  }
}
