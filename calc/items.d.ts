import { Generation, TypeName, StatName } from './data/interface';
export declare const SEED_BOOSTED_STAT: {
    [item: string]: StatName;
};
export declare function getItemBoostType(item: string | undefined): "Electric" | "Psychic" | "Normal" | "Grass" | "Fire" | "Water" | "Ice" | "Flying" | "Bug" | "Poison" | "Ground" | "Rock" | "Fighting" | "Ghost" | "Dragon" | "Dark" | "Steel" | "Fairy" | undefined;
export declare function getBerryResistType(berry: string | undefined): "Electric" | "Psychic" | "Normal" | "Grass" | "Fire" | "Water" | "Ice" | "Flying" | "Bug" | "Poison" | "Ground" | "Rock" | "Fighting" | "Ghost" | "Dragon" | "Dark" | "Steel" | "Fairy" | undefined;
export declare function getFlingPower(item?: string): 0 | 10 | 100 | 110 | 95 | 90 | 85 | 80 | 70 | 130 | 50 | 40 | 20 | 60 | 30;
export declare function getNaturalGift(gen: Generation, item: string): {
    t: TypeName;
    p: number;
};
export declare function getTechnoBlast(item: string): "Electric" | "Fire" | "Water" | "Ice" | undefined;
export declare function getMultiAttack(item: string): "Electric" | "Psychic" | "???" | "Normal" | "Grass" | "Fire" | "Water" | "Ice" | "Flying" | "Bug" | "Poison" | "Ground" | "Rock" | "Fighting" | "Ghost" | "Dragon" | "Dark" | "Steel" | "Fairy" | undefined;
