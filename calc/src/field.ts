export type GameType = 'Singles' | 'Doubles';
export type Terrain = '' | 'Electric' | 'Grassy' | 'Psychic' | 'Misty';
export type Weather =
  | ''
  | 'Sand'
  | 'Sun'
  | 'Rain'
  | 'Hail'
  | 'Harsh Sunshine'
  | 'Heavy Rain'
  | 'Strong Winds';

class Field {
  gameType: GameType;
  weather: Weather;
  terrain: Terrain;
  isGravity: boolean;
  attackerSide: Side;
  defenderSide: Side;

  constructor(
    gameType: GameType,
    weather: Weather,
    terrain: Terrain,
    isGravity: boolean,
    attackerSide: Side,
    defenderSide: Side
  ) {
    this.gameType = gameType || 'Singles';
    this.terrain = terrain || '';
    this.weather = weather || '';
    this.isGravity = !!isGravity;

    this.attackerSide = attackerSide;
    this.defenderSide = defenderSide;
  }

  hasWeather(...weathers: Weather[]) {
    return weathers.indexOf(this.weather) !== -1;
  }

  swap() {
    return new Field(
      this.gameType, this.weather, this.terrain, this.isGravity,
      this.defenderSide, this.attackerSide);
  }
}

class Side {
  spikes: number;
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

  constructor(
    spikes?: number,
    isSR?: boolean,
    isReflect?: boolean,
    isLightScreen?: boolean,
    isProtected?: boolean,
    isSeeded?: boolean,
    isForesight?: boolean,
    isTailwind?: boolean,
    isHelpingHand?: boolean,
    isFriendGuard?: boolean,
    isAuroraVeil?: boolean,
    isBattery?: boolean
  ) {
    this.spikes = spikes || 0;
    this.isSR = !!isSR;
    this.isReflect = !!isReflect;
    this.isLightScreen = !!isLightScreen;
    this.isProtected = !!isProtected;
    this.isSeeded = !!isSeeded;
    this.isForesight = !!isForesight;
    this.isTailwind = !!isTailwind;
    this.isHelpingHand = !!isHelpingHand;
    this.isFriendGuard = !!isFriendGuard;
    this.isAuroraVeil = !!isAuroraVeil;
    this.isBattery = !!isBattery;
  }
}

// TODO: switch to inline exports no longer relying on globals
export { Field, Side };
