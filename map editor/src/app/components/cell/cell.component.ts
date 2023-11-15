import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { RandomMapGenerationService } from 'src/app/service/random-map-generation.service';
import { TilesService } from 'src/app/service/tiles.service';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit{
  @Input() rowId = -1;
  @Input() colId = -1;
  @Output() addNewTile = new EventEmitter<any>();

  constructor(public tilesService: TilesService, public randomMapService: RandomMapGenerationService) {

  }

  public guid = this.generateGuid();

  ngOnInit() {
    this.guid = this.generateGuid();
  }

  public create(event: any) {
    this.addNewTile.next({row: this.rowId, col: this.colId});
  }

  public generateGuid() {
    return this.rowId + '.' + this.colId;
  }

  public isBlocked() {
    return !!this.tilesService.blockedCells.has(this.generateGuid());
  }

  public isConnected() {
    return !!this.randomMapService.connected.has(this.generateGuid());
  }
}
