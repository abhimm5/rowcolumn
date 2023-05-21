import repeat from './repeat.js';
const repeatCol = () => {
    Number.prototype.col = function(num, name) {
        return repeat(this, num, 'perpendicular')
    }
}
export default repeatCol