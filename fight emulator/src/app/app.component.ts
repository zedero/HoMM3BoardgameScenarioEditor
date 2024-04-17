import { Component } from '@angular/core';

export type Unit = {
  id: string;
  attack: number;
  defence: number;
  health: number;
  initiative: number;
  ranged: boolean;
  special: number[];
}

enum SPECIALS {
  "IGNORE_RETALIATION",
  "IGNORE_COMBAT_PENALTY_ADJACENT",// TODO Implement this special
  "IGNORE_PARALYSIS"// TODO Implement this special
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
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
  }]
  constructor() {

  }

  public start() {
    // test match
//3,5

    //this.doBattle(this.units[5], this.units[4]);

    const matches = this.setupBattleMatches();
    const score = {};
    matches.forEach((match: [Unit, Unit]) => {
      const winner = this.doBattle(match[0], match[1]);
      this.addScore(winner, score);
    })
    console.log(score);
  }

  private addScore(unit: Unit, score: any) {
    if (!score[unit.id]) {
      score[unit.id] = 1;
    } else {
      score[unit.id]++;
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
    })
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
      return attacker;
    } else {
      console.log(`${this.name(defender.id)} has won (${defenderWon}/${itterations}) agains ${this.name(attacker.id)}`)
      return defender;
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
    const attackRoll = this.attackRoll(isRangedVsRanged)

    const damage = (source.attack + attackRoll) - target.defence;
    target.health -= damage;
    //console.log(`${this.name(source.id)} deals ${damage} damage to ${this.name(target.id)}`)
  }

  private attackRoll(isRangedVsRanged: boolean) {
    const roll = function () {
      return Math.floor(Math.random() * 3) - 1
    }
    if (isRangedVsRanged) {
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
