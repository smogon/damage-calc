export declare type GameType = 'Singles' | 'Doubles';
export declare type Terrain = 'Electric' | 'Grassy' | 'Psychic' | 'Misty';
export declare type Weather = 'Sand' | 'Sun' | 'Rain' | 'Hail' | 'Harsh Sunshine' | 'Heavy Rain' | 'Strong Winds';
export declare class Field {
    gameType: GameType;
    weather?: Weather;
    terrain?: Terrain;
    isGravity: boolean;
    attackerSide: Side;
    defenderSide: Side;
    constructor(field?: {
        gameType?: GameType;
        weather?: Weather;
        terrain?: Terrain;
        isGravity?: boolean;
        attackerSide?: Partial<Side>;
        defenderSide?: Partial<Side>;
    });
    hasWeather(...weathers: Weather[]): boolean | undefined;
    swap(): this;
    clone(): Field;
}
export declare class Side {
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
    isSwitching: boolean;
    constructor(side: {
        spikes?: number;
        steelsurge?: boolean;
        isSR?: boolean;
        isReflect?: boolean;
        isLightScreen?: boolean;
        isProtected?: boolean;
        isSeeded?: boolean;
        isForesight?: boolean;
        isTailwind?: boolean;
        isHelpingHand?: boolean;
        isFriendGuard?: boolean;
        isAuroraVeil?: boolean;
        isBattery?: boolean;
        isSwitching?: boolean;
    });
    clone(): Side;
}
