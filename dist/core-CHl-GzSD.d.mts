/**
 * ROWS-COLUMNS-LAYOUT: NATIVE EDITION
 */
interface StyleMap {
    [key: string]: string | number;
}
interface ChildPropRule {
    style: StyleMap;
    indices: number[] | null;
}
declare class LayoutNode {
    size: number;
    type: 'leaf' | 'col' | 'row';
    children: any[];
    constructor(size: number, type?: 'leaf' | 'col' | 'row', children?: any[]);
    isSkippedSelf: boolean;
    offsetIndices: number[];
    styles: StyleMap;
    childPropsRules: ChildPropRule[];
    offset(indices?: number[]): this;
    props(s: StyleMap): this;
    childProps(style: StyleMap, indices?: number[]): this;
}
declare class Rect {
    x: number;
    y: number;
    w: number;
    h: number;
    styles: any;
    isSkipped: boolean;
    constructor(x: number, y: number, w: number, h: number, styles: any, isSkipped: boolean);
}
declare global {
    interface Number {
        col(...a: any): LayoutNode;
        row(...a: any): LayoutNode;
        offset(a?: any): LayoutNode;
        props(s: any): LayoutNode;
        childProps(s: any, a?: any): LayoutNode;
    }
    interface Window {
        [key: string]: any;
    }
}
declare function installExtensions(): void;
declare const Engine: {
    bps: any;
    init(): void;
    upd(): void;
    evalLayout(str: string): LayoutNode | undefined;
    isNode(n: any): boolean;
    render(el: HTMLElement, direct?: LayoutNode): void;
    calc(n: any, x: number, y: number, w: number, h: number, leaves: Rect[], pSkip: boolean, offRules: any[]): void;
    mesh(leaves: Rect[]): {
        xc: number[];
        yc: number[];
        cw: string[];
        rh: string[];
    };
    idx(arr: number[], val: number): number;
};

export { type ChildPropRule as C, Engine as E, LayoutNode as L, Rect as R, type StyleMap as S, installExtensions as i };
