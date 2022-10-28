import { Natures, Generation, TypeName, StatName, StatsTable } from './data/interface';
export declare const STATS: Array<Array<StatName | 'spc'> | StatName[]>;
declare type HPTypeName = Exclude<TypeName, 'Normal' | 'Fairy' | '???'>;
export declare const Stats: {
    displayStat(stat: StatName | 'spc'): "Atk" | "Def" | "SpA" | "SpD" | "HP" | "Spe" | "Spc";
    shortForm(stat: StatName | 'spc'): "hp" | "at" | "df" | "sa" | "sd" | "sp" | "sl";
    getHPDV(ivs: {
        atk: number;
        def: number;
        spe: number;
        spc: number;
    }): number;
    IVToDV(iv: number): number;
    DVToIV(dv: number): number;
    DVsToIVs(dvs: Readonly<Partial<StatsTable>>): Partial<StatsTable<number>>;
    calcStat(gen: Generation, stat: StatName, base: number, iv: number, ev: number, level: number, nature?: string | undefined): number;
    calcStatADV(natures: Natures, stat: StatName, base: number, iv: number, ev: number, level: number, nature?: string | undefined): number;
    calcStatRBY(stat: StatName, base: number, iv: number, level: number): number;
    calcStatRBYFromDV(stat: StatName, base: number, dv: number, level: number): number;
    getHiddenPowerIVs(gen: Generation, hpType: HPTypeName): Partial<StatsTable<number>> | undefined;
    getHiddenPower(gen: Generation, ivs: StatsTable): {
        type: TypeName;
        power: number;
    };
};
export {};
