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
  Layout: () => Layout
});
module.exports = __toCommonJS(react_exports);
var import_react = require("react");

// src/core.ts
var LayoutNode = class {
  constructor(size, type = "leaf", children = []) {
    this.size = size;
    this.type = type;
    this.children = children;
    // State
    this.isSkippedSelf = false;
    this.offsetIndices = [];
    this.styles = {};
    this.childPropsRules = [];
  }
  // Chainable Methods
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
      const func = new Function("lg", "sm", "return " + str);
      return func(61.8, 38.2);
    } catch (e) {
      console.error(`Layout Error: "${str}"`, e);
      return void 0;
    }
  },
  // --- HELPER: Is this object a Layout Node? (Duck Typing) ---
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
      k.style.gridColumn = `${this.idx(xc, l.x) + 1} / ${this.idx(xc, l.x + l.w) + 1}`;
      k.style.gridRow = `${this.idx(yc, l.y) + 1} / ${this.idx(yc, l.y + l.h) + 1}`;
      if (l.styles) Object.assign(k.style, l.styles);
    });
  },
  calc(n, x, y, w, h, leaves, pSkip, offRules) {
    if (!n) return;
    if (typeof n === "number" || n === "auto") n = new LayoutNode(n === "auto" ? 0 : n, "leaf");
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
      if (s === "auto" || this.isNode(c) && c.size === 0) s = 1;
      tw += Number(s);
    });
    let pos = n.type === "col" ? x : y;
    n.children.forEach((c) => {
      let s = this.isNode(c) ? c.size : c;
      if (s === "auto" || this.isNode(c) && c.size === 0) s = 1;
      let r = Number(s) / tw;
      if (n.type === "col") {
        let cw = w * r;
        this.calc(c, pos, y, cw, h, leaves, skip, offs);
        pos += cw;
      } else {
        let ch = h * r;
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
    const dedup = (a) => [...new Set(a.sort((a2, b) => a2 - b))].filter((v, i, s) => i === 0 || v - s[i - 1] > 0.05);
    const xc = dedup(rx), yc = dedup(ry);
    return {
      xc,
      yc,
      cw: xc.slice(1).map((v, i) => v - xc[i] + "fr"),
      rh: yc.slice(1).map((v, i) => v - yc[i] + "fr")
    };
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
var Layout = ({
  children,
  // Destructure these so they are NOT included in 'rest'
  layout,
  "layout-sm": layoutSm,
  "layout-md": layoutMd,
  "layout-lg": layoutLg,
  "layout-xl": layoutXl,
  "layout-xxl": layoutXxl,
  ...rest
}) => {
  const ref = (0, import_react.useRef)(null);
  const getActiveDirectLayout = () => {
    if (typeof window === "undefined") return void 0;
    const w = window.innerWidth;
    if (w >= 1400 && typeof layoutXxl === "object") return layoutXxl;
    if (w >= 1200 && typeof layoutXl === "object") return layoutXl;
    if (w >= 992 && typeof layoutLg === "object") return layoutLg;
    if (w >= 768 && typeof layoutMd === "object") return layoutMd;
    if (w >= 576 && typeof layoutSm === "object") return layoutSm;
    if (typeof layout === "object") return layout;
    return void 0;
  };
  const renderLayout = () => {
    if (ref.current) {
      Engine.render(ref.current, getActiveDirectLayout());
    }
  };
  (0, import_react.useEffect)(() => {
    renderLayout();
  });
  (0, import_react.useEffect)(() => {
    window.addEventListener("resize", renderLayout);
    return () => window.removeEventListener("resize", renderLayout);
  }, [layout, layoutSm, layoutMd, layoutLg, layoutXl, layoutXxl]);
  const domProps = { ...rest };
  if (typeof layout === "string") domProps.layout = layout;
  if (typeof layoutSm === "string") domProps["layout-sm"] = layoutSm;
  if (typeof layoutMd === "string") domProps["layout-md"] = layoutMd;
  if (typeof layoutLg === "string") domProps["layout-lg"] = layoutLg;
  if (typeof layoutXl === "string") domProps["layout-xl"] = layoutXl;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      ref,
      ...domProps,
      style: { display: "grid", width: "100%", height: "100%", ...rest.style },
      children
    }
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Layout
});
//# sourceMappingURL=react.js.map