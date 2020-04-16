import { Natures, Generation, StatName } from './data/interface';
export declare type Stat = StatName | 'spc';
export declare type StatsTable<T = number> = {
    [stat in StatName]: T;
} & {
    spc?: T;
};
export declare const STATS: Stat[][];
export declare const Stats: {
    displayStat(stat: Stat): "HP" | "Atk" | "Def" | "SpA" | "SpD" | "Spe" | "Spc";
    shortForm(stat: Stat): "hp" | "at" | "df" | "sa" | "sd" | "sp" | "sl";
    getHPDV(ivs: {
        atk: number;
        def: number;
        spe: number;
        spc: number;
    }): number;
    IVToDV(iv: number): number;
    DVToIV(dv: number): number;
    calcStat(gen: Generation, stat: Stat, base: number, iv: number, ev: number, level: number, nature?: string | undefined): number;
    calcStatADV(natures: Natures, stat: Stat, base: number, iv: number, ev: number, level: number, nature?: string | undefined): number;
    calcStatRBY(stat: Stat, base: number, iv: number, level: number): number;
    calcStatRBYFromDV(stat: Stat, base: number, dv: number, level: number): number;
};
