"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/react.tsx
var react_exports = {};
__export(react_exports, {
  Grid: () => Grid,
  Layout: () => Layout,
  auto: () => auto,
  lg: () => lg,
  sm: () => sm
});
module.exports = __toCommonJS(react_exports);
var import_react = require("react");

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
  // --- NEW: Allow chaining directly on Nodes (fixes auto.col) ---
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
  constructor(x, y, w, h, styles, isSkipped) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.styles = styles;
    this.isSkipped = isSkipped;
  }
};
var installed = false;
function installExtensions() {
  if (installed) return;
  installed = true;
  if (Number.prototype.col) return;
  const n = (v) => new LayoutNode(v);
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
var Engine = {
  bps: { sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 },
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
      return func(61.8, 38.2, 100, new LayoutNode("auto"));
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
    if (!isLayoutNode || !n.children.length) {
      let finalSkip = skip;
      offs.forEach((r) => {
        r.c++;
        if (r.idx.includes(r.c)) finalSkip = true;
      });
      const s = isLayoutNode ? n.styles : {};
      leaves.push(new Rect(x, y, w, h, s, finalSkip));
      return;
    }
    let tw = 0;
    n.children.forEach((c) => {
      let s = this.isNode(c) ? c.size : c;
      if (s === "auto") s = 0;
      else if (this.isNode(c) && c.size === 0) s = 1;
      tw += Number(s);
    });
    if (tw === 0) tw = 1;
    let pos = n.type === "col" ? x : y;
    n.children.forEach((c) => {
      let s = this.isNode(c) ? c.size : c;
      const isAuto = s === "auto";
      let numSize = isAuto ? 0 : Number(s);
      if (this.isNode(c) && c.size === 0 && !isAuto) numSize = 1;
      let r = numSize / tw;
      if (n.type === "col") {
        let cw = isAuto ? AUTO_SIZE : w * r;
        this.calc(c, pos, y, cw, h, leaves, skip, offs);
        pos += cw;
      } else {
        let ch = isAuto ? AUTO_SIZE : h * r;
        this.calc(c, x, pos, w, ch, leaves, skip, offs);
        pos += ch;
      }
    });
  },
  mesh(leaves) {
    let rx = [0, 100], ry = [0, 100];
    leaves.forEach((r) => {
      rx.push(r.x, r.x + r.w);
      ry.push(r.y, r.y + r.h);
    });
    const dedup = (a) => [...new Set(a.sort((a2, b) => a2 - b))].filter((v, i, s) => i === 0 || Math.abs(v - s[i - 1]) > AUTO_SIZE / 10);
    const xc = dedup(rx), yc = dedup(ry);
    const getTracks = (cuts) => {
      const tracks = [];
      for (let i = 1; i < cuts.length; i++) {
        let size = cuts[i] - cuts[i - 1];
        if (Math.abs(size - AUTO_SIZE) < 1e-7) tracks.push("auto");
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

// src/react.tsx
var import_jsx_runtime = require("react/jsx-runtime");
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
  const ref = (0, import_react.useRef)(null);
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
  (0, import_react.useEffect)(() => {
    render();
  });
  (0, import_react.useEffect)(() => {
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [layout, lSm, lMd, lLg, lXl, lXxl]);
  const domProps = { ...rest };
  if (typeof layout === "string") domProps.layout = layout;
  if (typeof lSm === "string") domProps["layout-sm"] = lSm;
  if (typeof lMd === "string") domProps["layout-md"] = lMd;
  if (typeof lLg === "string") domProps["layout-lg"] = lLg;
  if (typeof lXl === "string") domProps["layout-xl"] = lXl;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref, ...domProps, style: { display: "grid", width: "100%", height: "100%", ...rest.style }, children });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Grid,
  Layout,
  auto,
  lg,
  sm
});
//# sourceMappingURL=react.js.map