import {AfterViewInit, Component} from '@angular/core';
import {Unit, UNITS} from "./config/data";
import {SPECIALS} from "./config/specials";
import {Sort} from '@angular/material/sort';

type UnitState = {
  id: string
  paralyzed: boolean;
  poison: number;
  lastThrow: number[];
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
  public itterations = 300;
  public score = [{
    name: "A",
    score: 1,
    resourceEfficiency: 1
  },{
    name: "B",
    score: 2,
    resourceEfficiency: 4
  }];

  public factionData = [];
  public displayedColumnsFaction: string[] = ['faction', 'Bronze', 'Silver', 'Gold', 'Total'];

  // @ViewChild(MatSort) sort: MatSort;

  public units: Unit[] = UNITS.map((unit) => {
    // unit.special = []
    return unit;
  });

  public displayMode: string = 'unit';
  public toggleDisplayMode = (event: any) => {
    this.displayMode = event.value;
  }

  constructor() {
    console.log(this.units)
    this.sortedData = this.score.slice();
  }

  ngAfterViewInit() {
    // this.score.sort = this.sort;
  }

  public start(TYPE = "ALL") {
    // test match
    // this.doBattle(this.units[162], this.units[162]);
    // return;
    let matches;
    if (TYPE === "ALL") {
      matches = this.setupPvAllBattleMatches();
    } else if ( TYPE === "PvN") {
      matches = this.setupPvNeutralBattleMatches();
    } else if ( TYPE === "PvP") {
      matches = this.setupPvPBattleMatches();
    }else if ( TYPE === "TEST") {
      matches = this.setupTestBattleMatches();
    }


    // const pitting = new Map();
    // matches.forEach((match: any) => {
    //   match.forEach((unit: any) => {
    //     if (!pitting.has(unit.id)) {
    //       pitting.set(unit.id, 1)
    //     } else {
    //       pitting.set(unit.id, pitting.get(unit.id) + 1)
    //     }
    //   })
    // })
    // console.log('@', pitting)

    const score = {};
    console.time("Simulation time")
    matches.forEach((match: [Unit, Unit]) => {
      const winnerData = this.doBattle(match[0], match[1]);
      if (winnerData) {
        this.addScore(winnerData, score);
      }
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

      return [...data,...[scorePerCoin],unit.faction, unit.tier, this.statsScore(unit)]
    })
    // console.log(this.convertToTableStructure(newScores), newScores)
    this.score = this.convertToTableStructure(newScores);
    this.sortedData = this.score.slice();
    this.analyzeData(this.score)
  }

  statsScore(unit: Unit) {
    return {
      attack: unit.attack,
      defence: unit.defence,
      health: unit.health,
      initiative: unit.initiative,
      total: (unit.attack * 1)
        + (unit.defence  * 1)
        + (unit.health  * 1)
        + (unit.initiative * 1)
    }
  }

  analyzeData(data: any) {
    const townPower = new Map();
    const townefficiency = new Map();
    const statScore = new Map();
    const tierResults: any = {
    };
    // data.forEach((data: any) => console.log(data.score))
    let total = data.reduce((acc: number, cur: any) => acc + cur.score, 0);
    console.log('@',total)

    const toPercentage = (amount: number) => {
      return Math.round((amount / total) * 10000)/ 100;
    }

    data.forEach((entry: any) => {


      if (!tierResults.hasOwnProperty(entry.faction)) {
        tierResults[entry.faction] = {
          Bronze: 0,
          Silver: 0,
          Gold: 0,
          Total: 0,
        }
      }
      tierResults[entry.faction][entry.tier] += entry.score;
      tierResults[entry.faction].Total += entry.score;
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

      if (statScore.has(entry.faction)) {
        statScore.set(entry.faction,  statScore.get(entry.faction) + entry.statsScore.total)
      } else {
        statScore.set(entry.faction, entry.statsScore.total)
      }
    });
    delete tierResults['Test'];
    townPower.forEach((score, faction) => {
      // townPower.set(faction, score / (this.units.length - 14) / 100)
    })

    const factionData: any= [];
    Object.entries(tierResults).forEach((data:any) => {
      data[1].Bronze = toPercentage(data[1].Bronze)
      data[1].Silver = toPercentage(data[1].Silver)
      data[1].Gold = toPercentage(data[1].Gold)
      data[1].Total = toPercentage(data[1].Total)
      factionData.push({faction: data[0], ...data[1]})
    })
    this.factionData = factionData;

    console.log('Faction power', townPower)
    console.log('Faction efficiency', townefficiency)
    console.log('Faction total stats', statScore)
    console.log('Tier result', tierResults)
    console.log('Tier result', factionData)
    // const average = {
    //   attack: 0,
    //   defence: 0,
    //   health: 0,
    //   initiative: 0,
    // }
    // this.units.forEach((unit: Unit) => {
    //   average.attack += unit.attack;
    //   average.defence += unit.defence;
    //   average.health += unit.health;
    //   average.initiative += unit.initiative;
    // });
    // average.attack = average.attack / this.units.length
    // average.defence = average.defence / this.units.length
    // average.health = average.health / this.units.length
    // average.initiative = average.initiative / this.units.length
    // console.log(average)
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
        statsScore: entry[5],
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

  private setupPvAllBattleMatches() {
    const matches: any = [];
    this.units.forEach((unitA: Unit) => {
      this.units.forEach((unitB: Unit) => {
        if (unitA.id !== unitB.id) { // or unit.id??
          matches.push([unitA, unitB]);
        }
      })
    });
    return matches;
  }

  private setupPvNeutralBattleMatches() {
    const matches: any = [];
    this.units.forEach((unitA: Unit) => {
      this.units.forEach((unitB: Unit) => {
        if (unitA.id !== unitB.id && unitA.faction !== "Neutral" && unitB.faction === "Neutral") {
          matches.push([unitA, unitB]);
        }
      })
    });
    return matches;
  }

  private setupPvPBattleMatches() {
    const matches: any = [];
    this.units.forEach((unitA: Unit) => {
      this.units.forEach((unitB: Unit) => {
        if (unitA.id !== unitB.id && unitA.faction !== "Neutral" && unitB.faction !== "Neutral" && unitA.faction !== unitB.faction) {
          matches.push([unitA, unitB]);
        }
      })
    });
    return matches;
  }

  private setupTestBattleMatches() {
    const matches: any = [];
    this.units.forEach((unitA: Unit) => {
      this.units.forEach((unitB: Unit) => {
        if (unitA.id !== unitB.id && unitA.faction === "Test" && unitB.faction !== "Test") {
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
    // const itterations = 100;

    for(let i = 0; i<this.itterations; i++) {
      const initialState: CombatState = {
        attacker: {
          id: attacker.id,
          paralyzed: false,
          lastThrow: [],
          poison: 0,
        },
        defender: {
          id: defender.id,
          paralyzed: false,
          lastThrow: [],
          poison: 0,
        }
      }
      const winner = this.startCombat({...attacker}, {...defender}, false, initialState);
      if (winner === null) {
        return
      }
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
        percentage: Math.round((attackerWon/this.itterations) * 100)
      };
    } else {
      // console.log(`${this.name(defender.id)} has won (${defenderWon}/${itterations}) agains ${this.name(attacker.id)}`)
      // console.log('-----------------------------------')
      return {
        winner: defender,
        percentage: Math.round((defenderWon/this.itterations) * 100)
      };
    }

  }

  private hasSkill(unit: Unit, skill: number) {
    return unit.special.find((special) => special === skill) !== undefined;
  }

  private checkAdjacency(unit: Unit, isAdjacent: boolean) {
    return isAdjacent || !unit.ranged
  }

  private startCombat(attacker: Unit, defender: Unit, isAdjacent:boolean, state: CombatState, combatRound = 0): Unit | null {
    const deathStare = () => {
      if(this.hasSkill(attacker, SPECIALS.DEATH_STARE)) {
        // if both rolls are -1, set health to 0
        if ((new Set([this.roll(),this.roll(),-1])).size === 1) {
          defender.health = 0;
        }
      }
    }

    isAdjacent = this.checkAdjacency(attacker, isAdjacent);

    // ACTIVATION PHASE
    if (this.hasSkill(attacker, SPECIALS.HEAL_ONE_ON_ACTIVATION)) {
      const data = this.getUnitById(attacker.id) as Unit;
      if (attacker.health < data.health) {
        attacker.health++;
      }
    }

    if (this.hasSkill(attacker, SPECIALS.HEAL_TWO_ON_ACTIVATION)) {
      const data = this.getUnitById(attacker.id) as Unit;
      attacker.health+=2;
      if (attacker.health > data.health) {
        attacker.health = data.health;
      }
    }

    if (this.hasSkill(attacker, SPECIALS.HEAL_THREE_ON_ACTIVATION)) {
      const data = this.getUnitById(attacker.id) as Unit;
      attacker.health+=3;
      if (attacker.health > data.health) {
        attacker.health = data.health;
      }
    }

    if (this.hasSkill(attacker, SPECIALS.FAERIE_SPELL_ATTACK)) {
      let baseDamage = 2;
      if (
        this.hasSkill(defender, SPECIALS.IGNORE_DAMAGE_FROM_SPECIALS_AND_MAGIC)
        && this.hasSkill(defender, SPECIALS.SPELL_REDUCTION_TWO)
        && this.hasSkill(defender, SPECIALS.SPELL_REDUCTION_THREE)
      ) {
        baseDamage = 0;
      }
      if (this.hasSkill(defender, SPECIALS.SPELL_REDUCTION_ONE)) {
        baseDamage = 1;
      }


      defender.health-=baseDamage;
      if (this.isDead(defender)) {
        const downgrade = this.findDowngrade(defender)
        if (!downgrade) {
          return attacker;
        } else {
          defender = this.doDowngrade(defender, downgrade);
          if (this.isDead(defender)) {
            return attacker;
          }
        }
      }
    }

    if (state.attacker.poison > 0) {
      state.attacker.poison--;
      attacker.health--;
      if (this.isDead(attacker)) {
        const downgrade = this.findDowngrade(attacker)
        if (!downgrade) {
          return defender;
        } else {
          attacker = this.doDowngrade(attacker, downgrade);
        }
      }
    }

    // ATTACK PHASE

    if (state.attacker.paralyzed) {
      state.attacker.paralyzed = false;
    } else {
      // ATTACK (if not paralyzed
      let damageModifier = 0;
      if (this.hasSkill(attacker, SPECIALS.ENCHANTER)) {
        damageModifier = 1;
      }

      if (
        this.hasSkill(attacker, SPECIALS.BONUS_AGAINST_ARCH_DEVIL)
        && (defender.id === "ARCH_DEVILS" || defender.id === "ARCH_DEVILS_#PACK" || defender.id === "ARCH_DEVILS *")
      ) {
        damageModifier = 2;
      }
      if (
        this.hasSkill(attacker, SPECIALS.BONUS_AGAINST_BLACK_DRAGON)
        && (defender.id === "BLACK_DRAGONS" || defender.id === "BLACK_DRAGONS_#PACK" || defender.id === "BLACK_DRAGONS *")
      ) {
        damageModifier = 2;
      }
      if (
        this.hasSkill(attacker, SPECIALS.BONUS_AGAINST_ARCH_ANGELS)
        && (defender.id === "ARCHANGELS" || defender.id === "ARCHANGELS_#PACK" || defender.id === "ARCHANGELS *")
      ) {
        damageModifier = 2;
      }
      if (
        this.hasSkill(attacker, SPECIALS.BONUS_AGAINST_EFREET)
        && (defender.id === "EFREETS" || defender.id === "EFREETS_#PACK" || defender.id === "EFREETS *")
      ) {
        damageModifier = 1;
      }
      this.doDamage(attacker, defender, isAdjacent, false, state, damageModifier);
      if (this.hasSkill(attacker, SPECIALS.POISON)) {
        state.defender.poison++;
      }
      if (this.hasSkill(attacker, SPECIALS.MIGHTY_POISON)) {
        state.defender.poison+=2;
      }
      if (this.hasSkill(attacker, SPECIALS.CHANCE_MOVE_ENEMY_ON_ATTACK)) {
        if(this.roll() === 0) {
          isAdjacent = false;
        }
      }

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
      if (this.hasSkill(attacker, SPECIALS.IGNORE_RETALIATION) || (attacker.ranged && !isAdjacent) || !isAdjacent) {
        // Don't retaliate if the attacker ignores it
        // or if the attacker is ranged but not adjacent to the defender
      } else {
        // console.log(defender.id, 'RETALLIATE')
        let damageModifier = 0;
        if (this.hasSkill(attacker, SPECIALS.LOWER_RETALIATION_DAMAGE)) {
          damageModifier = -1;
        }
        this.doDamage(defender, attacker, isAdjacent, true, state, damageModifier);
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

      // SKILL ACTIVATION DURING ATTACK
      if (this.hasSkill(attacker, SPECIALS.CHANCE_TO_PARALYZE_MINUS_ONE) && this.containsRoll(state.attacker.lastThrow, -1)) {
        state.defender.paralyzed = true;
      }
      if (this.hasSkill(attacker, SPECIALS.CHANCE_TO_PARALYZE) && this.roll() === 0) {
        state.defender.paralyzed = true;
      }
      if (this.hasSkill(attacker, SPECIALS.CHANCE_TO_POISON) && this.roll() === 0) {
        state.defender.poison++;
      }

      if (this.hasSkill(attacker, SPECIALS.FEAR) && this.containsRoll(state.attacker.lastThrow, -1)) {
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

    if (combatRound === 3) {
      // if it takes more then 2 rounds, quit.
      return null;
    }
    return this.startCombat(defender, attacker, isAdjacent, state, combatRound += 1);
  }

  private switchState(state: CombatState) {
    const newState: CombatState = {
      attacker: {...state.defender},
      defender: {...state.attacker}
    }
    newState.attacker.lastThrow = [];
    newState.defender.lastThrow = [];
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

  private doDamage(source: Unit, target: Unit, isAdjacent: boolean, retalliation: boolean, state: CombatState, damageModifier = 0) {
    if(this.hasSkill(source, SPECIALS.HEAL_TWO_ON_ATTACK) && !retalliation) {
      const data = this.getUnitById(source.id) as Unit;
      if (source.health < data.health) {
        source.health += 2;
        if (source.health > data.health) {
          source.health = data.health;
        }
      }
    }
    const isRangedVsRanged = source.ranged && target.ranged && !isAdjacent && !this.hasSkill(source, SPECIALS.IGNORE_COMBAT_PENALTY);
    const isRangedVsAdjacent = source.ranged && isAdjacent;
    const combatPenalty = isRangedVsRanged || (isRangedVsAdjacent && !this.hasSkill(source, SPECIALS.IGNORE_COMBAT_PENALTY_ADJACENT));
    const attackRoll = () => {
      if (this.hasSkill(source, SPECIALS.NO_ROLL_FOR_ATTACK) && !retalliation) {
        return 0;
      }
      if (this.hasSkill(target, SPECIALS.CURSE)) {
        return -1;
      }
      if (this.hasSkill(target, SPECIALS.RETALIATION_CURSE) && retalliation) {
        return Math.min(this.roll(), this.roll());
      }
      if (this.hasSkill(source, SPECIALS.CRUSADERS_ATTACK)) {
        return Math.max(this.roll(), this.roll());
      }
      if (this.hasSkill(source, SPECIALS.ALWAYS_REROLL_MINUS_ONE)) {
        return Math.max(this.roll(), this.roll());
      }
      if (this.hasSkill(source, SPECIALS.ALWAYS_REROLL_MINUS_ONE)) {
        return Math.max(this.roll(), this.roll());
      }
      return this.attackRoll(
        combatPenalty,
        (this.hasSkill(source, SPECIALS.REROLL_ZERO_ON_DICE) && !retalliation),
        (this.hasSkill(source, SPECIALS.REROLL_ON_OTHER_SPACE) && !retalliation) || (this.hasSkill(source, SPECIALS.ATTACK_REROLL_MINUS_ONE)),
        (this.hasSkill(source, SPECIALS.LUCK) && !retalliation),
        (this.hasSkill(source, SPECIALS.ADD_ONE_TO_ATTACK_DICE) && !retalliation),
      );
    };

    const attack = () => {
      const isNotNegative = function(damage: number) {
        return damage < 0 ? 0 : damage;
      }

      const strike = () => {
        let rollResult = attackRoll();
        state.attacker.lastThrow.push(rollResult);

        if (this.hasSkill(source, SPECIALS.CHAMPION_DOUBLE_ROLL)) {
          const roll = attackRoll();
          state.attacker.lastThrow.push(roll);
          rollResult += roll;
        }

        if (this.hasSkill(source, SPECIALS.DEATH_BLOW) && rollResult >= 0) {
          damageModifier++;
        }
        return isNotNegative(source.attack + rollResult + damageModifier)
      }

      // SPECIALS.DOUBLE_ATTACK_NON_ADJACENT
      if (this.hasSkill(source, SPECIALS.DOUBLE_ATTACK_NON_ADJACENT) && !isAdjacent) {
        return strike() + strike();
      }

      // NOT_ADJACENT_CHANCE_DOUBLE_ATTACK
      if (this.hasSkill(source, SPECIALS.NOT_ADJACENT_CHANCE_DOUBLE_ATTACK) && !isAdjacent) {
        const firstStrike = strike();
        if (this.containsRoll(state.attacker.lastThrow, 0) || this.containsRoll(state.attacker.lastThrow, -1)) {
          return firstStrike + strike();
        }
        return strike();
      }

      return strike();
    }

    const targetDefence = () => {
      let modifier = 0;
      //SPECIALS.IGNORE_DEFENCE
      if (this.hasSkill(source, SPECIALS.IGNORE_DEFENCE)) {
        return 0;
      }
      if (this.hasSkill(target, SPECIALS.DEFENCE_ON_ATTACK_ONE) && this.containsRoll(state.attacker.lastThrow, 1)) {
        modifier++;
      }
      if (this.hasSkill(target, SPECIALS.DEFENCE_ON_ATTACK_ZERO_ONE)
        && (this.containsRoll(state.attacker.lastThrow, 0) || this.containsRoll(state.attacker.lastThrow, 1))) {
        modifier++;
      }
      if (this.hasSkill(source, SPECIALS.RUST_ATTACK) && this.containsRoll(state.attacker.lastThrow, -1)) {
        modifier -= 2;
      }
      return target.defence + modifier <= 0 ? 0 : target.defence + modifier;
    }

    const damage = attack() - targetDefence();
    target.health -= damage;
  }

  private attackRoll(combatPenalty: boolean, reRollOnZero: boolean, reRollOnNewSpace: boolean, luck: boolean, increaseRollOne: boolean) {
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
    if (luck) {
      return Math.max(roll(),roll());
    }
    if (combatPenalty) {
      return Math.min(roll(),roll());
    }
    if (increaseRollOne) {
      return roll() + 1;
    }
    return roll();
  }

  private name(id: string) {
    return (id.charAt(0) + id.slice(1).toLowerCase()).replace(/_/g, " ")
  }

  private containsRoll(throws: number[], nr: number) {
    return throws.findIndex(entry => entry === nr) !== -1;
  }
}

const choose = function(arr: any, k: any, prefix: any=[]) {
  if (k == 0) return [prefix];
  return arr.flatMap((v: any, i: number) =>
    choose(arr.slice(i+1), k-1, [...prefix, v])
  );
}
