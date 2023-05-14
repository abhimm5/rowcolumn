import Grid from '../main/grid/gridconstructor.js'
import cartesianSystem from '../main/grid/cartesiansystem.js'
import assignCoordinate from '../main/grid/assigncoordinate.js'

function set(values,div) {
        let o = values.rearrange().devise() //add devise
        let col = o.gridTemplateColumns;
        let row = o.gridTemplateRows;
        let cor = o.extract()
        let getdiv = div
        let grid = new Grid(div)
        cor.forEach((value, index) => {
            grid.cartesianSystem(col, row)
            grid.assignCoordinate(getdiv.children[index], value)
        })
    }
export default set