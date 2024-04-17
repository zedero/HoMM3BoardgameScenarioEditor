import { Component } from '@angular/core';

export type Unit = {
  id: string;
  attack: number;
  defence: number;
  health: number;
  initiative: number;
  ranged: boolean;
  special: number[];
  upgradeFrom?: string;
  costs?: [number,number];
}

enum SPECIALS {
  "IGNORE_RETALIATION",
  "IGNORE_COMBAT_PENALTY_ADJACENT",
  "IGNORE_PARALYSIS",// TODO
  "CHANCE_TO_PARALYZE_ON_RETALIATION", // TODO
  "PARALYZE_ON_RETALIATION", // TODO
  "IGNORE_DEFENCE",
  "IGNORE_DAMAGE_FROM_SPECIALS", // TODO but not yet needed
  "DOUBLE_ATTACK_NON_ADJACENT", // TODO
  "REROLL_ZERO_ON_DICE",
  "REROLL_ON_OTHER_SPACE",
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public score: [string, number][] = [];

  public units: Unit[] = [{
    id: 'TROGLODYTES',
    attack: 2,
    defence: 1,
    health: 2,
    initiative: 4,
    ranged: false,
    special: [],
  },{
    id: 'TROGLODYTES_#PACK',
    attack: 3,
    defence: 1,
    health: 2,
    initiative: 5,
    ranged: false,
    special: [SPECIALS.IGNORE_PARALYSIS],
  },{
    id: 'HARPIES',
    attack: 2,
    defence: 0,
    health: 3,
    initiative: 6,
    ranged: false,
    special: [],
  },{
    id: 'HARPIES_#PACK',
    attack: 3,
    defence: 0,
    health: 3,
    initiative: 9,
    ranged: false,
    special: [SPECIALS.IGNORE_RETALIATION],
  },{
    id: 'EVIL_EYES',
    attack: 3,
    defence: 0,
    health: 3,
    initiative: 5,
    ranged: true,
    special: [],
  },{
    id: 'EVIL_EYES_#PACK',
    attack: 3,
    defence: 1,
    health: 3,
    initiative: 7,
    ranged: true,
    special: [SPECIALS.IGNORE_COMBAT_PENALTY_ADJACENT],
  },{
    id: 'MEDUSAS',
    attack: 3,
    defence: 1,
    health: 4,
    initiative: 5,
    ranged: true,
    special: [SPECIALS.CHANCE_TO_PARALYZE_ON_RETALIATION],
  },{
    id: 'MEDUSAS_#PACK',
    attack: 4,
    defence: 1,
    health: 4,
    initiative: 6,
    ranged: true,
    special: [SPECIALS.PARALYZE_ON_RETALIATION, SPECIALS.IGNORE_COMBAT_PENALTY_ADJACENT],
  },{
    id: 'MINOTAURS',
    attack: 4,
    defence: 2,
    health: 4,
    initiative: 6,
    ranged: false,
    special: [],
  },{
    id: 'MINOTAURS_#PACK',
    attack: 5,
    defence: 2,
    health: 4,
    initiative: 8,
    ranged: false,
    special: [],
  },{
    id: 'MANTICORES',
    attack: 5,
    defence: 1,
    health: 6,
    initiative: 7,
    ranged: false,
    special: [],
  },{
    id: 'MANTICORES_#PACK',
    attack: 5,
    defence: 1,
    health: 6,
    initiative: 11,
    ranged: false,
    special: [SPECIALS.IGNORE_DEFENCE],
  },{
    id: 'BLACK_DRAGONS',
    attack: 6,
    defence: 3,
    health: 8,
    initiative: 11,
    ranged: false,
    special: [],
  },{
    id: 'BLACK_DRAGONS_#PACK',
    attack: 8,
    defence: 3,
    health: 8,
    initiative: 15,
    ranged: false,
    special: [SPECIALS.IGNORE_DAMAGE_FROM_SPECIALS],
  },{
    id: 'HALBERDIERS',
    attack: 2,
    defence: 1,
    health: 2,
    initiative: 4,
    ranged: false,
    special: [],
  },{
    id: 'HALBERDIERS_#PACK',
    attack: 3,
    defence: 1,
    health: 2,
    initiative: 5,
    ranged: false,
    special: [],
  },{
    id: 'MARKSMEN',
    attack: 2,
    defence: 0,
    health: 2,
    initiative: 4,
    ranged: true,
    special: [],
  },{
    id: 'MARKSMEN_#PACK',
    attack: 2,
    defence: 0,
    health: 2,
    initiative: 6,
    ranged: true,
    special: [SPECIALS.DOUBLE_ATTACK_NON_ADJACENT],
  },{
    id: 'GRIFFINS',
    attack: 2,
    defence: 0,
    health: 4,
    initiative: 6,
    ranged: false,
    special: [],
  },{
    id: 'GRIFFINS_#PACK',
    attack: 3,
    defence: 0,
    health: 4,
    initiative: 9,
    ranged: false,
    special: [],
  },{
    id: 'CRUSADERS',
    attack: 3,
    defence: 2,
    health: 4,
    initiative: 5,
    ranged: false,
    special: [],
  },{
    id: 'CRUSADERS_#PACK',
    attack: 4,
    defence: 2,
    health: 4,
    initiative: 6,
    ranged: false,
    special: [SPECIALS.REROLL_ZERO_ON_DICE],
  },{
    id: 'ZEALOTS',
    attack: 3,
    defence: 1,
    health: 4,
    initiative: 4,
    ranged: true,
    special: [],
  },{
    id: 'ZEALOTS_#PACK',
    attack: 4,
    defence: 1,
    health: 5,
    initiative: 7,
    ranged: true,
    special: [SPECIALS.IGNORE_COMBAT_PENALTY_ADJACENT],
  },{
    id: 'CHAMPIONS',
    attack: 5,
    defence: 2,
    health: 7,
    initiative: 7,
    ranged: false,
    special: [],
  },{
    id: 'CHAMPIONS_#PACK',
    attack: 6,
    defence: 2,
    health: 7,
    initiative: 9,
    ranged: false,
    special: [SPECIALS.REROLL_ON_OTHER_SPACE],
  },{
    id: 'ARCHANGELS',
    attack: 6,
    defence: 3,
    health: 8,
    initiative: 12,
    ranged: false,
    special: [],
  },{
    id: 'ARCHANGELS_#PACK',
    attack: 7,
    defence: 3,
    health: 10,
    initiative: 18,
    ranged: false,
    special: [],
  }]
  constructor() {

  }

