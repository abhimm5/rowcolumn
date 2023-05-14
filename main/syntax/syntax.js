  export const addSyntax = () => {
    Number.prototype.splits = function (a, b, c) {
    let n = Object(this)
    n.left = a
    n.right = b
    n.direction = c
    return n
  }
  }
  
