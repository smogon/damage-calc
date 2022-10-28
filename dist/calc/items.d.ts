import { Generation, TypeName, StatName } from './data/interface';
export declare const SEED_BOOSTED_STAT: {
    [item: string]: StatName;
};
export declare function getItemBoostType(item: string | undefined): "Electric" | "Psychic" | "Normal" | "Fighting" | "Flying" | "Poison" | "Ground" | "Rock" | "Bug" | "Ghost" | "Steel" | "Fire" | "Water" | "Grass" | "Ice" | "Dragon" | "Dark" | "Fairy" | undefined;
export declare function getBerryResistType(berry: string | undefined): "Electric" | "Psychic" | "Normal" | "Fighting" | "Flying" | "Poison" | "Ground" | "Rock" | "Bug" | "Ghost" | "Steel" | "Fire" | "Water" | "Grass" | "Ice" | "Dragon" | "Dark" | "Fairy" | undefined;
export declare function getFlingPower(item?: string): 0 | 100 | 10 | 50 | 85 | 90 | 40 | 80 | 20 | 60 | 110 | 130 | 95 | 70 | 30;
export declare function getNaturalGift(gen: Generation, item: string): {
    t: TypeName;
    p: number;
};
export declare function getTechnoBlast(item: string): "Electric" | "Fire" | "Water" | "Ice" | undefined;
export declare function getMultiAttack(item: string): "Electric" | "Psychic" | "Normal" | "Fighting" | "Flying" | "Poison" | "Ground" | "Rock" | "Bug" | "Ghost" | "Steel" | "Fire" | "Water" | "Grass" | "Ice" | "Dragon" | "Dark" | "Fairy" | "???" | undefined;
