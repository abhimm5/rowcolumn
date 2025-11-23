
# Rowscolumns

**The Native-Syntax Grid Engine.**  
A two-dimensional, recursive layout framework that gives you super-control over children without messy CSS Grid code.

[![npm version](https://img.shields.io/npm/v/rowscolumns.svg)](https://www.npmjs.com/package/rowscolumns)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/rowscolumns)](https://bundlephobia.com/package/rowscolumns)

## 💡 Introduction

### Why Rowscolumns?
Most grid systems are one-dimensional (rows inside columns inside rows). **Rowscolumns** is a recursive, mathematical engine.

Instead of writing endless HTML:
```html
<!-- The Old Way -->
<div class="row">
  <div class="col-6">...</div>
  <div class="col-6">...</div>
</div>
```

You describe the geometry directly:
```html
<!-- The Rowscolumns Way -->
<div layout="(100).col(50, 50)">
  <div>...</div>
  <div>...</div>
</div>
```

It supports **React**, **Vue**, **TypeScript**, and **Vanilla JS** out of the box with zero dependencies.

---

## 📦 Installation

1. **Install via NPM:**
   ```bash
   npm install rowscolumns
   ```

2. **Or use via CDN (Vanilla HTML):**
   ```html
   <script type="module">
     import { Engine } from 'https://unpkg.com/rowscolumns';
     Engine.init();
   </script>
   ```

---

## ⚡ Getting Started

### React
Pass layout objects directly using native JavaScript syntax.

```tsx
import { Layout } from 'rowscolumns/react';
import 'rowscolumns'; // Activates the syntax extensions

export default function App() {
  return (
    <Layout 
      // 1. Split into 3 equal parts using native math
      layout={(100).col(100/3, 100/3, 100/3)}
      
      // 2. Responsive (Mobile): Stack vertical
      layout-sm={(100).col(100)}
    >
      <div className="box">1</div>
      <div className="box">2</div>
      <div className="box">3</div>
    </Layout>
  );
}
```

### Vue 3
Use the `:layout` binding to pass native objects.

```html
<script setup>
import { Layout } from 'rowscolumns/vue';
import 'rowscolumns';
</script>

<template>
  <Layout :layout="(100).col(lg, sm)">
    <div class="box">Left</div>
    <div class="box">Right</div>
  </Layout>
</template>
```

### Vanilla HTML
Use string attributes (works exactly like `onclick`).

```html
<script type="module">
  import { Engine } from 'rowscolumns';
  Engine.init();
</script>

<div layout="(100).col(50, 50)">
  <div>Left</div>
  <div>Right</div>
</div>
```

---

## 📐 The Syntax

The library extends `Number.prototype`. You start with a number (usually `100` representing 100% size) and chain methods.

### 1. Columns & Rows
Divide space horizontally (`.col`) or vertically (`.row`).

*   **Split into two:** `(100).col(50, 50)`
*   **Golden Ratio:** `(100).col(lg, sm)` (Variables `lg`=61.8, `sm`=38.2 are built-in).
*   **Math:** `(100).col(100/3, 100/3, 100/3)`

### 2. Recursion (Nesting)
You can nest splits infinitely.

```js
// A 50/50 split, where the right side is further split into rows
(100).col(50, 50.row(50, 50))
```

---

## 🛠 Utilities

Control the grid and children without adding extra CSS classes.

### `.offset([indices])`
Creates "Ghost" slots. Useful for spacing or creating complex layouts where a DOM element shouldn't exist.

```js
// Creates 2 columns, but skips the 1st slot. 
// The first HTML div will land in the 2nd slot.
(100).col(50, 50).offset([1]) 
```

### `.props({ styles })`
Applies CSS to the **Grid Container** (Gap, Padding, etc).

```js
(100).col(50, 50).props({ gap: '20px', padding: '1rem' })
```

### `.childProps({ styles }, [indices])`
Applies CSS directly to specific **DOM Children**.
*   `indices`: 1-based index of the child.

```js
// Makes the 2nd child red, regardless of where it sits in the grid
(100).col(50, 50).childProps({ background: 'red' }, [2])
```

---

## 📱 Responsive Design

No need for complex media queries. Just use the responsive attributes. The engine handles the rest.

| Attribute | Breakpoint |
| :--- | :--- |
| `layout` | Default (0px+) |
| `layout-sm` | ≥ 576px |
| `layout-md` | ≥ 768px |
| `layout-lg` | ≥ 992px |
| `layout-xl` | ≥ 1200px |

**Example:**
```html
<div 
    layout="(100).col(100)"           <!-- Mobile: Vertical Stack -->
    layout-md="(100).col(50, 50)"     <!-- Tablet: Split -->
>
```

---

## 🧩 Advanced: Global Functions

Because the engine uses native execution, you can define layouts in JavaScript and reference them in HTML.

```html
<script>
  // Define a reusable layout function
  window.myLayout = (gap) => (100).col(lg, sm).props({ gap });
</script>

<!-- Call it like a function -->
<div layout="myLayout('20px')">
  ...
</div>
```

---

## License

MIT © [Abhimm5]