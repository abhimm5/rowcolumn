/**
 * ROWS-COLUMNS-LAYOUT: NATIVE EDITION
 */

// --- TYPES ---
export interface StyleMap { [key: string]: string | number; }
export interface ChildPropRule { style: StyleMap; indices: number[] | null; }

// CONSTANTS
const AUTO_SIZE = 0.000001; // Internal placeholder for 'auto' tracks

// --- 1. CORE CLASSES ---
export class LayoutNode {
  constructor(
    public size: number | string,
    public type: 'leaf' | 'col' | 'row' = 'leaf',
    public children: any[] = []
  ) {}

  isSkippedSelf = false;
  offsetIndices: number[] = [];
  styles: StyleMap = {};
  childPropsRules: ChildPropRule[] = [];

  // --- NEW: Allow chaining directly on Nodes (fixes auto.col) ---
  col(...children: any[]) { return new LayoutNode(this.size, 'col', children); }
  row(...children: any[]) { return new LayoutNode(this.size, 'row', children); }

  offset(indices?: number[]) {
    if (Array.isArray(indices)) this.offsetIndices = indices;
    else this.isSkippedSelf = true;
    return this;
  }
  props(s: StyleMap) { this.styles = { ...this.styles, ...s }; return this; }
  childProps(style: StyleMap, indices?: number[]) {
    this.childPropsRules.push({ style, indices: indices || null });
    return this;
  }
}

export class Rect {
  constructor(
    public x: number, 
    public y: number, 
    public w: number, 
    public h: number, 
    public styles: any, 
    public isSkipped: boolean
  ) {}
}

// --- 2. PROTOTYPE EXTENSIONS ---
declare global {
  interface Number { col(...a:any):LayoutNode; row(...a:any):LayoutNode; offset(a?:any):LayoutNode; props(s:any):LayoutNode; childProps(s:any,a?:any):LayoutNode; }
  interface Window { [key:string]: any }
}

let installed = false;
export function installExtensions() {
  if (installed) return; installed = true;
  if ((Number.prototype as any).col) return;
  const n = (v: number) => new LayoutNode(v);
  const P = Number.prototype as any;
  P.col = function(...a:any[]) { return new LayoutNode(this, 'col', a); };
  P.row = function(...a:any[]) { return new LayoutNode(this, 'row', a); };
  P.offset = function(a?:any) { return n(this).offset(a); };
  P.props = function(s:any) { return n(this).props(s); };
  P.childProps = function(s:any, a?:any) { return n(this).childProps(s, a); };
}

