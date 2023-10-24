
export enum GROUNDTYPE {
  GRASS = 0,
}

export enum EXPANSION {
  CORE,
  TOWER,
  RAMPART,
  FORTRESS,
  INFERNO
}

export const tilesConfiguration = {
  'S1': {
    id: 'S1',
    img: 'tile',
    desc: 'Rampart Starting Tile',
    expansionID: EXPANSION.RAMPART,
    groundType: GROUNDTYPE.GRASS
  }
};
