/**
 * ROWS-COLUMNS-LAYOUT: NATIVE EDITION
 */

// --- TYPES ---
export interface StyleMap { [key: string]: string | number; }
export interface SpreadData { t: number, r: number, b: number, l: number; }
export interface Rule<T> { data: T; indices: number[] | null; }

// Tracking object for active rules in recursion
interface ActiveRule<T> {
    rule: Rule<T>;
    counter: { val: number }; // Object reference so it increments across siblings
}

// CONSTANTS
const AUTO_SIZE = 0.000001;

// --- HELPERS ---
function parseSpread(directions: string[]): SpreadData {
  const d = { t: 0, r: 0, b: 0, l: 0 };
  directions.forEach(dir => {
    const m = dir.match(/^([trbl])(\d+)$/);
    if (m) d[m[1] as keyof SpreadData] += parseInt(m[2], 10);
  });
  return d;
}

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
  spreadData: SpreadData = { t:0, r:0, b:0, l:0 }; 

  // Rules targeting scoped children
  childPropRules: Rule<StyleMap>[] = [];
  childSpreadRules: Rule<SpreadData>[] = [];

  col(...children: any[]) { return new LayoutNode(this.size, 'col', children); }
  row(...children: any[]) { return new LayoutNode(this.size, 'row', children); }

  offset(indices?: number[]) {
    if (Array.isArray(indices)) this.offsetIndices = indices;
    else this.isSkippedSelf = true;
    return this;
  }

  props(s: StyleMap) { this.styles = { ...this.styles, ...s }; return this; }
  
  childProps(style: StyleMap, indices?: number[]) {
    this.childPropRules.push({ data: style, indices: indices || null });
    return this;
  }

  spread(directions: string[], indices?: number[]) {
    if (indices) {
      this.childSpreadRules.push({ data: parseSpread(directions), indices });
    } else {
      const data = parseSpread(directions);
      this.spreadData.t += data.t;
      this.spreadData.r += data.r;
      this.spreadData.b += data.b;
      this.spreadData.l += data.l;
    }
    return this;
  }
}

export class Rect {
  constructor(
    public x: number, public y: number, public w: number, public h: number,
    public styles: any, public isSkipped: boolean, 
    public customSize?: string,
    public spread: SpreadData = {t:0,r:0,b:0,l:0}
  ) {}
}

// --- 2. PROTOTYPE EXTENSIONS ---
declare global {
  interface Number { col(...a:any):LayoutNode; row(...a:any):LayoutNode; offset(a?:any):LayoutNode; props(s:any):LayoutNode; childProps(s:any,a?:any):LayoutNode; spread(a:string[], i?:number[]):LayoutNode; }
  interface String { col(...a:any):LayoutNode; row(...a:any):LayoutNode; offset(a?:any):LayoutNode; props(s:any):LayoutNode; childProps(s:any,a?:any):LayoutNode; spread(a:string[], i?:number[]):LayoutNode; }
  interface Window { [key:string]: any }
}

let installed = false;
export function installExtensions() {
  if (installed) return; installed = true;
  const n = (v: number | string) => new LayoutNode(v);
  const setup = (Proto: any, isStr = false) => {
    if (Proto.col) return;
    const w = (ctx: any) => n(isStr ? String(ctx) : ctx);
    Proto.col = function(...a:any[]) { return new LayoutNode(isStr ? String(this) : this, 'col', a); };
    Proto.row = function(...a:any[]) { return new LayoutNode(isStr ? String(this) : this, 'row', a); };
    Proto.offset = function(a?:any) { return w(this).offset(a); };
    Proto.props = function(s:any) { return w(this).props(s); };
    Proto.childProps = function(s:any, a?:any) { return w(this).childProps(s, a); };
    Proto.spread = function(a:string[], i?:number[]) { return w(this).spread(a, i); };
  };
  setup(Number.prototype, false);
  setup(String.prototype, true);
}

