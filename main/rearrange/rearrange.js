import restructure from './assets/restructure.js'
import revisePoint from './assets/revisepoint.js'
import reviseDistance from './assets/revisedistance.js'
export const addRearrange = () => {
    Number.prototype.rearrange = function(axis, point, distance,parentValue) {
        let sum = Number(this.left) + Number(this.right)
        let parent = this.valueOf()
        let left = Math.round((parent / sum * Number(this.left)))
        let right = Math.round((parent / sum * Number(this.right)))
        let x, y, myPoint,parentDimention
        if(parentValue){
            parentDimention = parentValue
        }
        else{
            parentDimention = this.valueOf()
        }
        if (axis) {
            if (this.direction == "perpendicular") {
                axis[0].left = left
                axis[0].right = right
            }
            if (this.direction == "parallel") {
                axis[1].left = left
                axis[1].right = right
            }
            this.axis = axis
        } else {
            this.axis = restructure(left + right, left, right, this.direction)
        }
        if (point) {
            let oldPoint = JSON.parse(JSON.stringify(point))
            myPoint = revisePoint(oldPoint, left, this.direction, true)
        } else {
            let p = [{
                x: 0,
                y: 0
            }]
            myPoint = revisePoint(p, left, this.direction)
        }
        this.position = JSON.parse(JSON.stringify(myPoint))
        if (distance) {
            [x, y] = distance
            let result = reviseDistance(this.position, this.direction, distance)
            x = result[0]
            y = result[1]
        } else {
            let result = reviseDistance(this.position, this.direction)
            x = result[0]
            y = result[1]
        }
        let getPerpendicular = this.axis[0]
        let getParallel = this.axis[1]
        if (typeof this.left == 'object') {
            let xl = getPerpendicular.left.splits((this.left.left), (this.left.right), this.left.direction)
            let yl = getParallel.left.splits((this.left.left), (this.left.right), this.left.direction)
            let newAxisX = [{
                left: Number(left),
                right: Number(right),
                direction: "perpendicular"
            }, this.axis[1]]
            let newAxisY = [this.axis[0], {
                left: Number(left),
                right: Number(right),
                direction: "parallel"
            }]
            //let newPoint = JSON.parse(JSON.stringify(point))
            if (this.left.direction !== this.direction && this.left.direction == 'perpendicular') {
                let newAxisX2 = JSON.parse(JSON.stringify(newAxisX))
                newAxisX2.map(getParent => {
                    if (getParent.direction == this.direction) {
                        getParent.left = left
                        getParent.right = left
                    }
                })
                if (point) {
                    this.left = xl.rearrange(newAxisX2, point, [x, y],parentDimention)
                } else {
                    this.left = xl.rearrange(newAxisX2, null, [x, y],parentDimention)
                }
            } else if (this.left.direction !== this.direction && this.left.direction == 'parallel') {
                //console.log(true)
                let newAxisY2 = JSON.parse(JSON.stringify(newAxisY))
                newAxisY2.map(getParent => {
                    if (getParent.direction == this.direction) {
                        getParent.left = left
                        getParent.right = left
                    }
                })
                if (point) {
                    this.left = yl.rearrange(newAxisY2, point, [x, y],parentDimention)
                } else {
                    this.left = yl.rearrange(newAxisY2, null, [x, y],parentDimention)
                }
            } else {
                if (point) {
                    this.left = this.left.direction == 'perpendicular' ? xl.rearrange(newAxisX, point, [x, y]) : yl.rearrange(newAxisY, point, [x, y],parentDimention)
                } else {
                    this.left = this.left.direction == 'perpendicular' ? xl.rearrange(newAxisX, null, [x, y]) : yl.rearrange(newAxisY, null, [x, y],parentDimention)
                }
                //this.left = this.left.direction == 'perpendicular'? xl.rearrange(newAxisX,point,[x,y]):yl.rearrange(newAxisY,point,[x,y])
            }
        } else {
            this.left = left
        }
        if (typeof this.right == 'object') {
            let xr = getPerpendicular.right.splits((this.right.left), (this.right.right), this.right.direction)
            let yr = getParallel.right.splits((this.right.left), (this.right.right), this.right.direction)
            let newAxisX = [{
                left: Number(left),
                right: Number(right),
                direction: "perpendicular"
            }, this.axis[1]]
            let newAxisY = [this.axis[0], {
                left: Number(left),
                right: Number(right),
                direction: "parallel"
            }]
            let newPoint = JSON.parse(JSON.stringify(this.position))
            if (this.right.direction !== this.direction && this.right.direction == 'perpendicular') {
                let newPoint = JSON.parse(JSON.stringify(this.position))
                let newAxisX2 = JSON.parse(JSON.stringify(newAxisX))
                newAxisX2.map(getParent => {
                    if (getParent.direction == this.direction) {
                        getParent.left = right
                        getParent.right = right
                    }
                })
                if (point) {
                    this.right = xr.rearrange(newAxisX2, newPoint, [x, y],parentDimention)
                } else {
                    this.right = xr.rearrange(newAxisX2, newPoint, [x, y],parentDimention)
                }
            } else if (this.right.direction !== this.direction && this.right.direction == 'parallel') {
                let newPoint = JSON.parse(JSON.stringify(this.position))
                let newAxisY2 = JSON.parse(JSON.stringify(newAxisY))
                newAxisY2.map(getParent => {
                    if (getParent.direction == this.direction) {
                        getParent.left = right
                        getParent.right = right
                    }
                })
                if (point) {
                    this.right = yr.rearrange(newAxisY2, newPoint, [x, y],parentDimention)
                } else {
                    this.right = yr.rearrange(newAxisY2, newPoint, [x, y],parentDimention)
                }
            } else {
                this.right = this.right.direction == 'perpendicular' ? xr.rearrange(newAxisX, newPoint, [x, y],parentDimention) : yr.rearrange(newAxisY, newPoint, [x, y],parentDimention)
            }
        } else {
            this.right = right
        }
        x.unshift(0, parentDimention)
        y.unshift(0, parentDimention)
        let xsorted = x.sort(function(a, b) {
            return a - b
        })
        let ysorted = y.sort(function(a, b) {
            return a - b
        })
        x = Array.from(new Set(xsorted))
        y = Array.from(new Set(ysorted))
        this.gridTemplateColumns = []
        this.gridTemplateRows = []
        x.map((value, index, array) => {
            let num = array[index + 1] - value;
            this.gridTemplateColumns.push(num)
        })
        y.map((value, index, array) => {
            let num = array[index + 1] - value;
            this.gridTemplateRows.push(num)
        })
        const removeItems = (array, itemToRemove) => {
            return array.filter(v => {
                return !itemToRemove.includes(v);
            });
        }
        this.x = x.filter((item, index) => x.indexOf(item) === index)
        this.y = y.filter((item, index) => y.indexOf(item) === index)
        this.gridTemplateColumns = removeItems(this.gridTemplateColumns, [0, NaN])
        this.gridTemplateRows = removeItems(this.gridTemplateRows, [0, NaN])
        return this
    }
}