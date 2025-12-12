// src/react.tsx
import { useRef, useEffect } from "react";

// src/core.ts
var AUTO_SIZE = 1e-6;
function parseSpread(directions) {
  const d = { t: 0, r: 0, b: 0, l: 0 };
  directions.forEach((dir) => {
    const m = dir.match(/^([trbl])(\d+)$/);
    if (m) d[m[1]] += parseInt(m[2], 10);
  });
  return d;
}
var LayoutNode = class _LayoutNode {
  constructor(size, type = "leaf", children = []) {
    this.size = size;
    this.type = type;
    this.children = children;
    this.isSkippedSelf = false;
    this.offsetIndices = [];
    this.styles = {};
    this.spreadData = { t: 0, r: 0, b: 0, l: 0 };
    // Rules targeting scoped children
    this.childPropRules = [];
    this.childSpreadRules = [];
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
    this.childPropRules.push({ data: style, indices: indices || null });
    return this;
  }
  spread(directions, indices) {
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
};
var Rect = class {
  constructor(x, y, w, h, styles, isSkipped, customSize, spread = { t: 0, r: 0, b: 0, l: 0 }) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.styles = styles;
    this.isSkipped = isSkipped;
    this.customSize = customSize;
    this.spread = spread;
  }
};
var installed = false;
function installExtensions() {
  if (installed) return;
  installed = true;
  const n = (v) => new LayoutNode(v);
  const setup = (Proto, isStr = false) => {
    if (Proto.col) return;
    const w = (ctx) => n(isStr ? String(ctx) : ctx);
    Proto.col = function(...a) {
      return new LayoutNode(isStr ? String(this) : this, "col", a);
    };
    Proto.row = function(...a) {
      return new LayoutNode(isStr ? String(this) : this, "row", a);
    };
    Proto.offset = function(a) {
      return w(this).offset(a);
    };
    Proto.props = function(s) {
      return w(this).props(s);
    };
    Proto.childProps = function(s, a) {
      return w(this).childProps(s, a);
    };
    Proto.spread = function(a, i) {
      return w(this).spread(a, i);
    };
  };
  setup(Number.prototype, false);
  setup(String.prototype, true);
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
    const leaves = [];
    this.calc(tree, 0, 0, 100, 100, leaves, false, [], [], []);
    const { cw, rh, xc, yc } = this.mesh(leaves);
    el.style.display = "grid";
    el.style.gridTemplateColumns = cw.join(" ");
    el.style.gridTemplateRows = rh.join(" ");
    const kids = Array.from(el.children);
    kids.forEach((k) => {
      k.style.gridColumn = "";
      k.style.gridRow = "";
      k.style.cssText = "";
    });
    let kidIdx = 0;
    leaves.forEach((l) => {
      if (l.isSkipped) return;
      if (!kids[kidIdx]) return;
      const k = kids[kidIdx++];
      let cs = this.idx(xc, l.x) + 1;
      let ce = this.idx(xc, l.x + l.w) + 1;
      let rs = this.idx(yc, l.y) + 1;
      let re = this.idx(yc, l.y + l.h) + 1;
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
  calc(n, x, y, w, h, leaves, pSkip, offRules, activePropRules, activeSpreadRules) {
    if (!n) return;
    if (typeof n === "number" || n === "auto") n = new LayoutNode(n === "auto" ? "auto" : n, "leaf");
    const isLayoutNode = this.isNode(n);
    const skip = pSkip || isLayoutNode && n.isSkippedSelf;
    const offs = [...offRules];
    if (isLayoutNode && n.offsetIndices?.length) offs.push({ idx: n.offsetIndices, c: 0 });
    let customSize = void 0;
    if (isLayoutNode && typeof n.size === "string") customSize = n.size;
    const nextPropRules = [...activePropRules];
    const nextSpreadRules = [...activeSpreadRules];
    if (isLayoutNode) {
      if (n.childPropRules.length > 0) {
        n.childPropRules.forEach((r) => nextPropRules.push({ rule: r, counter: { val: 0 } }));
      }
      if (n.childSpreadRules.length > 0) {
        n.childSpreadRules.forEach((r) => nextSpreadRules.push({ rule: r, counter: { val: 0 } }));
      }
    }
    if (!isLayoutNode || !n.children.length) {
      let finalSkip = skip;
      offs.forEach((r) => {
        r.c++;
        if (r.idx.includes(r.c)) finalSkip = true;
      });
      if (!finalSkip) {
        nextPropRules.forEach((t) => t.counter.val++);
        nextSpreadRules.forEach((t) => t.counter.val++);
      }
      const finalSpread = isLayoutNode ? { ...n.spreadData } : { t: 0, r: 0, b: 0, l: 0 };
      if (!finalSkip) {
        nextSpreadRules.forEach((tracker) => {
          if (!tracker.rule.indices || tracker.rule.indices.includes(tracker.counter.val)) {
            finalSpread.t += tracker.rule.data.t;
            finalSpread.r += tracker.rule.data.r;
            finalSpread.b += tracker.rule.data.b;
            finalSpread.l += tracker.rule.data.l;
          }
        });
      }
      const finalStyles = isLayoutNode ? { ...n.styles } : {};
      if (!finalSkip) {
        nextPropRules.forEach((tracker) => {
          if (!tracker.rule.indices || tracker.rule.indices.includes(tracker.counter.val)) {
            Object.assign(finalStyles, tracker.rule.data);
          }
        });
      }
      leaves.push(new Rect(x, y, w, h, finalStyles, finalSkip, customSize, finalSpread));
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
    n.children.forEach((c, i) => {
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
        this.calc(c, pos, y, cw, h, leaves, skip, offs, nextPropRules, nextSpreadRules);
        pos += cw;
      } else {
        let ch = isString ? stringWidth : h * r;
        this.calc(c, x, pos, w, ch, leaves, skip, offs, nextPropRules, nextSpreadRules);
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
        let found = null;
        for (let [k, v] of this._strMap) {
          if (Math.abs(size - k) < 1e-8) {
            found = v;
            break;
          }
        }
        tracks.push(found ? found : size + "fr");
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

// src/react.tsx
import { jsx } from "react/jsx-runtime";
if (typeof window !== "undefined") {
  installExtensions();
}
var Grid = 100;
var lg = 61.8;
var sm = 38.2;
var auto = "auto";
var Layout = ({
  children,
  layout,
  "layout-sm": lSm,
  "layout-md": lMd,
  "layout-lg": lLg,
  "layout-xl": lXl,
  "layout-xxl": lXxl,
  ...rest
}) => {
  const ref = useRef(null);
  const getLayout = () => {
    if (typeof window === "undefined") return void 0;
    const w = window.innerWidth;
    if (w >= 1400 && typeof lXxl === "object") return lXxl;
    if (w >= 1200 && typeof lXl === "object") return lXl;
    if (w >= 992 && typeof lLg === "object") return lLg;
    if (w >= 768 && typeof lMd === "object") return lMd;
    if (w >= 576 && typeof lSm === "object") return lSm;
    if (typeof layout === "object") return layout;
    return void 0;
  };
  const render = () => {
    if (ref.current) Engine.render(ref.current, getLayout());
  };
  useEffect(() => {
    render();
  });
  useEffect(() => {
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [layout, lSm, lMd, lLg, lXl, lXxl]);
  const domProps = { ...rest };
  if (typeof layout === "string") domProps.layout = layout;
  if (typeof lSm === "string") domProps["layout-sm"] = lSm;
  if (typeof lMd === "string") domProps["layout-md"] = lMd;
  if (typeof lLg === "string") domProps["layout-lg"] = lLg;
  if (typeof lXl === "string") domProps["layout-xl"] = lXl;
  return /* @__PURE__ */ jsx("div", { ref, ...domProps, style: { display: "grid", width: "100%", height: "100%", ...rest.style }, children });
};
export {
  Grid,
  Layout,
  auto,
  lg,
  sm
};
//# sourceMappingURL=react.mjs.map