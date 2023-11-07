import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.scss']
})
export class CubeComponent {
 public cubeId = 0;
 public cubeClass = ''

  @Input()
  public set cube(id: number) {
    this.cubeId = id;
    this.cubeClass = 'color-' + id;
  }
}