  public start() {
    // test match
    // this.doBattle(this.units[5], this.units[3]);
    // return;

    const matches = this.setupBattleMatches();
    const score = {};
    console.time("Simulation time")
    matches.forEach((match: [Unit, Unit]) => {
      const winnerData = this.doBattle(match[0], match[1]);
      this.addScore(winnerData, score);
    })
    console.timeEnd("Simulation time")
    this.showScore(score);
  }

  private showScore(score: any) {
    const arr = Object.entries(score)
    // @ts-ignore
    const sorted = arr.sort((a, b) => b[1] - a[1]);
    console.log(sorted)
    this.score = sorted as [string, number][];
  }

  private addScore(winnerData: any, score: any) {
    const unit = winnerData.winner;
    if (!score[unit.id]) {
      score[unit.id] = winnerData.percentage; // or just add one win???
    } else {
      score[unit.id] += winnerData.percentage;
    }

  }

  private setupBattleMatches() {
    const matches: any = [];
    this.units.forEach((unitA: Unit) => {
      this.units.forEach((unitB: Unit) => {
        if (unitA.id !== unitB.id) {
          matches.push([unitA, unitB]);
        }
      })
    });
    return matches;
  }

  public doBattle(a: Unit, d: Unit) {
    let attacker = {...a};
    let defender = {...d};
    if (d.initiative > a.initiative) {
      attacker = {...d};
      defender = {...a};
    }
    let attackerWon = 0;
    let defenderWon = 0;
    const itterations = 10000;



    for(let i = 0; i<itterations; i++) {
      const winner = this.startCombat({...attacker}, {...defender});
      if (winner.id === attacker.id) {
        attackerWon++;
      } else {
        defenderWon++;
      }
    }

    if (attackerWon > defenderWon) {
      console.log(`${this.name(attacker.id)} has won (${attackerWon}/${itterations}) agains ${this.name(defender.id)}`)
      return {
        winner: attacker,
        percentage: Math.round((attackerWon/itterations) * 100)
      };
    } else {
      console.log(`${this.name(defender.id)} has won (${defenderWon}/${itterations}) agains ${this.name(attacker.id)}`)
      return {
        winner: defender,
        percentage: Math.round((defenderWon/itterations) * 100)
      };
    }

  }

