import amend from '../../components/methods/methods.js'
export const addComponents = () => {
    Number.prototype.add = function() {
        if (!arguments) {
            return this
        } else {
            this.add = true
            this.rearrange().devise()
            amend.obj = this
            amend.obj.cor = this.extract()
            let i;
            for (i = 0; i < arguments.length; i++) {
                amend[arguments[i].name](arguments[i].value)
            }
            return amend.obj
        }
    }
}