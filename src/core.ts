/**
 * ROWS-COLUMNS-LAYOUT: PRODUCTION CORE (v1.6.2) - Stability tested
 * - Tightened TypeScript definitions for better IDE Autocomplete
 * - Eliminated most 'any' usage
 * - Kept 'none' keyword & unified .span() logic
 */

export type StyleValue = string | number;
export interface StyleMap { [key: string]: StyleValue; }
export interface SpanData { t: number, r: number, b: number, l: number; }
export interface SpanConfig { top?: number; right?: number; bottom?: number; left?: number; }
export interface Rule<T> { data: T; indices: number[] | null; }

export type BreakpointMap = Record<string, number>;
export type ResponsiveValue<T> = T | { [breakpoint: string]: T };

// The definitive type for anything that can go into a layout
export type LayoutItem = ResponsiveValue<LayoutNode | number | string>;

export type ChildPropRule = Rule<StyleMap>;
export type SpanRule = Rule<SpanData>;

interface ActiveRule<T> {
    rule: Rule<T>;
    counter: { val: number };
}

const AUTO_SIZE = 0.000001;

// --- HELPERS ---
function configToData(c: SpanConfig): SpanData {
    return { t: c.top || 0, r: c.right || 0, b: c.bottom || 0, l: c.left || 0 };
}

function resolveResponsive<T>(val: ResponsiveValue<T>, width: number, bps: BreakpointMap): T {
    if (val instanceof LayoutNode || typeof val !== 'object' || val === null) return val as T;
    const obj = val as { [key: string]: T };
    const sorted = Object.keys(obj).sort((a, b) => (bps[b] || 0) - (bps[a] || 0));
    for (const bp of sorted) { 
        if (width >= (bps[bp] || 0)) return obj[bp]; 
    }
    return (obj['xs'] ?? obj['default'] ?? (1 as T)) as T; 
}

function applyStyles(el: HTMLElement, styles: StyleMap | undefined) {
    if (!styles) return;
    const { className, class: cls, ...css } = styles as any;
    if (className) el.classList.add(...String(className).split(' '));
    if (cls) el.classList.add(...String(cls).split(' '));
    Object.assign(el.style, css);
}

// --- CORE CLASSES ---
export class LayoutNode {
  public isSkippedSelf = false;
  public offsetIndices: number[] = [];
  public styles: StyleMap = {}; 
  public spanData: SpanData = { t:0, r:0, b:0, l:0 }; 
  public childPropRules: ChildPropRule[] = [];
  public childSpanRules: SpanRule[] = [];

  constructor(
    public size: LayoutItem,
    public type: 'leaf' | 'col' | 'row' = 'leaf',
    public children: LayoutItem[] = []
  ) {}

  col(...children: LayoutItem[]): LayoutNode { 
    return new LayoutNode(this.size, 'col', children); 
  }
  
  row(...children: LayoutItem[]): LayoutNode { 
    return new LayoutNode(this.size, 'row', children); 
  }

  offset(indices?: number[]): LayoutNode {
    if (Array.isArray(indices)) this.offsetIndices = indices;
    else this.isSkippedSelf = true;
    return this;
  }

  props(s: StyleMap): LayoutNode { 
    this.styles = { ...this.styles, ...s }; 
    return this; 
  }
  
  childProps(style: StyleMap, indices?: number[]): LayoutNode {
    this.childPropRules.push({ data: style, indices: indices || null });
    return this;
  }

  span(config: SpanConfig, indices?: number[]): LayoutNode {
    const data = configToData(config);
    if (indices) this.childSpanRules.push({ data, indices });
    else { 
        this.spanData.t += data.t; this.spanData.r += data.r; 
        this.spanData.b += data.b; this.spanData.l += data.l; 
    }
    return this;
  }
}

export class Rect {
  constructor(
    public x: number, public y: number, public w: number, public h: number, 
    public styles: StyleMap, public isSkipped: boolean, public customSize?: string,
    public spanData: SpanData = {t:0, r:0, b:0, l:0}
  ) {}
}

