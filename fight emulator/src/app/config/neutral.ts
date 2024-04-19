import {Unit} from "./data";
import {SPECIALS} from "./specials";

export const NEUTRAL: Unit[] = [{
  id: 'AZURE_DRAGON *',
  attack: 8,
  defence: 2,
  health: 10,
  initiative: 19,
  ranged: false,
  special: [SPECIALS.IGNORE_DAMAGE_FROM_SPECIALS_AND_MAGIC, SPECIALS.FEAR],
  upgradeFrom: "",
  costs: [45,2],
  faction: "Neutral",
  tier: "Azure"
}]
