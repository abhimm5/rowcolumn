export const addSyntax = () => {
    Number.prototype.splits = function(a, b, c, d) {
        let n = Object(this)
        n.left = a
        n.right = b
        n.direction = c
        n.presetAxis = d
        return n
    }
}