declare namespace Search {
    export type FacetsKeys = 'languages' | 'journals' | 'authors';

    export interface IValue {
        operator: 'AND' | 'OR';
        value: string[];
    }

    export interface IFacets {
        authors?: IValue;
        languages?: IValue;
        journals?: IValue;
    }
}