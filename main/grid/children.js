import Grid from './gridconstructor.js'
Grid.prototype.children = function(item, property) {
    this.getGridBox = item;
    if (property) {
        let i
        for (i = 0; i < property.length; i++) {
            this.getGridBox.style.setProperty(property[i][0], property[i][1]);
        }
    }
}
export default Grid.prototype.children