import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
// import { TilesService } from './tiles.service';
import { TilesService } from './tiles.service';
import { Helper } from '../utility/helper';


export class TilePlacement {

  constructor(public tilesService: TilesService, private config: ConfigService, private calc: Helper) {

  }

  public placeLayered() {
    const tiles = [...this.tilesService.tileList];
    // get all towns
    const towns = tiles.filter((tile) => {
      if (this.config.getGroupById(tile.tileId) === this.config.GROUP.STARTINGTILE || tile.tileId === "S0") {
        return tile;
      }
    });

    const test = () => {
      const allTowns = new Set();
      const possibleFarTiles = new Map();
      const possibleNearTiles = new Map();

      tiles.map((tile) => {
        if (this.config.getGroupById(tile.tileId) === this.config.GROUP.STARTINGTILE || tile.tileId === "S0") {
          allTowns.add(tile.row + '.' + tile.col);
        }
      })

      towns.forEach((town) => {
        this.calc.getNeighbours(tiles, [town]).map(tile => {
          const id = tile.row + '.' + tile.col;
          if (!allTowns.has(id)) {
            possibleFarTiles.set(id, tile);
            tile.tileId = "F0";
            this.tilesService.updateTileData(tile)
          }
        })
      })

      possibleFarTiles.forEach((town) => {
        this.calc.getNeighbours(tiles, [town]).map(tile => {
          const id = tile.row + '.' + tile.col;
          if (!allTowns.has(id) && !possibleFarTiles.has(id)) {
            possibleNearTiles.set(id, tile);
            tile.tileId = "N0";
            this.tilesService.updateTileData(tile)
          }
        })
      })
      // console.log('T', allTowns);
      // console.log('F', possibleFarTiles);
      // console.log('N', possibleNearTiles);
    }

    test();
  }

  placeFew(settings) {
    const tiles = [...this.tilesService.tileList];
    const towns = tiles.filter((tile) => {
      if (this.config.getGroupById(tile.tileId) === this.config.GROUP.STARTINGTILE || tile.tileId === "S0") {
        return tile;
      }
    });

    towns.forEach((town) => {
      const neighbours = this.calc.getNeighbours(tiles, [town]);
      const randomNeighbour = this.random(0, neighbours.length-1);
      neighbours[randomNeighbour].tileId = "F0";
      this.tilesService.updateTileData(neighbours[randomNeighbour]);
    })

    const farTiles = tiles.filter((tile) => {
      if (tile.tileId === "F0") {
        return tile;
      }
    });

    farTiles.forEach((town) => {
      const neighbours = this.calc.getNeighbours(tiles, [town]);
      const tile = neighbours.find((neightbour) => neightbour.tileId !== "S0" && neightbour.tileId !== "F0")
      if (!tile) {
        console.log(neighbours, tile)
        return;
      }
      tile.tileId = "N0";
      this.tilesService.updateTileData(tile);
    })
  }



  private random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
