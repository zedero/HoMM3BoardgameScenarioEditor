
export enum GROUNDTYPE {
  RANDOM,
  GRASS,
  DIRT,
  SUBTERRAIN,
  SNOW,
  SWAMP,
  LAVA,
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
  '#S1': {
    id: '#S1',
    img: 'S0',
    desc: 'Tower Starting tile',
    expansionID: EXPANSION.TOWER,
    groundType: GROUNDTYPE.SNOW,
    group: GROUP.STARTINGTILE
  },
  'S4': {
    id: 'S4',
    img: 'S4',
    desc: 'Rampart Starting tile',
    expansionID: EXPANSION.RAMPART,
    groundType: GROUNDTYPE.GRASS,
    group: GROUP.STARTINGTILE
  },
  'S5': {
    id: 'S5',
    img: 'S5',
    desc: 'Fortress Starting tile',
    expansionID: EXPANSION.FORTRESS,
    groundType: GROUNDTYPE.SWAMP,
    group: GROUP.STARTINGTILE
  },
  'S6': {
    id: 'S6',
    img: 'S6',
    desc: 'Inferno Starting tile',
    expansionID: EXPANSION.INFERNO,
    groundType: GROUNDTYPE.LAVA,
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
    img: 'C1',
    desc: 'Dragon Utopia',
    expansionID: EXPANSION.CORE,
    groundType: GROUNDTYPE.DIRT,
    group: GROUP.CENTER
  },
  'C2': {
    id: 'C2',
    img: 'C2',
    desc: 'Grail',
    expansionID: EXPANSION.CORE,
    groundType: GROUNDTYPE.DIRT,
    group: GROUP.CENTER
  }
};
