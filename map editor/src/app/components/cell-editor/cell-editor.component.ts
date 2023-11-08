import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-cell-editor',
  templateUrl: './cell-editor.component.html',
  styleUrls: ['./cell-editor.component.scss']
})
export class CellEditorComponent  implements OnInit {
  @Input({ required: true }) config: any = {};

  @Input({ required: true }) index = -1;
  @Output() saveData = new EventEmitter<any>();

  selectedHero = 0;
  heroes: any[] = [
    {value: '0', name: '- Hero -'},
    {value: '1', name: 'Catherine'},
    {value: '2', name: 'Solimyr'},
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

  ngOnInit() {
    this.selectedCube = this.config.cubes[this.index];
    this.selectedHero = this.config.hero[this.index];
  }

  selectHero(hero: any) {
    this.config.hero[this.index] = parseInt(hero);
    this.saveData.next(this.config);
  }

  selectCube(cube: any) {
    this.config.cubes[this.index] = parseInt(cube);
    this.saveData.next(this.config);
  }
}
