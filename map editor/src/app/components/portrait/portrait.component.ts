import {Component, Input} from '@angular/core';
import {ConfigService} from "../../service/config.service";

@Component({
  selector: 'app-portrait',
  templateUrl: './portrait.component.html',
  styleUrls: ['./portrait.component.scss']
})
export class PortraitComponent {
  public image = '';
  public configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
  }


  @Input()
  public set hero(id: number | string) {
    const img = this.configService.PORTRAITS[id]?.image;
    if (!!img) {
      this.image = img;
    } else {
      this.image = ''
    }
  }
}
