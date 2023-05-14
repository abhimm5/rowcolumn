import Grid from './gridconstructor.js'
Grid.prototype.cartesianSystem = function(x, y) {
  function addUnits(array, units) {
    const iterator = array.values();
    const newarr = [];
    for (const value of iterator) {
      newarr.push(value + units);
    }
    return newarr.join(" ");
  }
  this.gridParent.style.gridTemplateColumns = addUnits(x, "%");
  this.gridParent.style.gridTemplateRows = addUnits(y, "vh");
};
export default Grid.prototype.cartesianSystem
