import Grid from './gridconstructor.js'
Grid.prototype.style = function(x, y, gap, property) {
    function addUnits(array, units) {
        let gapvalue = '0px'
        if (property) {
            let i
            for (i = 0; i < property.length; i++) {
                if (property[i][0] == 'gap') {
                    gapvalue = property[i][1]
                }
            }
        }
        const iterator = array.values();
        const newarr = [];
        for (const value of iterator) {
            newarr.push('minmax( calc( ' + value + units + ' - ' + gapvalue + ' ), auto)');
        }
        return newarr.join(" ");
    }
    this.gridParent.style.gridTemplateColumns = addUnits(x, "%");
    this.gridParent.style.gridTemplateRows = addUnits(y, "vh");
    let i
    if (property) {
        for (i = 0; i < property.length; i++) {
            this.gridParent.style.setProperty(property[i][0], property[i][1]);
        }
    }
}
export default Grid.prototype.style