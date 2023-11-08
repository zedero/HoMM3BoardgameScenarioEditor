import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public GROUNDTYPE: any = {
    RANDOM: 0,
    GRASS: 1,
    CURSED: 2,
  }

  public GROUP: any = {
    STARTINGTILE: 0
  }

  public EXPANSION: any = {
    CORE: 0,
  }

  public TILES: any = {
    'S1': {
      id: 'S1',
      img: 'S1',
      desc: 'Necropolis Starting tile',
      expansionID: this.EXPANSION.CORE,
      groundType: this.GROUNDTYPE.CURSED,
      group: this.GROUP.STARTINGTILE
    },
  }

  constructor(private http: HttpClient) {
    this.GROUNDTYPE = this.objToEnum(this.GROUNDTYPE);
    this.GROUP = this.objToEnum(this.GROUP);
    this.EXPANSION = this.objToEnum(this.EXPANSION);
  }

  objToEnum(obj: any) {
    const res = Object.entries(obj).map(
      ([key, val]) => { return [val, key]; }
    );
    return {...obj, ...Object.fromEntries(res)}
  }

  load() {
    return new Promise((resolve) => {
      this.http.get('assets/json/config.json').subscribe((res) => {
        this.parseData(res);
        resolve(true);
      },(error) => {
        console.warn('Falling back to hardcoded data due to error: ', error)
        resolve(false);
      });
    })
  }

  parseData(data) {
    this.GROUNDTYPE = this.arrayToEnum(data.GROUNDTYPE);
    this.GROUP = this.arrayToEnum(data.GROUP);
    this.EXPANSION = this.arrayToEnum(data.EXPANSION);
    this.TILES = this.tileJsonToData(data.TILES);
  }

  arrayToEnum(arr: Array<any>) {
    const result = {};
    arr.forEach((entry, index) => {
      result[entry] = index;
      result[index] = entry;
    })
    return result;
  }

  tileJsonToData(data: any) {
    const result = Object.entries(data).map(([key, val]: [string, any]) => {
      val.expansionID = this.EXPANSION[val.expansionID.split(".")[1]];
      val.groundType = this.GROUNDTYPE[val.groundType.split(".")[1]];
      val.group = this.GROUP[val.group.split(".")[1]];
      return [key, val];
    });

    return Object.fromEntries(result);
  }

}
