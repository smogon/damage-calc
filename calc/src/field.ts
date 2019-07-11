export type Format = 'Singles' | 'Doubles';
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
  weather: Weather;
  getSide: (sideNum: 0 | 1) => Side;

  constructor(
    format: Format,
    isGravity: boolean,
    isSR: [boolean, boolean],
    weather: Weather,
    spikes: [number, number],
    terrain: Terrain,
    isReflect: [boolean, boolean],
    isLightScreen: [boolean, boolean],
    isProtected: [boolean, boolean],
    isSeeded: [boolean, boolean],
    isForesight: [boolean, boolean],
    isHelpingHand: [boolean, boolean],
    isTailwind: [boolean, boolean],
    isFriendGuard: [boolean, boolean],
    isAuroraVeil: [boolean, boolean],
    isBattery: [boolean, boolean]
  ) {
    this.weather = weather;
    this.getSide = (i: number) =>
      new Side(
        format,
        terrain,
        weather,
        isGravity,
        isSR[i],
        spikes[i],
        isReflect[i],
        isLightScreen[i],
        isProtected[i],
        isSeeded[1 - i],
        isSeeded[i],
        isForesight[i],
        isHelpingHand[i],
        isTailwind[i],
        isFriendGuard[i],
        isAuroraVeil[i],
        isBattery[i]
      );
  }

  getWeather() {
    return this.weather;
  }

  // TODO: remove this so that we can create Side on initialization
  clearWeather() {
    this.weather = '';
  }
}

class Side {
  format: Format;
  terrain: Terrain;
  weather: Weather;
  isGravity: boolean;
  isSR: boolean;
  spikes: number;
  isReflect: boolean;
  isLightScreen: boolean;
  isProtected: boolean;
  isAttackerSeeded: boolean;
  isDefenderSeeded: boolean;
  isForesight: boolean;
  isTailwind: boolean;
  isHelpingHand: boolean;
  isFriendGuard: boolean;
  isAuroraVeil: boolean;
  isBattery: boolean;

  constructor(
    format?: Format,
    terrain?: Terrain,
    weather?: Weather,
    isGravity?: boolean,
    isSR?: boolean,
    spikes?: number,
    isReflect?: boolean,
    isLightScreen?: boolean,
    isProtected?: boolean,
    isAttackerSeeded?: boolean,
    isDefenderSeeded?: boolean,
    isForesight?: boolean,
    isHelpingHand?: boolean,
    isTailwind?: boolean,
    isFriendGuard?: boolean,
    isAuroraVeil?: boolean,
    isBattery?: boolean
  ) {
    this.format = format || 'Singles';
    this.terrain = terrain || '';
    this.weather = weather || '';
    this.isGravity = !!isGravity;
    this.isSR = !!isSR;
    this.spikes = spikes || 0;
    this.isReflect = !!isReflect;
    this.isLightScreen = !!isLightScreen;
    this.isProtected = !!isProtected;
    this.isAttackerSeeded = !!isAttackerSeeded;
    this.isDefenderSeeded = !!isDefenderSeeded;
    this.isForesight = !!isForesight;
    this.isHelpingHand = !!isHelpingHand;
    this.isTailwind = !!isTailwind;
    this.isFriendGuard = !!isFriendGuard;
    this.isAuroraVeil = !!isAuroraVeil;
    this.isBattery = !!isBattery;
  }

  hasWeather(...weathers: Weather[]) {
    return weathers.indexOf(this.weather) !== -1;
  }
}

// TODO: switch to inline exports no longer relying on globals
export { Field, Side };
