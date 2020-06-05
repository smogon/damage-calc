import {RawDesc, display, displayMove, getRecovery, getRecoil, getKOChance} from './desc';
import {Generation} from './data/interface';
import {Field} from './field';
import {Move} from './move';
import {Pokemon} from './pokemon';

export type Damage = number | number[] | [number, number] | [number[], number[]];

export class Result {
  gen: Generation;
  attacker: Pokemon;
  defender: Pokemon;
  move: Move;
  field: Field;
  damage: number | number[] | [number[], number[]];
  rawDesc: RawDesc;

  constructor(
    gen: Generation,
    attacker: Pokemon,
    defender: Pokemon,
    move: Move,
    field: Field,
    damage: Damage,
    rawDesc: RawDesc,
  ) {
    this.gen = gen;
    this.attacker = attacker;
    this.defender = defender;
    this.move = move;
    this.field = field;
    this.damage = damage;
    this.rawDesc = rawDesc;
  }

  /* get */ desc() {
    return this.fullDesc();
  }

  range(): [number, number] {
    const range = damageRange(this.damage);
    if (typeof range[0] === 'number') return range as [number, number];
    const d = range as [number[], number[]];
    return [d[0][0] + d[0][1], d[1][0] + d[1][1]];
  }

  fullDesc(notation = '%', err = true) {
    return display(
      this.gen,
      this.attacker,
      this.defender,
      this.move,
      this.field,
      this.damage,
      this.rawDesc,
      notation,
      err
    );
  }

  moveDesc(notation = '%') {
    return displayMove(this.gen, this.attacker, this.defender, this.move, this.damage, notation);
  }

  recovery(notation = '%') {
    return getRecovery(this.gen, this.attacker, this.defender, this.move, this.damage, notation);
  }

  recoil(notation = '%') {
    return getRecoil(this.gen, this.attacker, this.defender, this.move, this.damage, notation);
  }

  kochance(err = true) {
    return getKOChance(
      this.gen,
      this.attacker,
      this.defender,
      this.move,
      this.field,
      this.damage,
      err
    );
  }
}

export function damageRange(
  damage: Damage
): [number, number] | [[number, number], [number, number]] {
  // Fixed Damage
  if (typeof damage === 'number') return [damage, damage];
  // Standard Damage
  if (damage.length > 2) {
    const d = damage as number[];
    if (d[0] > d[d.length - 1]) return [Math.min(...d), Math.max(...d)];
    return [d[0], d[d.length - 1]];
  }
  // Fixed Parental Bond Damage
  if (typeof damage[0] === 'number' && typeof damage[1] === 'number') {
    return [[damage[0], damage[1]], [damage[0], damage[1]]];
  }
  // Parental Bond Damage
  const d = damage as [number[], number[]];
  if (d[0][0] > d[0][d[0].length - 1]) d[0] = d[0].slice().sort();
  if (d[1][0] > d[1][d[1].length - 1]) d[1] = d[1].slice().sort();
  return [[d[0][0], d[1][0]], [d[0][d[0].length - 1], d[1][d[1].length - 1]]];
}
