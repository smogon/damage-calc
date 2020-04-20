export type GameType = 'Singles' | 'Doubles';
export type Terrain = 'Electric' | 'Grassy' | 'Psychic' | 'Misty';
export type Weather =
  | 'Sand'
  | 'Sun'
  | 'Rain'
  | 'Hail'
  | 'Harsh Sunshine'
  | 'Heavy Rain'
  | 'Strong Winds';

export class Field {
  gameType: GameType;
  weather?: Weather;
  terrain?: Terrain;
  isGravity: boolean;
  attackerSide: Side;
  defenderSide: Side;

  constructor(
    field: {
      gameType?: GameType;
      weather?: Weather;
      terrain?: Terrain;
      isGravity?: boolean;
      attackerSide?: Partial<Side>;
      defenderSide?: Partial<Side>;
    } = {}
  ) {
    this.gameType = field.gameType || 'Singles';
    this.terrain = field.terrain;
    this.weather = field.weather;
    this.isGravity = !!field.isGravity;

    this.attackerSide = new Side(field.attackerSide || {});
    this.defenderSide = new Side(field.defenderSide || {});
  }

  hasWeather(...weathers: Weather[]) {
    return !!(this.weather && weathers.includes(this.weather));
  }

  hasTerrain(...terrains: Terrain[]) {
    return !!(this.terrain && terrains.includes(this.terrain));
  }

  swap() {
    [this.attackerSide, this.defenderSide] = [this.defenderSide, this.attackerSide];
    return this;
  }

  clone() {
    return new Field({
      gameType: this.gameType,
      weather: this.weather,
      terrain: this.terrain,
      isGravity: this.isGravity,
      attackerSide: this.attackerSide,
      defenderSide: this.defenderSide,
    });
  }
}

export class Side {
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
  }) {
    this.spikes = side.spikes || 0;
    this.steelsurge = !!side.steelsurge;
    this.isSR = !!side.isSR;
    this.isReflect = !!side.isReflect;
    this.isLightScreen = !!side.isLightScreen;
    this.isProtected = !!side.isProtected;
    this.isSeeded = !!side.isSeeded;
    this.isForesight = !!side.isForesight;
    this.isTailwind = !!side.isTailwind;
    this.isHelpingHand = !!side.isHelpingHand;
    this.isFriendGuard = !!side.isFriendGuard;
    this.isAuroraVeil = !!side.isAuroraVeil;
    this.isBattery = !!side.isBattery;
    this.isSwitching = !!side.isSwitching;
  }

  clone() {
    return new Side(this);
  }
}
