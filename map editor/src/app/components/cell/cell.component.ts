import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit{

  @Input() rowId = -1;
  @Input() colId = -1;
  @Output() addNewTile = new EventEmitter<any>();

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
}
