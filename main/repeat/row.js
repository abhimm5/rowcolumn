 import repeat from './repeat.js'
const repeatRow = () => {
    Number.prototype.row = function(num, name) {
        return repeat(this, num, 'parallel')
    }
 }
 export default repeatRow