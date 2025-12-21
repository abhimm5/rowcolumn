
# Rowscolumns (v1.6.2)

**The Native-Syntax Grid Engine.**  
Rowscolumns is a two-dimensional, recursive, mathematical layout engine that lets you build complex CSS Grids using pure JavaScript syntax directly in your HTML or components.

[![npm version](https://img.shields.io/npm/v/rowscolumns.svg)](https://www.npmjs.com/package/rowscolumns)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## 💡 The Core Concept: No More "Div Soup"

Traditional grids require nested wrappers for every row and column. **Rowscolumns** uses **Grid Line Placement**. You define the geometry, and the engine places your elements onto a flat DOM.

**The Old Way:**
```html
<div class="row">
  <div class="col-4">Sidebar</div>
  <div class="col-8">
     <div class="row">
      <div>Top</div>
      <div>Bottom</div>
     </div>
  </div>
</div>
```

**The Rowscolumns Way (Flat HTML and 2D):**
```html
<div layout="Grid.col(30, (70).row(50, 50))">
  <div>Sidebar</div>
  <div>Top Content</div>
  <div>Bottom Content</div>
</div>
```

---

## 🚀 New Features in v1.6.2

### 1. Inline Responsive Objects (The Superpower)
You no longer need separate `layout-sm` or `layout-md` attributes for every small change. You can pass responsive objects **directly into the methods**.

```html
<!-- One line, fully responsive -->
<div layout="Grid.col({ sm: 1, md: 2, lg: 4 })">
   <!-- Column weight changes automatically based on screen width -->
</div>
```

### 2. The `'none'` Keyword
Hiding elements usually leaves "ghost" gaps in CSS Grid. The `'none'` keyword:
1.  **Hides** the element (`display: none`).
2.  **Collapses** the space (removes the grid track).
3.  Everything else slides over to fill the gap perfectly.

```html
<!-- Hide the middle item on mobile, show on desktop -->
<div layout="Grid.col(1, { sm: 'none', lg: 'auto' }, 1)"> ... </div>
```

### 3. Unified `.span()` Logic
Legacy `.spread()` is replaced by `.span()`. It is now the single tool for expanding items across multiple tracks.

---

## 📐 Simple Syntax Guide

### 1. Basic Splits
*   **Weights:** `Grid.col(1, 2)` (1/3rd and 2/3rds).
*   **Fractions:** `Grid.col(1/3, 2/3)`.
*   **CSS Units:** `Grid.col('200px', 'auto', 1)`.
*   **Variables:** `Grid.col(lg, sm)` (Golden ratio: 61.8% and 38.2%).

### 2. Recursion
Start with a number (like `100` or `Grid`) and chain `.col()` or `.row()`.
```js
Grid.col(50, (50).row(1, 1)) // Split 50/50, then split the right half into two rows.
```

---

## 🛠 Powerful Utilities

| Method | Description |
| :--- | :--- |
| **`.props({})`** | Styles for the **Container** (e.g., `{ gap: '10px' }`). |
| **`.childProps({}, [idx])`** | Styles for specific **Children** (1-based index). |
| **`.offset([idx])`** | Skips a slot to create a "Ghost" space. |
| **`.span({ right: 1 }, [idx])`** | Spans a child across extra tracks (top, right, bottom, left). |

---

## 📱 Advanced Responsive Example

This demonstrates **Inline Breakpoints**, **Responsive Hiding**, and **Offsets** all in one layout:

```html
<div layout="
  Grid.col(
    { sm: 1, md: 2, lg: 4 }, 
    (10).col('auto', { sm: 'none', lg: 'auto' }, 1, 'auto'), 
    { sm: 1, md: 2, lg: 4 }
  )
  .offset([1, 4, 6])
  .props({ gap: '5px' })
">
  <img src="logo.svg" />
  <h4>Heading</h4>
  <button>Button</button>
</div>
```

## 📖 Documentation

For the full API reference, advanced examples, and detailed guides, visit the official documentation:  
👉 **[rowscolumns.github.io/docs.html](https://rowscolumns.github.io/docs.html)**

---

## 📦 Quick Install

### Vanilla HTML / CDN
```html
<script type="module">
  import { Engine } from 'https://unpkg.com/rowscolumns/dist/index.mjs';
  Engine.init();
</script>

<div layout="Grid.col(50, 50)"> ... </div>
```

### React / Vue / Angular
```bash
npm install rowscolumns
```

**React:**
```tsx
import { Layout, Grid } from 'rowscolumns/react';
import 'rowscolumns'; // Activates syntax extensions

export const App = () => (
  <Layout layout={Grid.col({ sm: 1, md: 50 })}>
    <div>Child</div>
  </Layout>
);
```

**Vue 3:**
```html
<script setup>
import { Layout } from 'rowscolumns/vue';
import 'rowscolumns';
</script>

<template>
  <Layout :layout="Grid.col(1/2, 1/2)">
    <div>Left</div>
    <div>Right</div>
  </Layout>
</template>
```

**Angular:**
Initialize the engine in your `main.ts` and use a directive to trigger `Engine.render(el)`. See the [Full Documentation](https://rowscolumns.github.io/docs.html) for the Angular Directive boilerplate.

---

### Why use v1.6.x?
*   **IDE Autocomplete:** Fully typed for TypeScript and VS Code support.
*   **Zero Dependencies:** Extremely lightweight and fast.
*   **Mathematical:** No more guessing pixel widths; use native fractions and decimals.
*   **Responsive:** Handle all screen sizes inline without complex media queries.

**License:** MIT © [Abhimm5]
---

## 🧩 Why use this version?
*   **Autocomplete:** Fully typed for IDE support.
*   **Zero Dependencies:** Lightweight and fast.
*   **Real-time:** Reacts to window resizing automatically.
*   **Mathematical:** No more guessing pixel widths or complex media queries.

**License:** MIT © [Abhimm5]