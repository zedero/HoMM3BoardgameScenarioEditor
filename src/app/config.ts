
export enum GROUNDTYPE {
  RANDOM,
  GRASS,
  DIRT,
  SUBTERRAIN
}

export enum GROUP {
  STARTINGTILE,
  RANDOM,
  FAR,
  NEAR,
  CENTER,
}

export enum EXPANSION {
  RANDOM,
  ALL,
  CORE,
  SG,
  TOWER,
  RAMPART,
  FORTRESS,
  INFERNO
}

export const tilesConfiguration = {
  'S1': {
    id: 'S1',
    img: 'S1',
    desc: 'Necropolis Starting tile',
    expansionID: EXPANSION.CORE,
    groundType: GROUNDTYPE.DIRT,
    group: GROUP.STARTINGTILE
  },
  'S2': {
    id: 'S2',
    img: 'S2',
    desc: 'Dungeon Starting tile',
    expansionID: EXPANSION.CORE,
    groundType: GROUNDTYPE.SUBTERRAIN,
    group: GROUP.STARTINGTILE
  },
  'S3': {
    id: 'S3',
    img: 'S3',
    desc: 'Castle Starting tile',
    expansionID: EXPANSION.CORE,
    groundType: GROUNDTYPE.GRASS,
    group: GROUP.STARTINGTILE
  },
  'S0': {
    id: 'S0',
    img: 'random-1',
    desc: 'Random Starting tile',
    expansionID: EXPANSION.RANDOM,
    groundType: GROUNDTYPE.RANDOM,
    group: GROUP.RANDOM
  },
  'F0': {
    id: 'F0',
    img: 'random-2-3',
    desc: 'Random Far Tile',
    expansionID: EXPANSION.RANDOM,
    groundType: GROUNDTYPE.RANDOM,
    group: GROUP.RANDOM
  },
  'N0': {
    id: 'N0',
    img: 'random-4-5',
    desc: 'Random Near Tile',
    expansionID: EXPANSION.RANDOM,
    groundType: GROUNDTYPE.RANDOM,
    group: GROUP.RANDOM
  },
  'C0': {
    id: 'C0',
    img: 'random-6-7',
    desc: 'Random Center Tile',
    expansionID: EXPANSION.RANDOM,
    groundType: GROUNDTYPE.RANDOM,
    group: GROUP.RANDOM
  },
  'C1': {
    id: 'C1',
    img: 'dragon-utopia',
    desc: 'Dragon Utopia',
    expansionID: EXPANSION.CORE,
    groundType: GROUNDTYPE.DIRT,
    group: GROUP.CENTER
  },
  // 'OB': {
  //   id: 'OB',
  //   img: 'obelisk',
  //   desc: 'Obelisk',
  //   expansionID: EXPANSION.CORE,
  //   groundType: GROUNDTYPE.DIRT,
  //   group: GROUP.CENTER
  // },
  'C2': {
    id: 'C2',
    img: 'grail',
    desc: 'Grail',
    expansionID: EXPANSION.CORE,
    groundType: GROUNDTYPE.DIRT,
    group: GROUP.CENTER
  }
};
