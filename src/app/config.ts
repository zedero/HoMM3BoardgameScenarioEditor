
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
    img: 'tile',
    expansionID: EXPANSION.CORE,
    groundType: GROUNDTYPE.GRASS
  }
};
