import type { Generation, TypeName, StatID } from './data/interface';
export declare const SEED_BOOSTED_STAT: {
    [item: string]: StatID;
};
export declare function getItemBoostType(item: string | undefined): "Electric" | "Psychic" | "Normal" | "Fighting" | "Flying" | "Poison" | "Ground" | "Rock" | "Bug" | "Ghost" | "Steel" | "Fire" | "Water" | "Grass" | "Ice" | "Dragon" | "Dark" | "Fairy" | undefined;
export declare function getBerryResistType(berry: string | undefined): "Electric" | "Psychic" | "Normal" | "Fighting" | "Flying" | "Poison" | "Ground" | "Rock" | "Bug" | "Ghost" | "Steel" | "Fire" | "Water" | "Grass" | "Ice" | "Dragon" | "Dark" | "Fairy" | undefined;
export declare function getFlingPower(item?: string): 0 | 10 | 30 | 100 | 40 | 60 | 50 | 85 | 20 | 130 | 110 | 95 | 90 | 80 | 70;
export declare function getNaturalGift(gen: Generation, item: string): {
    t: TypeName;
    p: number;
};
export declare function getTechnoBlast(item: string): "Electric" | "Fire" | "Water" | "Ice" | undefined;
export declare function getMultiAttack(item: string): TypeName | undefined;
