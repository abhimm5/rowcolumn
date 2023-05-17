import Grid from './gridconstructor.js'
Grid.prototype.assignCoordinate = function(item, coordinates) {
    let [x1, y1, x2, y2] = coordinates;
    this.getGridBox = item;
    this.getGridBox.style.gridRowStart = x1;
    this.getGridBox.style.gridColumnStart = y1;
    this.getGridBox.style.gridRowEnd = x2;
    this.getGridBox.style.gridColumnEnd = y2;
    this.getGridBox.style.color = "red";
};
export default Grid.prototype.assignCoordinate