// --- GLOBAL EXTENSIONS ---
declare global {
  interface Number { 
    col(...a: LayoutItem[]): LayoutNode; 
    row(...a: LayoutItem[]): LayoutNode; 
    offset(a?: number[]): LayoutNode; 
    props(s: StyleMap): LayoutNode; 
    childProps(s: StyleMap, a?: number[]): LayoutNode; 
    span(c: SpanConfig, i?: number[]): LayoutNode; 
  }
  interface String { 
    col(...a: LayoutItem[]): LayoutNode; 
    row(...a: LayoutItem[]): LayoutNode; 
    offset(a?: number[]): LayoutNode; 
    props(s: StyleMap): LayoutNode; 
    childProps(s: StyleMap, a?: number[]): LayoutNode; 
    span(c: SpanConfig, i?: number[]): LayoutNode; 
  }
}

let installed = false;
export function installExtensions() {
  if (installed) return; installed = true;
  const setup = (Proto: any, isStr = false) => {
    if (Proto.col) return;
    const w = (ctx: any) => new LayoutNode(isStr ? String(ctx) : ctx);
    Proto.col = function(...a: LayoutItem[]) { return new LayoutNode(isStr ? String(this) : this, 'col', a); };
    Proto.row = function(...a: LayoutItem[]) { return new LayoutNode(isStr ? String(this) : this, 'row', a); };
    Proto.offset = function(a?: number[]) { return w(this).offset(a); };
    Proto.props = function(s: StyleMap) { return w(this).props(s); };
    Proto.childProps = function(s: StyleMap, a?: number[]) { return w(this).childProps(s, a); };
    Proto.span = function(c: SpanConfig, i?: number[]) { return w(this).span(c, i); };
  };
  setup(Number.prototype, false);
  setup(String.prototype, true);
}

