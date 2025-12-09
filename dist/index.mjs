// src/core.ts
var AUTO_SIZE = 1e-6;
var LayoutNode = class _LayoutNode {
  constructor(size, type = "leaf", children = []) {
    this.size = size;
    this.type = type;
    this.children = children;
    this.isSkippedSelf = false;
    this.offsetIndices = [];
    this.styles = {};
    this.childPropsRules = [];
  }
  col(...children) {
    return new _LayoutNode(this.size, "col", children);
  }
  row(...children) {
    return new _LayoutNode(this.size, "row", children);
  }
  offset(indices) {
    if (Array.isArray(indices)) this.offsetIndices = indices;
    else this.isSkippedSelf = true;
    return this;
  }
  props(s) {
    this.styles = { ...this.styles, ...s };
    return this;
  }
  childProps(style, indices) {
    this.childPropsRules.push({ style, indices: indices || null });
    return this;
  }
};
var Rect = class {
  constructor(x, y, w, h, styles, isSkipped, customSize) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.styles = styles;
    this.isSkipped = isSkipped;
    this.customSize = customSize;
  }
};
var installed = false;
function installExtensions() {
  if (installed) return;
  installed = true;
  const n = (v) => new LayoutNode(v);
  if (!Number.prototype.col) {
    const P = Number.prototype;
    P.col = function(...a) {
      return new LayoutNode(this, "col", a);
    };
    P.row = function(...a) {
      return new LayoutNode(this, "row", a);
    };
    P.offset = function(a) {
      return n(this).offset(a);
    };
    P.props = function(s) {
      return n(this).props(s);
    };
    P.childProps = function(s, a) {
      return n(this).childProps(s, a);
    };
  }
  if (!String.prototype.col) {
    const S = String.prototype;
    S.col = function(...a) {
      return new LayoutNode(String(this), "col", a);
    };
    S.row = function(...a) {
      return new LayoutNode(String(this), "row", a);
    };
    S.offset = function(a) {
      return n(String(this)).offset(a);
    };
    S.props = function(s) {
      return n(String(this)).props(s);
    };
    S.childProps = function(s, a) {
      return n(String(this)).childProps(s, a);
    };
  }
}
var Engine = {
  bps: { sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 },
  _strMap: /* @__PURE__ */ new Map(),
  _strCounter: 0,
  init() {
    installExtensions();
    this.upd();
    if (typeof window !== "undefined") window.addEventListener("resize", () => this.upd());
  },
  upd() {
    if (typeof document !== "undefined") document.querySelectorAll("[layout]").forEach((el) => this.render(el));
  },
  evalLayout(str) {
    if (!str) return void 0;
    try {
      const func = new Function("lg", "sm", "Grid", "auto", "return " + str);
      return func(61.8, 38.2, 100, "auto");
    } catch (e) {
      console.error(`Layout Error: "${str}"`, e);
      return void 0;
    }
  },
  isNode(n) {
    return n && typeof n === "object" && Array.isArray(n.children) && (n.type === "col" || n.type === "row" || n.type === "leaf");
  },
  render(el, direct) {
    installExtensions();
    let tree = direct;
    if (!tree) {
      const w = window.innerWidth;
      const bps = ["xxl", "xl", "lg", "md", "sm"];
      let attr = el.getAttribute("layout");
      for (let b of bps) if (w >= this.bps[b] && el.hasAttribute(`layout-${b}`)) {
        attr = el.getAttribute(`layout-${b}`);
        break;
      }
      if (attr) tree = this.evalLayout(attr);
    }
    if (!tree) return;
    if (tree.styles) Object.assign(el.style, tree.styles);
    const domStyles = [];
    const scan = (n) => {
      if (this.isNode(n)) {
        if (n.childPropsRules) domStyles.push(...n.childPropsRules);
        n.children.forEach(scan);
      }
    };
    scan(tree);
    const leaves = [];
    this.calc(tree, 0, 0, 100, 100, leaves, false, []);
    const { cw, rh, xc, yc } = this.mesh(leaves);
    el.style.gridTemplateColumns = cw.join(" ");
    el.style.gridTemplateRows = rh.join(" ");
    const kids = Array.from(el.children);
    kids.forEach((k) => {
      k.style.gridColumn = "";
      k.style.gridRow = "";
      k.style.cssText = "";
    });
    kids.forEach((k, i) => {
      domStyles.forEach((r) => {
        if (!r.indices || r.indices.includes(i + 1)) Object.assign(k.style, r.style);
      });
    });
    let kidIdx = 0;
    leaves.forEach((l) => {
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
  calc(n, x, y, w, h, leaves, pSkip, offRules) {
    if (!n) return;
    if (typeof n === "number" || n === "auto") n = new LayoutNode(n === "auto" ? "auto" : n, "leaf");
    const isLayoutNode = this.isNode(n);
    const skip = pSkip || isLayoutNode && n.isSkippedSelf;
    const offs = [...offRules];
    if (isLayoutNode && n.offsetIndices?.length) offs.push({ idx: n.offsetIndices, c: 0 });
    let customSize = void 0;
    if (isLayoutNode && typeof n.size === "string") customSize = n.size;
    if (!isLayoutNode || !n.children.length) {
      let finalSkip = skip;
      offs.forEach((r) => {
        r.c++;
        if (r.idx.includes(r.c)) finalSkip = true;
      });
      const s = isLayoutNode ? n.styles : {};
      leaves.push(new Rect(x, y, w, h, s, finalSkip, customSize));
      return;
    }
    let tw = 0;
    n.children.forEach((c) => {
      let s = this.isNode(c) ? c.size : c;
      if (typeof s === "string") s = 0;
      else if (this.isNode(c) && c.size === 0) s = 1;
      tw += Number(s);
    });
    if (tw === 0) tw = 1;
    let pos = n.type === "col" ? x : y;
    n.children.forEach((c) => {
      let s = this.isNode(c) ? c.size : c;
      let isString = typeof s === "string";
      let numSize = isString ? 0 : Number(s);
      if (this.isNode(c) && c.size === 0 && !isString) numSize = 1;
      let r = numSize / tw;
      let stringWidth = 0;
      if (isString) {
        this._strCounter++;
        stringWidth = AUTO_SIZE + this._strCounter * 1e-7;
        this._strMap.set(stringWidth, s);
      }
      if (n.type === "col") {
        let cw = isString ? stringWidth : w * r;
        this.calc(c, pos, y, cw, h, leaves, skip, offs);
        pos += cw;
      } else {
        let ch = isString ? stringWidth : h * r;
        this.calc(c, x, pos, w, ch, leaves, skip, offs);
        pos += ch;
      }
    });
  },
  mesh(leaves) {
    this._strCounter = 0;
    let rx = [0], ry = [0];
    let maxX = 0, maxY = 0;
    leaves.forEach((r) => {
      rx.push(r.x, r.x + r.w);
      ry.push(r.y, r.y + r.h);
      if (r.x + r.w > maxX) maxX = r.x + r.w;
      if (r.y + r.h > maxY) maxY = r.y + r.h;
    });
    if (maxX > 1) rx.push(100);
    if (maxY > 1) ry.push(100);
    const dedup = (arr) => [...new Set(arr.sort((a, b) => a - b))].filter((v, i, s) => i === 0 || Math.abs(v - s[i - 1]) > 1e-8);
    const xc = dedup(rx);
    const yc = dedup(ry);
    const getTracks = (cuts) => {
      const tracks = [];
      for (let i = 1; i < cuts.length; i++) {
        let size = cuts[i] - cuts[i - 1];
        let foundString = null;
        for (let [k, v] of this._strMap) {
          if (Math.abs(size - k) < 1e-8) {
            foundString = v;
            break;
          }
        }
        if (foundString) tracks.push(foundString);
        else tracks.push(size + "fr");
      }
      return tracks;
    };
    return { xc, yc, cw: getTracks(xc), rh: getTracks(yc) };
  },
  idx(arr, val) {
    let idx = -1, min = Infinity;
    arr.forEach((v, i) => {
      let d = Math.abs(v - val);
      if (d < min) {
        min = d;
        idx = i;
      }
    });
    return idx;
  }
};

// src/index.ts
var Grid = 100;
var lg = 61.8;
var sm = 38.2;
var auto = "auto";
if (typeof window !== "undefined") {
  installExtensions();
}
export {
  Engine,
  Grid,
  LayoutNode,
  Rect,
  auto,
  installExtensions,
  lg,
  sm
};
//# sourceMappingURL=index.mjs.map