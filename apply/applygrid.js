import Grid from '../main/grid/gridconstructor.js'
import cartesianSystem from '../main/grid/cartesiansystem.js'
import assignCoordinate from '../main/grid/assigncoordinate.js'
import {
    addComponents
} from '../main/add/add.js'

function set(values, div) {
    let o, cor
    if (values.add == true) {
        o = values
        cor = values.cor
    } else {
        o = values.rearrange().devise()
        cor = o.extract()
    }
    let col = o.gridTemplateColumns;
    let row = o.gridTemplateRows;
    let getdiv = div
    let grid = new Grid(div)
    grid.style(col, row, o.gap, o.property)
    cor.forEach((value, index) => {
        grid.assignCoordinate(getdiv.children[index], value)
    })
    if (o.propertyChild) {
        let i, j
        for (j = 0; j < o.propertyChild.length; j++) {
            for (i = o.propertyChild[j][2]; i < o.propertyChild[j][3]; i++) {
                getdiv.children[i].style.setProperty(o.propertyChild[j][0], o.propertyChild[j][1]);
            }
        }
    }
}
export default set