export const Engine = {
  bps: { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 } as BreakpointMap,
  _strMap: new Map<string, string>(),
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
      const func = new Function('lg', 'sm', 'Grid', 'auto', 'none', 'return ' + str);
      return func(61.8, 38.2, 100, 'auto', 'none');
    } catch (e) { return undefined; }
  },

  isNode(n: any): n is LayoutNode {
    return n && typeof n === 'object' && Array.isArray((n as LayoutNode).children);
  },

  render(el: HTMLElement, direct?: LayoutNode) {
    installExtensions();
    const currentWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
    let tree = direct;
    if (!tree) {
      const attr = (currentWidth>=1400 && el.getAttribute('layout-xxl')) || 
                   (currentWidth>=1200 && el.getAttribute('layout-xl')) || 
                   (currentWidth>=992 && el.getAttribute('layout-lg')) || 
                   (currentWidth>=768 && el.getAttribute('layout-md')) || 
                   (currentWidth>=576 && el.getAttribute('layout-sm')) || 
                   el.getAttribute('layout');
      if (attr) tree = this.evalLayout(attr);
    }
    if (!tree) return;

    applyStyles(el, tree.styles);

    const leaves: Rect[] = [];
    this.calc(tree, 0, 0, 100, 100, leaves, false, [], [], [], { val: 0 }, currentWidth, {t:0,r:0,b:0,l:0});

    const { cw, rh, xc, yc } = this.mesh(leaves);
    el.style.display = 'grid';
    el.style.gridTemplateColumns = cw.join(' ');
    el.style.gridTemplateRows = rh.join(' ');

    const kids = Array.from(el.children) as HTMLElement[];
    kids.forEach(k => { k.style.gridArea = ''; k.style.display = ''; });

    let kidIdx = 0;
    leaves.forEach(l => {
       if (l.isSkipped) return;
       const k = kids[kidIdx++];
       if (!k) return;
       
       if (l.styles?.display === 'none') { k.style.display = 'none'; return; }

       let cs = this.idx(xc, l.x) + 1, ce = this.idx(xc, l.x + l.w) + 1;
       let rs = this.idx(yc, l.y) + 1, re = this.idx(yc, l.y + l.h) + 1;

       if (l.spanData) {
           cs = Math.max(1, cs - l.spanData.l); rs = Math.max(1, rs - l.spanData.t);
           ce += l.spanData.r; re += l.spanData.b;
       }

       k.style.gridColumn = `${cs} / ${ce}`;
       k.style.gridRow = `${rs} / ${re}`;
       applyStyles(k, l.styles);
    });
  },

  calc(
      n: LayoutItem, x: number, y: number, w: number, h: number, 
      leaves: Rect[], pSkip: boolean, offRules: any[], 
      activePropRules: ActiveRule<StyleMap>[], 
      activeSpanRules: ActiveRule<SpanData>[], 
      counter: { val: number }, currentWidth: number, incomingSpan: SpanData
  ) {
    if (n === undefined || n === null) return;
    
    // Resolve responsive node/value
    const resolved = resolveResponsive(n, currentWidth, this.bps);
    let node: LayoutNode;
    
    if (this.isNode(resolved)) { 
        node = resolved; 
        node.size = resolveResponsive(node.size, currentWidth, this.bps); 
    } else { 
        node = new LayoutNode(resolved as string | number, 'leaf'); 
    }

    const isLayout = this.isNode(node);
    const skip = pSkip || node.isSkippedSelf;
    const offs = [...offRules];
    if (isLayout && node.offsetIndices?.length) offs.push({ idx: node.offsetIndices, c: 0 });

    const currentSpan: SpanData = { ...incomingSpan };
    if (isLayout) {
        currentSpan.t += node.spanData.t; currentSpan.r += node.spanData.r;
        currentSpan.b += node.spanData.b; currentSpan.l += node.spanData.l;
    }
    
    const nextPropRules = [...activePropRules];
    const nextSpanRules = [...activeSpanRules];
    if (node.childPropRules.length) node.childPropRules.forEach(r => nextPropRules.push({ rule: r, counter: {val: 0} }));
    if (node.childSpanRules.length) node.childSpanRules.forEach(r => nextSpanRules.push({ rule: r, counter: {val: 0} }));

    if (node.type === 'leaf' || !node.children.length) {
       let finalSkip = skip;
       offs.forEach(o => { o.c++; if (o.idx.includes(o.c)) finalSkip = true; });

       if (!finalSkip) {
           counter.val++;
           nextPropRules.forEach(t => t.counter.val++);
           nextSpanRules.forEach(t => t.counter.val++);
       }

       const finalSpanLeaf = { ...currentSpan };
       if (!finalSkip) {
           nextSpanRules.forEach(t => {
               if (!t.rule.indices || t.rule.indices.includes(t.counter.val)) {
                   finalSpanLeaf.t += t.rule.data.t; finalSpanLeaf.r += t.rule.data.r;
                   finalSpanLeaf.b += t.rule.data.b; finalSpanLeaf.l += t.rule.data.l;
               }
           });
       }

       const finalStyles = { ...node.styles };
       if (node.size === 'none') finalStyles.display = 'none';
       
       if (!finalSkip) {
           nextPropRules.forEach(t => {
               if (!t.rule.indices || t.rule.indices.includes(t.counter.val)) Object.assign(finalStyles, t.rule.data);
           });
       }

       leaves.push(new Rect(x, y, w, h, finalStyles, finalSkip, typeof node.size === 'string' ? node.size : undefined, finalSpanLeaf));
       return;
    }

    let tw = 0;
    const resolvedChildren = node.children.map(c => {
        let r = resolveResponsive(c, currentWidth, this.bps);
        if(this.isNode(r)) r.size = resolveResponsive(r.size, currentWidth, this.bps);
        return r;
    });

    resolvedChildren.forEach(c => {
       let s = this.isNode(c) ? c.size : c;
       if (s === 'none' || typeof s === 'string') s = 0;
       else if (this.isNode(c) && c.size === 0) s = 1; 
       tw += Number(s);
    });
    if(tw === 0) tw = 1; 

    let pos = (node.type === 'col') ? x : y;
    resolvedChildren.forEach(c => {
       let s = this.isNode(c) ? c.size : c;
       let isSpec = (typeof s === 'string');
       let numSize = isSpec ? 0 : Number(s);
       if (this.isNode(c) && c.size === 0 && !isSpec) numSize = 1;
       let r = numSize / tw; 

       let trackSize = 0;
       if (isSpec && s !== 'none') {
           this._strCounter++;
           trackSize = AUTO_SIZE + (this._strCounter * 0.0000001);
           this._strMap.set(trackSize.toFixed(9), s as string); 
       }
       
       if (node.type === 'col') {
          let cw = isSpec ? trackSize : (w * r);
          this.calc(c, pos, y, cw, h, leaves, skip, offs, nextPropRules, nextSpanRules, counter, currentWidth, {t:0,r:0,b:0,l:0}); 
          pos += cw;
       } else {
          let ch = isSpec ? trackSize : (h * r);
          this.calc(c, x, pos, w, ch, leaves, skip, offs, nextPropRules, nextSpanRules, counter, currentWidth, {t:0,r:0,b:0,l:0}); 
          pos += ch;
       }
    });
  },

  mesh(leaves: Rect[]) {
    this._strCounter = 0; let rx = [0], ry = [0], maxX = 0, maxY = 0;
    leaves.forEach(r => { 
        rx.push(r.x, r.x + r.w); ry.push(r.y, r.y + r.h); 
        maxX = Math.max(maxX, r.x + r.w); maxY = Math.max(maxY, r.y + r.h);
    });
    if (maxX > 1) rx.push(100); if (maxY > 1) ry.push(100);
    const dedup = (arr: number[]) => [...new Set(arr.sort((a,b)=>a-b))].filter((v,i,s)=>i===0|| Math.abs(v-(s[i-1] as number)) > 0.00000001);
    const xc = dedup(rx), yc = dedup(ry);
    const getTracks = (cuts: number[]) => {
        const tracks: string[] = [];
        for(let i=1; i<cuts.length; i++) {
            let size = cuts[i] - cuts[i-1];
            let found: string | null = null;
            for (let [k, v] of this._strMap) if (Math.abs(size - Number(k)) < 0.00000001) { found = v; break; }
            tracks.push(found ? found : size/10 + 'fr');
        }
        return tracks;
    };
    return { xc, yc, cw: getTracks(xc), rh: getTracks(yc) };
  },

  idx(arr: number[], val: number) {
    let idx = -1, min = Infinity;
    arr.forEach((v, i) => { let d = Math.abs(v - val); if (d < min) { min = d; idx = i; } });
    return idx;
  },

  compileCSS(layoutStr: string) {
      const root = this.evalLayout(layoutStr);
      if(!root) return null;
      const leaves: Rect[] = [];
      this.calc(root, 0, 0, 100, 100, leaves, false, [], [], [], { val: 0 }, 1200, {t:0,r:0,b:0,l:0});
      const { cw, rh, xc, yc } = this.mesh(leaves);
      let css = `display: grid; grid-template-columns: ${cw.join(' ')}; grid-template-rows: ${rh.join(' ')};`;
      let childCss = '', kidIdx = 1;
      for(const l of leaves) {
          if(l.isSkipped) continue;
          let cs = this.idx(xc, l.x) + 1, ce = this.idx(xc, l.x + l.w) + 1;
          let rs = this.idx(yc, l.y) + 1, re = this.idx(yc, l.y + l.h) + 1;
          if (l.spanData) { cs = Math.max(1, cs - l.spanData.l); rs = Math.max(1, rs - l.spanData.t); ce += l.spanData.r; re += l.spanData.b; }
          childCss += `\n  & > :nth-child(${kidIdx++}) { grid-area: ${rs} / ${cs} / ${re} / ${ce};${l.styles?.display === 'none' ? ' display: none;' : ''} }`;
      }
      return css + childCss;
  }
};