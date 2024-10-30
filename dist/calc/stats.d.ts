import type { Natures, Generation, TypeName, StatID, StatsTable } from './data/interface';
export declare const STATS: Array<Array<StatID | 'spc'> | StatID[]>;
type HPTypeName = Exclude<TypeName, 'Normal' | 'Fairy' | 'Stellar' | '???'>;
export declare const Stats: {
    displayStat(stat: StatID | 'spc'): "HP" | "Atk" | "Def" | "SpA" | "SpD" | "Spe" | "Spc";
    shortForm(stat: StatID | 'spc'): "hp" | "at" | "df" | "sa" | "sd" | "sp" | "sl";
    getHPDV(ivs: {
        atk: number;
        def: number;
        spe: number;
        spc: number;
    }): number;
    IVToDV(iv: number): number;
    DVToIV(dv: number): number;
    DVsToIVs(dvs: Readonly<Partial<StatsTable>>): Partial<StatsTable<number>>;
    calcStat(gen: Generation, stat: StatID, base: number, iv: number, ev: number, level: number, nature?: string): number;
    calcStatADV(natures: Natures, stat: StatID, base: number, iv: number, ev: number, level: number, nature?: string): number;
    calcStatRBY(stat: StatID, base: number, iv: number, level: number): number;
    calcStatRBYFromDV(stat: StatID, base: number, dv: number, level: number): number;
    getHiddenPowerIVs(gen: Generation, hpType: HPTypeName): Partial<StatsTable<number>> | undefined;
    getHiddenPower(gen: Generation, ivs: StatsTable): {
        type: TypeName;
        power: number;
    };
};
export {};
