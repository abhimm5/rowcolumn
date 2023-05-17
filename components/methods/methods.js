import amend from './object.js'
amend.offset = function(index) {
    let arr = this.obj.cor
    let indicesToRemove = index;
    indicesToRemove.sort((a, b) => b - a);
    for (let i = 0; i < indicesToRemove.length; i++) {
        arr.splice(indicesToRemove[i], 1);
    }
    this.obj.cor = arr
    return this.obj
}
amend.order = function() {
    let arr = this.obj.cor

    function simpleArraySum(ar) {
        var sum = 0;
        for (var i = 0; i < ar.length; i++) {
            if (typeof ar[i] == `number`) sum += ar[i];
        }
        return sum;
    }
    let sortedArr = arr.sort((a, b) => {
        let sumA = simpleArraySum(a)
        let sumB = simpleArraySum(b)
        return sumA - sumB;
    });
    this.obj.cor = arr
    return this.obj
}
amend.property = function(value) {
    this.obj.property = this.obj.property ? this.obj.property : []
    this.obj.property.push(value)
}
amend.breakpoint = function(value) {
    let mediaQuery = window.matchMedia(value[0])
    if (mediaQuery.matches) {
        this.obj = value[1]
    }
    return
}
amend.childProperty = function(value) {
    this.obj.propertyChild = this.obj.propertyChild ? this.obj.propertyChild : []
    this.obj.propertyChild.push(value)
}
export default amend