// --- 3. THE ENGINE ---
export const Engine = {
  bps: { sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 } as any,
  _strMap: new Map<number, string>(),
  _strCounter: 0,

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
      const func = new Function('lg', 'sm', 'Grid', 'auto', 'return ' + str);
      return func(61.8, 38.2, 100, 'auto');
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

    const leaves: Rect[] = [];
    
    // START RECURSION
    // We pass empty arrays for active rules. 
    this.calc(tree, 0, 0, 100, 100, leaves, false, [], [], []);

    const { cw, rh, xc, yc } = this.mesh(leaves);
    el.style.display = "grid";
    el.style.gridTemplateColumns = cw.join(' ');
    el.style.gridTemplateRows = rh.join(' ');

    const kids = Array.from(el.children) as HTMLElement[];
    kids.forEach((k) => { k.style.gridColumn=''; k.style.gridRow=''; k.style.cssText=''; });

    let kidIdx = 0;
    leaves.forEach(l => {
       if (l.isSkipped) return;
       if (!kids[kidIdx]) return;
       const k = kids[kidIdx++];
       
       let cs = this.idx(xc, l.x) + 1;
       let ce = this.idx(xc, l.x + l.w) + 1;
       let rs = this.idx(yc, l.y) + 1;
       let re = this.idx(yc, l.y + l.h) + 1;

       // APPLY SPREAD
       if (l.spread) {
           cs = Math.max(1, cs - l.spread.l);
           rs = Math.max(1, rs - l.spread.t);
           ce += l.spread.r;
           re += l.spread.b;
       }

       k.style.gridColumn = `${cs} / ${ce}`;
       k.style.gridRow = `${rs} / ${re}`;
       
       if (l.styles) Object.assign(k.style, l.styles);
    });
  },

  calc(
      n: any, x: number, y: number, w: number, h: number, 
      leaves: Rect[], pSkip: boolean, offRules: any[], 
      
      // TRACKING STACKS
      activePropRules: ActiveRule<StyleMap>[],
      activeSpreadRules: ActiveRule<SpreadData>[]
  ) {
    if (!n) return;
    if (typeof n === 'number' || n === 'auto') n = new LayoutNode(n === 'auto' ? 'auto' : n, 'leaf');

    const isLayoutNode = this.isNode(n);
    const skip = pSkip || (isLayoutNode && n.isSkippedSelf);
    
    // 1. Manage Offsets (Local to this node)
    const offs = [...offRules];
    if (isLayoutNode && n.offsetIndices?.length) offs.push({ idx: n.offsetIndices, c: 0 });

    let customSize = undefined;
    if (isLayoutNode && typeof n.size === 'string') customSize = n.size;
    
    // 2. PREPARE NEW RULES
    // If this node defines rules, create NEW trackers starting at 0
    const nextPropRules = [...activePropRules];
    const nextSpreadRules = [...activeSpreadRules];

    if (isLayoutNode) {
        if(n.childPropRules.length > 0) {
            n.childPropRules.forEach((r: any) => nextPropRules.push({ rule: r, counter: {val: 0} }));
        }
        if(n.childSpreadRules.length > 0) {
            n.childSpreadRules.forEach((r: any) => nextSpreadRules.push({ rule: r, counter: {val: 0} }));
        }
    }

    // --- LEAF NODE LOGIC ---
    if (!isLayoutNode || !n.children.length) {
       // A. Calculate if this leaf is skipped by offset
       let finalSkip = skip;
       offs.forEach(r => { r.c++; if (r.idx.includes(r.c)) finalSkip = true; });

       // B. If NOT skipped, it counts as a visual child for all active rules
       //    So we increment their counters.
       if (!finalSkip) {
           nextPropRules.forEach(t => t.counter.val++);
           nextSpreadRules.forEach(t => t.counter.val++);
       }

       // C. Calculate Intrinsic Spread (Self) + Rule-Based Spread (Ancestors)
       const finalSpread = isLayoutNode ? { ...n.spreadData } : {t:0,r:0,b:0,l:0};

       if (!finalSkip) {
           nextSpreadRules.forEach(tracker => {
               if (!tracker.rule.indices || tracker.rule.indices.includes(tracker.counter.val)) {
                   finalSpread.t += tracker.rule.data.t;
                   finalSpread.r += tracker.rule.data.r;
                   finalSpread.b += tracker.rule.data.b;
                   finalSpread.l += tracker.rule.data.l;
               }
           });
       }

       // D. Calculate Styles
       const finalStyles = isLayoutNode ? { ...n.styles } : {};
       if (!finalSkip) {
           nextPropRules.forEach(tracker => {
               if (!tracker.rule.indices || tracker.rule.indices.includes(tracker.counter.val)) {
                   Object.assign(finalStyles, tracker.rule.data);
               }
           });
       }

       leaves.push(new Rect(x, y, w, h, finalStyles, finalSkip, customSize, finalSpread));
       return;
    }

    // --- CONTAINER LOGIC ---
    let tw = 0;
    n.children.forEach((c: any) => {
       let s = this.isNode(c) ? c.size : c;
       if (typeof s === 'string') s = 0;
       else if (this.isNode(c) && c.size === 0) s = 1; 
       tw += Number(s);
    });
    if(tw === 0) tw = 1; 

    let pos = (n.type === 'col') ? x : y;
    
    n.children.forEach((c: any, i: number) => {
       let s = this.isNode(c) ? c.size : c;
       let isString = (typeof s === 'string');
       let numSize = isString ? 0 : Number(s);
       if (this.isNode(c) && c.size === 0 && !isString) numSize = 1;
       let r = numSize / tw; 

       let stringWidth = 0;
       if (isString) {
           this._strCounter++;
           stringWidth = AUTO_SIZE + (this._strCounter * 0.0000001);
           this._strMap.set(stringWidth, s as string); 
       }

       if (n.type === 'col') {
          let cw = isString ? stringWidth : (w * r);
          this.calc(c, pos, y, cw, h, leaves, skip, offs, nextPropRules, nextSpreadRules); 
          pos += cw;
       } else {
          let ch = isString ? stringWidth : (h * r);
          this.calc(c, x, pos, w, ch, leaves, skip, offs, nextPropRules, nextSpreadRules); 
          pos += ch;
       }
    });
  },

  mesh(leaves: Rect[]) {
    this._strCounter = 0; 
    let rx = [0], ry = [0]; 
    let maxX = 0, maxY = 0;
    leaves.forEach(r => { 
        rx.push(r.x, r.x + r.w); ry.push(r.y, r.y + r.h); 
        if(r.x + r.w > maxX) maxX = r.x + r.w;
        if(r.y + r.h > maxY) maxY = r.y + r.h;
    });
    if (maxX > 1) rx.push(100); if (maxY > 1) ry.push(100);

    const dedup = (arr: number[]) => [...new Set(arr.sort((a,b)=>a-b))].filter((v,i,s)=>i===0|| Math.abs(v-s[i-1]) > 0.00000001);
    const xc = dedup(rx);
    const yc = dedup(ry);

    const getTracks = (cuts: number[]) => {
        const tracks = [];
        for(let i=1; i<cuts.length; i++) {
            let size = cuts[i] - cuts[i-1];
            let found = null;
            for (let [k, v] of this._strMap) { if (Math.abs(size - k) < 0.00000001) { found = v; break; } }
            tracks.push(found ? found : size + 'fr');
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