// --- 3. THE ENGINE ---
export const Engine = {
  bps: { sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 } as any,

  init() {
    installExtensions();
    this.upd();
    if (typeof window !== 'undefined') window.addEventListener('resize', () => this.upd());
  },

  upd() {
    if (typeof document !== 'undefined') document.querySelectorAll('[layout]').forEach(el => this.render(el as HTMLElement));
  },

  evalLayout(str: string): LayoutNode | undefined {
    if (!str) return undefined;
    try {
      // FIX: Pass 'auto' as a LayoutNode, not a string
      const func = new Function('lg', 'sm', 'Grid', 'auto', 'return ' + str);
      return func(61.8, 38.2, 100, new LayoutNode('auto')); 
    } catch (e) {
      console.error(`Layout Error: "${str}"`, e);
      return undefined;
    }
  },

  isNode(n: any): boolean {
    return n && typeof n === 'object' && Array.isArray(n.children) && (n.type === 'col' || n.type === 'row' || n.type === 'leaf');
  },

  render(el: HTMLElement, direct?: LayoutNode) {
    installExtensions();
    
    let tree = direct;
    if (!tree) {
      const w = window.innerWidth;
      const bps = ['xxl', 'xl', 'lg', 'md', 'sm'];
      let attr = el.getAttribute('layout');
      for (let b of bps) if (w >= this.bps[b] && el.hasAttribute(`layout-${b}`)) { attr = el.getAttribute(`layout-${b}`); break; }
      
      if (attr) tree = this.evalLayout(attr);
    }
    
    if (!tree) return;

    if (tree.styles) Object.assign(el.style, tree.styles);

    const domStyles: ChildPropRule[] = [];
    const scan = (n: any) => {
       if(this.isNode(n)) {
         if(n.childPropsRules) domStyles.push(...n.childPropsRules);
         n.children.forEach(scan);
       }
    };
    scan(tree);

    const leaves: Rect[] = [];
    this.calc(tree, 0, 0, 100, 100, leaves, false, []);

    const { cw, rh, xc, yc } = this.mesh(leaves);
    el.style.gridTemplateColumns = cw.join(' ');
    el.style.gridTemplateRows = rh.join(' ');

    const kids = Array.from(el.children) as HTMLElement[];
    kids.forEach((k) => { k.style.gridColumn=''; k.style.gridRow=''; k.style.cssText=''; });

    kids.forEach((k, i) => {
       domStyles.forEach(r => {
         if (!r.indices || r.indices.includes(i + 1)) Object.assign(k.style, r.style);
       });
    });

    let kidIdx = 0;
    leaves.forEach(l => {
       if (l.isSkipped) return;
       if (!kids[kidIdx]) return;
       const k = kids[kidIdx++];
       
       const cs = this.idx(xc, l.x) + 1;
       const ce = this.idx(xc, l.x + l.w) + 1;
       const rs = this.idx(yc, l.y) + 1;
       const re = this.idx(yc, l.y + l.h) + 1;

       k.style.gridColumn = `${cs} / ${ce}`;
       k.style.gridRow = `${rs} / ${re}`;
       
       if (l.styles) Object.assign(k.style, l.styles);
    });
  },

  calc(n: any, x: number, y: number, w: number, h: number, leaves: Rect[], pSkip: boolean, offRules: any[]) {
    if (!n) return;
    if (typeof n === 'number' || n === 'auto') n = new LayoutNode(n === 'auto' ? 'auto' : n, 'leaf');

    const isLayoutNode = this.isNode(n);
    const skip = pSkip || (isLayoutNode && n.isSkippedSelf);
    const offs = [...offRules];
    if (isLayoutNode && n.offsetIndices?.length) offs.push({ idx: n.offsetIndices, c: 0 });

    if (!isLayoutNode || !n.children.length) {
       let finalSkip = skip;
       offs.forEach(r => { r.c++; if (r.idx.includes(r.c)) finalSkip = true; });
       const s = isLayoutNode ? n.styles : {}; 
       leaves.push(new Rect(x, y, w, h, s, finalSkip));
       return;
    }

    let tw = 0;
    n.children.forEach((c: any) => {
       let s = this.isNode(c) ? c.size : c;
       if (s === 'auto') s = 0; 
       else if (this.isNode(c) && c.size === 0) s = 1; 
       tw += Number(s);
    });
    if(tw === 0) tw = 1;

    let pos = (n.type === 'col') ? x : y;
    
    n.children.forEach((c: any) => {
       let s = this.isNode(c) ? c.size : c;
       const isAuto = (s === 'auto');
       let numSize = isAuto ? 0 : Number(s);
       if (this.isNode(c) && c.size === 0 && !isAuto) numSize = 1;

       let r = numSize / tw; 

       if (n.type === 'col') {
          let cw = isAuto ? AUTO_SIZE : (w * r);
          this.calc(c, pos, y, cw, h, leaves, skip, offs); 
          pos += cw;
       } else {
          let ch = isAuto ? AUTO_SIZE : (h * r);
          this.calc(c, x, pos, w, ch, leaves, skip, offs); 
          pos += ch;
       }
    });
  },

  mesh(leaves: Rect[]) {
    let rx = [0, 100], ry = [0, 100];
    leaves.forEach(r => { rx.push(r.x, r.x + r.w); ry.push(r.y, r.y + r.h); });
    
    const dedup = (a: number[]) => [...new Set(a.sort((a,b)=>a-b))].filter((v,i,s)=>i===0|| Math.abs(v-s[i-1]) > (AUTO_SIZE/10));
    const xc = dedup(rx), yc = dedup(ry);

    const getTracks = (cuts: number[]) => {
        const tracks = [];
        for(let i=1; i<cuts.length; i++) {
            let size = cuts[i] - cuts[i-1];
            if (Math.abs(size - AUTO_SIZE) < 0.0000001) tracks.push('auto');
            else tracks.push(size + 'fr');
        }
        return tracks;
    };

    return { xc, yc, cw: getTracks(xc), rh: getTracks(yc) };
  },

  idx(arr: number[], val: number) {
    let idx = -1, min = Infinity;
    arr.forEach((v, i) => { let d = Math.abs(v - val); if (d < min) { min = d; idx = i; } });
    return idx;
  }
};