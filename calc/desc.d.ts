import { Generation, TypeName } from './data/interface';
import { Field, Terrain, Weather } from './field';
import { Move } from './move';
import { Pokemon } from './pokemon';
export interface RawDesc {
    HPEVs?: string;
    attackBoost?: number;
    attackEVs?: string;
    attackerAbility?: string;
    attackerItem?: string;
    attackerName: string;
    defenderAbility?: string;
    defenderItem?: string;
    defenderName: string;
    defenseBoost?: number;
    defenseEVs?: string;
    hits?: number;
    isAuroraVeil?: boolean;
    isFriendGuard?: boolean;
    isHelpingHand?: boolean;
    isCritical?: boolean;
    isLightScreen?: boolean;
    isBurned?: boolean;
    isProtected?: boolean;
    isReflect?: boolean;
    isBattery?: boolean;
    isSwitching?: boolean;
    moveBP?: number;
    moveName: string;
    moveTurns?: string;
    moveType?: TypeName;
    rivalry?: 'buffed' | 'nerfed';
    terrain?: Terrain;
    weather?: Weather;
    isDefenderDynamaxed?: boolean;
}
export declare function display(gen: Generation, attacker: Pokemon, defender: Pokemon, move: Move, field: Field, damage: number[], rawDesc: RawDesc, notation?: string, err?: boolean): string;
export declare function displayMove(gen: Generation, attacker: Pokemon, defender: Pokemon, move: Move, damage: number[], notation?: string): string;
export declare function getRecovery(gen: Generation, attacker: Pokemon, defender: Pokemon, move: Move, damage: number[], notation?: string): {
    recovery: number[];
    text: string;
};
export declare function getRecoil(gen: Generation, attacker: Pokemon, defender: Pokemon, move: Move, damage: number[], notation?: string): {
    recoil: number | [number, number];
    text: string;
};
export declare function getKOChance(gen: Generation, attacker: Pokemon, defender: Pokemon, move: Move, field: Field, damage: number[], err?: boolean): {
    chance: number;
    n: number;
    text: string;
} | {
    n: number;
    text: string;
    chance?: undefined;
};
