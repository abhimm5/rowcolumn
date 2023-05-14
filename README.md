# Row Column v1.0.0
 Simple javascript framework/library to create beautiful websites effortlessly.
 This framework makes grid coding on html easy. No need of CSS file and additional width height coding in CSS, which makes code easy to read and manage also prevent from repeatition. 
 This is framwork is based on CSS Grid unlike most of frameworks depend on flex or float.
 As this framework extracted from CSS, it is 2 dimentional. One line code can give whole page a desired layout.
 
### How
 1. Download from latest release.
 2. Add `<script type="module" src="rowcolumn.js"></script>` to head of your html file.
 3. Start making grid websites easily.
 4. Always use the latest version for new feature.

### Basics to use
 1. On parent `<div>` create a `layout` attribute like this `<div layout="...">`. The row column codes will be written inside the layout attribute.
 2. In simple words when someone calls `splits()` function on any number inside the layout attribute which takes currently 3 arguments divides left, right, direction. The first two parameters will divide the number into two parts. The last direction argument takes direction `perpendicular` or `parallel` this basically means divide a line(Number) into two parts vertically or horizontally. 
 3. You can call this function like the example `(100).splits(60,(40),'perpendicular')`. The (100) or parent value defines the width and height of the `<div>` which is dividing the rectangle/square into two parts. Number (100) will automatically set the divs width and height to `100%` and `100vh` respectively.
 4. You can further divide the resultent div into two parts in different direction making the framework 2 dimentional example `<div layout="(100).splits(lg,sm.splits(lg,sm ,'parallel'),'perpendicular')">` here `lg` and `sm` are two primary numbers of the framework.

### Creating grids simple
 This framework will let us make grid, layout, and rows and columns easy. It is also free to use and open source.
 
### Support 
 Please contribute the repository and make it grow.

**Based on Javascript ES6**