  private hasSkill(unit: Unit, skill: number) {
    return unit.special.find((special) => special === skill) !== undefined;
  }

  private checkAdjacency(unit: Unit, isAdjacent: boolean) {
    return isAdjacent || !unit.ranged
  }

  private startCombat(attacker: Unit, defender: Unit, isAdjacent = false): Unit {
    isAdjacent = this.checkAdjacency(attacker, isAdjacent);
    this.doDamage(attacker, defender, isAdjacent);
    if (this.isDead(defender)) {
      return attacker;
    }

    if (this.hasSkill(attacker, SPECIALS.IGNORE_RETALIATION) || (attacker.ranged && !isAdjacent)) {
      // Don't retaliate if the attacker ignores it
      // or if the attacker is ranged but not adjacent to the defender
    } else {
      this.doDamage(defender, attacker, isAdjacent);
    }

    if (this.isDead(attacker)) {
      return defender;
    }
    return this.startCombat(defender, attacker, isAdjacent);
  }

  private isDead(target: Unit) {
    return target.health <= 0;
  }

  private doDamage(source: Unit, target: Unit, isAdjacent: boolean) {
    const isRangedVsRanged = source.ranged && target.ranged && !isAdjacent;
    const isRangedVsAdjacent = source.ranged && isAdjacent;
    const combatPenalty = isRangedVsRanged || (isRangedVsAdjacent && !this.hasSkill(source, SPECIALS.IGNORE_COMBAT_PENALTY_ADJACENT));
    const attackRoll = () => {
      return this.attackRoll(combatPenalty, this.hasSkill(source, SPECIALS.REROLL_ZERO_ON_DICE));
    };

    const attack = () => {
      // SPECIALS.DOUBLE_ATTACK_NON_ADJACENT
      if (this.hasSkill(source, SPECIALS.DOUBLE_ATTACK_NON_ADJACENT) && !isAdjacent) {
        return (source.attack + attackRoll()) + (source.attack + attackRoll());
      }

      return (source.attack + attackRoll());
    }

    const targetDefence = () => {
      //SPECIALS.IGNORE_DEFENCE
      if (this.hasSkill(source, SPECIALS.IGNORE_DEFENCE)) {
        return 0;
      }
      return target.defence;
    }

    const damage = attack() - targetDefence();
    target.health -= damage;
    //console.log(`${this.name(source.id)} deals ${damage} damage to ${this.name(target.id)} (${combatPenalty})`)
  }

  private attackRoll(combatPenalty: boolean, reRollOnZero: boolean) {
    if (reRollOnZero) {
      return Math.random() < 0.5 ? -1 : 1;
    }
    const roll = function () {
      return Math.floor(Math.random() * 3) - 1
    }
    if (combatPenalty) {
      return Math.min(roll(),roll());
    }
    return roll();
  }

  private name(id: string) {
    return (id.charAt(0) + id.slice(1).toLowerCase()).replace("_", " ")
  }
}

const choose = function(arr: any, k: any, prefix: any=[]) {
  if (k == 0) return [prefix];
  return arr.flatMap((v: any, i: number) =>
    choose(arr.slice(i+1), k-1, [...prefix, v])
  );
}
