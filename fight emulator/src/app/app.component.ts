import { Component } from '@angular/core';

export type Unit = {
  id: string;
  upgraded: boolean;
  attack: number;
  defence: number;
  health: number;
  initiative: number;
  ranged: boolean;
  special: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public units: Unit[] = [{
    id: 'TROGLODYTES',
    upgraded: false,
    attack: 2,
    defence: 1,
    health: 2,
    initiative: 4,
    ranged: false,
    special: "NONE",
  },{
    id: 'TROGLODYTES',
    upgraded: true,
    attack: 3,
    defence: 1,
    health: 2,
    initiative: 5,
    ranged: false,
    special: "NONE",
  },{
    id: 'HARPIES',
    upgraded: false,
    attack: 2,
    defence: 0,
    health: 3,
    initiative: 6,
    ranged: false,
    special: "NONE",
  },{
    id: 'EVIL_EYES',
    upgraded: false,
    attack: 3,
    defence: 0,
    health: 3,
    initiative: 5,
    ranged: false,
    special: "NONE",
  }]
  constructor() {

  }

  public start() {
    this.prepareBattle(this.units[0], this.units[2]);
  }

  public prepareBattle(a: Unit, d: Unit) {
    const attacker = {...a};
    const defender = {...d};
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
      console.log(`${this.name(attacker.id)} has won (${attackerWon}/${itterations})`)
    } else {
      console.log(`${this.name(defender.id)} has won (${defenderWon}/${itterations})`)
    }

  }

  private startCombat(attacker: Unit, defender: Unit): Unit {
    this.doDamage(attacker, defender);
    if (this.isDead(defender)) {
      return attacker;
    }
    this.doDamage(defender, attacker);
    if (this.isDead(attacker)) {
      return defender;
    }
    return this.startCombat(defender, attacker);
  }

  private isDead(target: Unit) {
    return target.health <= 0;
  }

  private doDamage(source: Unit, target: Unit) {
    const damage = (source.attack + this.attackRoll()) - target.defence;
    target.health -= damage;
    //console.log(`${this.name(source.id)} deals ${damage} damage to ${this.name(target.id)}`)
  }

  private attackRoll() {
    return Math.floor(Math.random() * 3) - 1;
  }

  private name(id: string) {
    return (id.charAt(0) + id.slice(1).toLowerCase()).replace("_", " ")
  }


}
