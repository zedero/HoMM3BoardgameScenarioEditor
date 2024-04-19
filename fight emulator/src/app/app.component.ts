import {AfterViewInit, Component} from '@angular/core';
import {Unit, UNITS} from "./config/data";
import {SPECIALS} from "./config/specials";
import {Sort} from '@angular/material/sort';

type UnitState = {
  paralyzed: boolean;
  lastThrow: number | undefined;
}
type CombatState = {
  attacker: UnitState;
  defender: UnitState;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  public displayedColumns: string[] = ['name', 'score', 'resourceEfficiency', 'faction', 'tier'];
  public sortedData: any = [];
  public score = [{
    name: "A",
    score: 1,
    resourceEfficiency: 1
  },{
    name: "B",
    score: 2,
    resourceEfficiency: 4
  }];

  // @ViewChild(MatSort) sort: MatSort;

  public units: Unit[] = UNITS;
  constructor() {
    console.log(this.units)
    this.sortedData = this.score.slice();
  }

  ngAfterViewInit() {
    // this.score.sort = this.sort;
  }

  public start() {
    // test match
    // this.doBattle(this.units[32], this.units[33]);
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

    const newScores = sorted.map((data) => {
      const unit = this.getUnitById(data[0]) as Unit;
      const downgrade = this.findDowngrade(unit) as Unit;
      const downgradeCost = downgrade ? this.calculateGoldCosts(downgrade.costs) : 0;

      const goldCosts = this.calculateGoldCosts(unit.costs) + downgradeCost;
      // @ts-ignore
      const scorePerCoin = Math.ceil(data[1] / goldCosts);

      return [...data,...[scorePerCoin],unit.faction, unit.tier]
    })
    console.log(this.convertToTableStructure(newScores), newScores)
    this.score = this.convertToTableStructure(newScores);
    this.sortedData = this.score.slice();
    this.analyzeData(this.score)
  }

  analyzeData(data: any) {
    const townPower = new Map();
    const townefficiency = new Map();
    data.forEach((entry: any) => {
      if (entry.faction === "Neutral") {
        return
      }
      if (townPower.has(entry.faction)) {
        townPower.set(entry.faction,  townPower.get(entry.faction) + entry.score)
      } else {
        townPower.set(entry.faction, entry.score)
      }

      if (townefficiency.has(entry.faction) && isFinite(entry.resourceEfficiency)) {
        townefficiency.set(entry.faction,  townefficiency.get(entry.faction) + entry.resourceEfficiency)
      } else if(isFinite(entry.resourceEfficiency)) {
        townefficiency.set(entry.faction, entry.score)
      }

    });
    console.log(townPower)
    console.log(townefficiency)
  }

  sortChange(sort: Sort) {
    const data = this.sortedData.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    // @ts-ignore
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'score':
          return compare(a.score, b.score, isAsc);
        case 'resourceEfficiency':
          return compare(a.resourceEfficiency, b.resourceEfficiency, isAsc);
        case 'faction':
          // @ts-ignore
          return compare(a.faction, b.faction, isAsc);
        case 'tier':
          // @ts-ignore
          return compare(a.tier, b.tier, isAsc);
        default:
          return 0;
      }
    });

    function compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

  }

  private convertToTableStructure(data: any) {
    return data.map((entry: any) => {
      return {
        name: this.name(entry[0]),
        score: entry[1],
        resourceEfficiency: entry[2],
        faction: entry[3],
        tier: entry[4],
      }
    })
  }

  private getUnitById(id: string) {
    return this.units.find((unit) => unit.id === id)
  }
  private calculateGoldCosts(costs:[number,number]) {
    return costs[0] + (costs[1] * 6)
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
    const itterations = 100;

    for(let i = 0; i<itterations; i++) {
      const initialState: CombatState = {
        attacker: {
          paralyzed: false,
          lastThrow: undefined
        },
        defender: {
          paralyzed: false,
          lastThrow: undefined
        }
      }
      const winner = this.startCombat({...attacker}, {...defender}, false, initialState);
      if (winner.id === attacker.id) {
        attackerWon++;
      } else {
        defenderWon++;
      }
    }

    if (attackerWon > defenderWon) {
      // console.log(`${this.name(attacker.id)} has won (${attackerWon}/${itterations}) agains ${this.name(defender.id)}`)
      // console.log('-----------------------------------')
      return {
        winner: attacker,
        percentage: Math.round((attackerWon/itterations) * 100)
      };
    } else {
      // console.log(`${this.name(defender.id)} has won (${defenderWon}/${itterations}) agains ${this.name(attacker.id)}`)
      // console.log('-----------------------------------')
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

  private startCombat(attacker: Unit, defender: Unit, isAdjacent:boolean, state: CombatState): Unit {
    const deathStare = () => {
      if(this.hasSkill(attacker, SPECIALS.DEATH_STARE)) {
        // if both rolls are -1, set health to 0
        if ((new Set([this.roll(),this.roll(),-1])).size === 1) {
          defender.health = 0;
        }
      }
    }


    isAdjacent = this.checkAdjacency(attacker, isAdjacent);
    // ACTIVATION
    if (this.hasSkill(attacker, SPECIALS.HEAL_ONE_ON_ACTIVATION)) {
      const data = this.getUnitById(attacker.id) as Unit;
      if (attacker.health < data.health) {
        attacker.health++;
      }
    }

    if (state.attacker.paralyzed) {
      state.attacker.paralyzed = false;
    } else {
      // ATTACK (if not paralyzed
      this.doDamage(attacker, defender, isAdjacent, false);
      if (this.isDead(defender)) {
        const downgrade = this.findDowngrade(defender)
        if (!downgrade) {
          return attacker;
        } else {
          defender = this.doDowngrade(defender, downgrade);
          deathStare();
          if (this.isDead(defender)) {
            return attacker;
          }
        }
      } else {
        deathStare();
        if (this.isDead(defender)) {
          return attacker;
        }
      }

      // RETALIATE
      if (this.hasSkill(attacker, SPECIALS.IGNORE_RETALIATION) || (attacker.ranged && !isAdjacent)) {
        // Don't retaliate if the attacker ignores it
        // or if the attacker is ranged but not adjacent to the defender
      } else {
        // console.log(defender.id, 'RETALLIATE')
        let damageModifier = 0;
        if (this.hasSkill(attacker, SPECIALS.LOWER_RETALIATION_DAMAGE)) {
          damageModifier = -1;
        }
        this.doDamage(defender, attacker, isAdjacent, true, damageModifier);
      }

      if (this.isDead(attacker)) {
        const downgrade = this.findDowngrade(attacker)
        if (!downgrade) {
          return defender;
        } else {
          attacker = this.doDowngrade(attacker, downgrade);
          if (this.isDead(attacker)) {
            return defender;
          }
        }
      }

      if (this.hasSkill(attacker, SPECIALS.FEAR) && this.roll() === -1) {
        state.defender.paralyzed = true;
      }
    }


    if (this.hasSkill(attacker, SPECIALS.IGNORE_PARALYSIS)) {
      state.attacker.paralyzed = false;
    }
    if (this.hasSkill(defender, SPECIALS.IGNORE_PARALYSIS)) {
      state.defender.paralyzed = false;
    }

    // CONTINUE FIGHT BY SWAPPING ATTACKER AND DEFENDER
    state = this.switchState(state)
    return this.startCombat(defender, attacker, isAdjacent, state);
  }

  private switchState(state: CombatState) {
    const newState: CombatState = {
      attacker: {...state.defender},
      defender: {...state.attacker}
    }
    return newState;
  }

  private roll = function () {
    return Math.floor(Math.random() * 3) - 1
  }

  private doDowngrade(upgrade: Unit, downgrade: Unit) {
    upgrade.health += downgrade.health; // set new health but adjust for negative damage.
    upgrade.attack = downgrade.attack;
    upgrade.defence = downgrade.defence;
    upgrade.initiative = downgrade.initiative;
    upgrade.ranged = downgrade.ranged;
    upgrade.special = downgrade.special;
    upgrade.upgradeFrom = downgrade.upgradeFrom;
    // console.log(`${upgrade.id} has been downgraded to ${downgrade.id}(${upgrade.health})`)
    return upgrade;
  }

  private findDowngrade(unit: Unit) {
    return this.units.find((un) => {
      return un.id === unit.upgradeFrom
    });
  }

  private isDead(target: Unit) {
    return target.health <= 0;
  }

  private doDamage(source: Unit, target: Unit, isAdjacent: boolean, retalliation: boolean, damageModifier = 0) {
    if(this.hasSkill(source, SPECIALS.HEAL_TWO_ON_ATTACK)) {
      const data = this.getUnitById(source.id) as Unit;
      if (source.health < data.health) {
        source.health += 2;
        if (source.health > data.health) {
          source.health = data.health;
        }
      }
    }
    const isRangedVsRanged = source.ranged && target.ranged && !isAdjacent;
    const isRangedVsAdjacent = source.ranged && isAdjacent;
    const combatPenalty = isRangedVsRanged || (isRangedVsAdjacent && !this.hasSkill(source, SPECIALS.IGNORE_COMBAT_PENALTY_ADJACENT));
    const attackRoll = () => {
      return this.attackRoll(
        combatPenalty,
        this.hasSkill(source, SPECIALS.REROLL_ZERO_ON_DICE),
        (this.hasSkill(source, SPECIALS.REROLL_ON_OTHER_SPACE) && !retalliation));
    };

    const attack = () => {
      const isNotNegative = function(damage: number) {
        return damage < 0 ? 0 : damage;
      }

      const strike = () => {
        return isNotNegative(source.attack + attackRoll() + damageModifier)
      }

      // SPECIALS.DOUBLE_ATTACK_NON_ADJACENT
      if (this.hasSkill(source, SPECIALS.DOUBLE_ATTACK_NON_ADJACENT) && !isAdjacent) {
        return strike() + strike();
      }

      return strike();
    }

    const targetDefence = () => {
      //SPECIALS.IGNORE_DEFENCE
      if (this.hasSkill(source, SPECIALS.IGNORE_DEFENCE)) {
        return 0;
      }
      if (this.hasSkill(source, SPECIALS.DEFENCE_ON_ATTACK_ONE)) {
        // return 0;
      }
      return target.defence;
    }

    const damage = attack() - targetDefence();
    target.health -= damage;
    // console.log(`${this.name(source.id)} deals ${damage} damage to ${this.name(target.id)}(${target.health}) (${combatPenalty})`)
  }

  private attackRoll(combatPenalty: boolean, reRollOnZero: boolean, reRollOnNewSpace: boolean) {
    if (reRollOnZero) {
      return Math.random() < 0.5 ? -1 : 1;
    }
    const roll = function () {
      return Math.floor(Math.random() * 3) - 1
    }
    if (reRollOnNewSpace) {
      const diceRoll = roll();
      if (diceRoll === -1) {
        return roll()
      }
      return diceRoll;
    }
    if (combatPenalty) {
      return Math.min(roll(),roll());
    }
    return roll();
  }

  private name(id: string) {
    return (id.charAt(0) + id.slice(1).toLowerCase()).replace(/_/g, " ")
  }
}

const choose = function(arr: any, k: any, prefix: any=[]) {
  if (k == 0) return [prefix];
  return arr.flatMap((v: any, i: number) =>
    choose(arr.slice(i+1), k-1, [...prefix, v])
  );
}
