import { State } from './state';
import { GameType, Weather, Terrain } from './data/interface';
export declare class Field implements State.Field {
    gameType: GameType;
    weather?: Weather;
    terrain?: Terrain;
    isGravity: boolean;
    attackerSide: Side;
    defenderSide: Side;
    constructor(field?: Partial<State.Field>);
    hasWeather(...weathers: Weather[]): boolean;
    hasTerrain(...terrains: Terrain[]): boolean;
    swap(): this;
    clone(): Field;
}
export declare class Side implements State.Side {
    spikes: number;
    steelsurge: boolean;
    isSR: boolean;
    isReflect: boolean;
    isLightScreen: boolean;
    isProtected: boolean;
    isSeeded: boolean;
    isForesight: boolean;
    isTailwind: boolean;
    isHelpingHand: boolean;
    isFriendGuard: boolean;
    isAuroraVeil: boolean;
    isBattery: boolean;
    isSwitching?: 'out' | 'in';
    constructor(side?: State.Side);
    clone(): Side;
}
