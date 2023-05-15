# Row Column v0.1.0
 ### Introduction
 Simple javascript framework/library to create beautiful websites effortlessly.
 This framework makes grid coding on html easy. No need of CSS file and additional width height coding in CSS, which makes code easy to read and manage also prevent from repeatition. 
 This is framework is based on CSS Grid unlike most of frameworks depend on flex or float.
 As this framework extracted from CSS, it is 2 dimentional. One line code can give whole page a desired layout.
 This framework also starts with new way to create grid.
## Using framework
There is no need to install you can just copy paste to the root folder. The traditional method was to use grid of 12 is obsolete. CSS grid came to solve the grid making which is being widely used. Using this framework will make new style way to create grid in unlimited number in two dimension.
### How
 1. Download from latest release.
 2. Paste all files and folder in the main folder of your HTML code.
 3. Add `<script type="module" src="rowcolumn.js"></script>` to head of your html file.
 4. Start making grid websites easily.

### Basics to make column and rows
 1. On parent `<div>` create a `layout` attribute like this `<div layout="...">`. The row column codes will be written inside the layout attribute.
 2. In simple words when someone calls `splits()` function on any number inside the layout attribute which takes currently 3 arguments divides left, right, direction. The first two parameters will divide the number into two parts. The last direction argument takes direction `perpendicular` or `parallel` this basically means divide a line(Number) into two parts vertically or horizontally. 
 3. You can call this function like the example `(100).splits(60,(40),'perpendicular')`. The (100) or parent value defines the width and height of the `<div>` which is dividing the rectangle/square into two parts. Number (100) will automatically set the divs width and height to `100%` and `100vh` respectively.
 4. You can further divide the resultent div into two parts in different direction making the framework 2 dimentional example `<div layout="(100).splits(lg,sm.splits(lg,sm ,'parallel'),'perpendicular')">` here `lg` and `sm` are two primary numbers of the framework.
 5. You can also make any desired number of columns and rows. There is no restriction to make 12 columns. To make 12 columns we just have to do like `<div layout="(100).splits(3/12,9/12,'perpendicular')">` this will make columns of 12 divided into 3 and 9 parts. Just start with any natural number, only basic maths about calulation is required to make any numbers of column.
 6. You can also do further divide the columns in any direction you want, let say to divide the number rectangular display of any `div` further we do `<div layout="(100).splits(3/12,(9/12).splits(6/9,(3/9),'perpendicular'),'perpendicular')">` in same direction or in different direction as many as.
 7. In splitting any number remember the denominator of child must be same to the numerator of the parent, this is just an exception, but to make perfect column you should follow this.

### Responsivity
 1. Coming very soon

## Creating grids simple
 This framework will let us make grid, layout, and rows and columns easy. Just controlling the layout from parent `<div>` without touching the children `<div>` It is also free to use and open source.
 
## Support 
 Please contribute the repository and make it grow.
 ### Working
 

## Notes
**-> Based on Javascript ES6**

**-> Demo HTML file is added in repo for the disposal**

**-> Always use the latest version for new feature.**

