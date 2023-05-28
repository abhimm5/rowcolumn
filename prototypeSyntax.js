"use strict"
window.addEventListener("load", () => {
    let parent = 100;
    let lg = 61.2;
    let sm = 38.8;

    function Grid(parent) {
        this.gridParent = parent;
        this.gridParent.style.display = "grid";
    }
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
        //this.gridParent.style.gap = gap +"px"
        let i
        if (property) {
            for (i = 0; i < property.length; i++) {
                this.gridParent.style.setProperty(property[i][0], property[i][1]);
            }
        }
    };
    Grid.prototype.assignCoordinate = function(item, coordinates) {
        let [x1, y1, x2, y2] = coordinates;
        this.getGridBox = item;
        this.getGridBox.style.gridRowStart = x1;
        this.getGridBox.style.gridColumnStart = y1;
        this.getGridBox.style.gridRowEnd = x2;
        this.getGridBox.style.gridColumnEnd = y2;
    };
    Grid.prototype.children = function(item, property) {
        this.getGridBox = item;
        if (property) {
            let i
            for (i = 0; i < property.length; i++) {
                this.getGridBox.style.setProperty(property[i][0], property[i][1]);
            }
        }
    }

    function restructure(primaryValue, left, right, direction) {
        //console.log(left)
        let x = {
            left: primaryValue,
            right: primaryValue,
            direction: "perpendicular"
        }
        let y = {
            left: primaryValue,
            right: primaryValue,
            direction: "parallel"
        }
        if (direction == "perpendicular") {
            x = {
                left: left,
                right: right,
                direction: "perpendicular"
            }
        }
        if (direction == "parallel") {
            y = {
                left: left,
                right: right,
                direction: "parallel"
            }
        }
        return [x, y]
    }
    Number.prototype.splits = function(a, b, c, d) {
        let n = Object(this)
        n.left = a
        n.right = b
        n.direction = c
        n.presetAxis = d
        return n
    }
    Number.prototype.rearrange = function(axis, point, distance, parentValue) {
        let sum = Number(this.left) + Number(this.right)
        let parent = this.valueOf()
        let left 
        let right 
        let x, y, myPoint, parentDimention
        //console.log(this)
        if (this.presetAxis) {
            if (this.direction == 'parallel') {
                let parent = this.presetAxis[1]
                left = Math.round((parent / sum * Number(this.left)) * 10) / 10
                right = Math.round((parent / sum * Number(this.right)) * 10) / 10
                this.axis = restructure(this.presetAxis[0], left, right, this.direction)
            } else if (this.direction == 'perpendicular') {
                let parent = this.presetAxis[0]
                left = Math.round((parent / sum * Number(this.left)) * 10) / 10
            right = Math.round((parent / sum * Number(this.right)) * 10) / 10
                this.axis = restructure(this.presetAxis[1], left, right, this.direction)
            }
           
            this.dimension = [left, right]
        } else {
            left = Math.round((parent / sum * Number(this.left)) * 10) / 10
            right = Math.round((parent / sum * Number(this.right)) * 10) / 10
            this.dimension = [left, right]
        }
        if (parentValue) {
            parentDimention = parentValue
        } else {
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
            if (this.axis) {
                this.axis = this.axis
            } else {
                this.axis = restructure(left + right, left, right, this.direction)
            }
        }

        function reviseAxis(axis, value, direction, extras) {
            axis.map(getParent => {
                if (getParent.direction == direction) {
                    if (extras) {
                        getParent.left = extras[0]
                        getParent.right = extras[1]
                    } else {
                        getParent.left = value
                        getParent.right = value
                    }
                }
            })
            return axis
        }

        function revisePoint(point, value, direction, addition) {
            if (addition) {
                if (direction === "perpendicular") {
                    let sum = Math.round((point[0].x + value)*10)/10
                    point[0].x = sum

                }
                if (direction === "parallel") {
                    let sum = Math.round((point[0].y + value)*10)/10
                    point[0].y = sum
                }
            }
            if (!addition) {
                if (direction === "perpendicular") {
                    point[0].x = value
                }
                if (direction === "parallel") {
                    point[0].y = value
                }
            }
            return point
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

        function reviseDistance(position, direction, array) {
            let x, y
            if (!array) {
                x = []
                y = []
            }
            if (array) {
                x = array[0]
                y = array[1]
            }
            let cutOnAxes = position
            if (direction == "perpendicular") {
                x.push(cutOnAxes[0].x)
            }
            if (direction == "parallel") {
                y.push(cutOnAxes[0].y)
            }

            return [x, y]
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
                    this.left = xl.rearrange(newAxisX2, point, [x, y], parentDimention)
                } else {
                    this.left = xl.rearrange(newAxisX2, null, [x, y], parentDimention)
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
                    this.left = yl.rearrange(newAxisY2, point, [x, y], parentDimention)
                } else {
                    this.left = yl.rearrange(newAxisY2, null, [x, y], parentDimention)
                }
            } else {
                if (point) {
                    this.left = this.left.direction == 'perpendicular' ? xl.rearrange(newAxisX, point, [x, y], parentDimention) : yl.rearrange(newAxisY, point, [x, y], parentDimention)
                } else {
                    this.left = this.left.direction == 'perpendicular' ? xl.rearrange(newAxisX, null, [x, y], parentDimention) : yl.rearrange(newAxisY, null, [x, y], parentDimention)
                }
                //this.left = this.left.direction == 'perpendicular'? xl.rearrange(newAxisX,point,[x,y]):yl.rearrange(newAxisY,point,[x,y])
            }
        } else {
            this.left = this.dimension[0]
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
                    this.right = xr.rearrange(newAxisX2, newPoint, [x, y], parentDimention)
                } else {
                    this.right = xr.rearrange(newAxisX2, newPoint, [x, y], parentDimention)
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
                    this.right = yr.rearrange(newAxisY2, newPoint, [x, y], parentDimention)
                } else {
                    this.right = yr.rearrange(newAxisY2, newPoint, [x, y], parentDimention)
                }
            } else {
                this.right = this.right.direction == 'perpendicular' ? xr.rearrange(newAxisX, newPoint, [x, y], parentDimention) : yr.rearrange(newAxisY, newPoint, [x, y], parentDimention)
            }
        } else {
            this.right = this.dimension[1]
        }
        if(this.presetAxis){
            x.unshift(0, this.presetAxis[0])
            y.unshift(0, this.presetAxis[1])
        }
        else{
            x.unshift(0, parentDimention)
            y.unshift(0, parentDimention)
        }
        //x.unshift(0, parentDimention)
        //y.unshift(0, parentDimention)
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
            this.gridTemplateColumns.push(Math.round(num * 10) / 10)
        })
        y.map((value, index, array) => {
            let num = array[index + 1] - value;
            this.gridTemplateRows.push(Math.round(num * 10) / 10)
        })
        //console.log(x,y)
        const removeItems = (array, itemToRemove) => {
            return array.filter(v => {
                return !itemToRemove.includes(v);
            });
        }
        this.x = x
        this.y = y
        this.x = this.x.filter((item, index) => this.x.indexOf(item) === index)
        this.y = this.y.filter((item, index) => this.y.indexOf(item) === index)
        //console.log(this.x,this.y)
        delete this.dimension
        this.gridTemplateColumns = removeItems(this.gridTemplateColumns, [0, NaN])
        this.gridTemplateRows = removeItems(this.gridTemplateRows, [0, NaN])
        //console.log(this.x,this.y)
        if(this.presetAxis){
            if(this.gridTemplateRows.length>1){
               this.gridTemplateRows.pop()
            }
        }
        return this
    }
    Number.prototype.devise = function(coordinates, length) {
        let presetArea, thislength
        if (!coordinates) {
            let defaultArea = [1, 1, 2, 2]
            presetArea = defaultArea
        }
        if (coordinates) {
            presetArea = coordinates
        }
        if (length) {
            thislength = length
        } else {
            thislength = [this.x, this.y]
        }
        let toRealObject = (object) => {
            let keys = Object.keys(object)
            let values = Object.values(object)
            let newObject = {}
            keys.forEach((element, index) => {
                newObject[element] = values[index]
            })
            return newObject;
        }
        let countDirection = (object, direction, countArray) => {
            let numberOfDirection
            let stack = toRealObject(object)
            if (countArray) {
                numberOfDirection = countArray
            } else {
                numberOfDirection = []
            }
            numberOfDirection.push(stack.direction)
            for (let key in stack) {
                if (stack[key] instanceof Object && !Array.isArray(stack[key])) {
                    countDirection(stack[key], stack[key].direction, numberOfDirection)
                }
            }
            return numberOfDirection.filter(element => element !== undefined)
        }
        let countPosition = (object, direction, countArray) => {
            //console.log(object.point[0])
            let stack = toRealObject(object)
            let numberOfPoint
            if (countArray) {
                numberOfPoint = countArray
            } else {
                numberOfPoint = []
            }
            numberOfPoint.push(stack.position)
            for (let key in stack) {
                if (stack[key] instanceof Object && !Array.isArray(stack[key])) {
                    countPosition(stack[key], stack[key].direction, numberOfPoint)
                }
            }
            return numberOfPoint.filter(element => element !== undefined)
        }
        let getDirection = (result) => {
            return result.filter((item, index) => result.indexOf(item) === index).map(value => value.replace(/[0-9]/g, ''))
        }
        let getPosition = (result) => {
            return result.filter((item, index) => result.indexOf(item) === index).map(value => value.replace(/\D/g, ''))
        }
        let identify = (area, callback) => {
            //debug point in count direction.
            let numOfDir = countDirection(area)
            let numOfPos = countPosition(area)
            let result = []
            numOfDir.forEach((value, index) => {
                if (value == 'perpendicular') {
                    result.push(value + Math.round(numOfPos[index][0].x))
                }
                if (value == 'parallel') {
                    result.push(value + Math.round(numOfPos[index][0].y))
                }
            })
            return callback(result)
        }
        let identifyDirection = (area, callback) => {
            let numOfDir = identify(area, getDirection)
            //console.log(numOfDir)
            let substitutionX = numOfDir.filter(element => element == "perpendicular").length
            let substitutionY = numOfDir.filter(element => element == "parallel").length
            return [substitutionX, substitutionY]
        }
        let composeArea = (direction, coordinates, gridArea, value) => {
            [x1, y1, x2, y2] = coordinates
            if (value == 0) {
                if (gridArea == 'L') {
                    if (direction == 'parallel' || direction == 1) {
                        x2 = x2 - 1
                    }
                    if (direction == 'perpendicular' || direction == 0) {
                        y2 = y2 - 1
                    }
                    return [x1, y1, x2, y2]
                }
                if (gridArea == 'R') {
                    if (direction == 'parallel' || direction == 1) {
                        x1 = x1 + 1
                    }
                    if (direction == 'perpendicular' || direction == 0) {
                        y1 = y1 + 1
                    }
                    return [x1, y1, x2, y2]
                }
            } else if (value > 0) {
                if (gridArea == 'L') {
                    if (direction == 'parallel' || direction == 1) {
                        x2 = x2 - (1 + value)
                    }
                    if (direction == 'perpendicular' || direction == 0) {
                        y2 = y2 - (1 + value)
                    }
                    return [x1, y1, x2, y2]
                }
                if (gridArea == 'R') {
                    if (direction == 'parallel' || direction == 1) {
                        x1 = x1 + (1 + value)
                    }
                    if (direction == 'perpendicular' || direction == 0) {
                        y1 = y1 + (1 + value)
                    }
                    return [x1, y1, x2, y2]
                }
            }
        }
        let reviseArea = (object, gridAreaName, length) => {
            let direction = object.direction;
            let lc = object.leftGridArea;
            let rc = object.rightGridArea;
            let left = object.left
            let right = object.right
            let array
            let thislength = object.direction == 'perpendicular' ? array = length[0] : array = length[1]
            let getValues = (array, from, to) => {
                //console.log(array, from, to)
                return array.slice(array.indexOf(from) + 1, array.indexOf(to))
            }
            let getPosition = direction => {
                if (direction == 'perpendicular') {
                    return Object.values(object.position[0])[0]
                }
                if (direction == 'parallel') {
                    return Object.values(object.position[0])[1]
                }
            }
            let getAxis = direction => object.axis.filter(value => {
                if (value.direction == direction) {
                    return value
                }
            })
            let p = getPosition(object.direction)
            let roundP = Math.round(p)
            let gal = Math.round(getAxis(direction)[0].left * 10) / 10
            let gar = Math.round(getAxis(direction)[0].right * 10) / 10
            let l = p - gal
            let r = p + gar
            let directionOnLeft = getValues(thislength, Math.round(l * 10) / 10, p).length
            let directionOnRight = getValues(thislength, p, Math.round(r * 10) / 10).length
            //console.log(object.direction)
            //console.log(directionOnLeft,directionOnRight,gridAreaName)
            //console.log(object.direction, object.gridArea, gridAreaName,directionOnLeft, directionOnRight)
            //console.log(composeArea(object.direction,object.gridArea,gridAreaName,directionOnRight),'<-',object.gridArea,'->',composeArea(object.direction,object.gridArea,gridAreaName,directionOnLeft))
            if (gridAreaName == "L") {
                return composeArea(object.direction, object.gridArea, gridAreaName, directionOnRight)
            }
            if (gridAreaName == "R") {
                //console.log(p,l,r,thislength,direction)
                return composeArea(object.direction, object.gridArea, gridAreaName, directionOnLeft)
            }
        }
        let [x1, y1, x2, y2] = presetArea
        let endCoordinates = identifyDirection(this)
        x2 = x2 + endCoordinates[1]
        y2 = y2 + endCoordinates[0]
        this.gridArea = coordinates ? this.gridArea = coordinates : this.gridArea = [x1, y1, x2, y2]
        //console.log(endCoordinates,[x1,y1,x2,y2],presetArea,thisArea)
        //console.log(this.gridArea,identifyDirection(this))
        //console.log(this.leftGridArea,this.rightGridArea)
        if (typeof this.left == 'object') {
            let newArea = reviseArea(this, 'L', thislength)
            //console.log(this.gridArea,coordinates,newArea)
            if (coordinates) {
                //console.log(true)
                this.left.devise(newArea, thislength)
            } else {
                this.left.devise(newArea, thislength)
            }
        } else {
            //console.log(true)
            this.leftGridArea = reviseArea(this, 'L', thislength)
            this.left
        }
        if (typeof this.right == 'object') {
            let newArea = reviseArea(this, 'R', thislength)
            if (coordinates) {
                this.right.devise(newArea, thislength)
            } else {
                //console.log(true)
                this.right.devise(newArea, thislength)
            }
        } else {
            //console.log(this.gridArea)
            this.rightGridArea = reviseArea(this, 'R', thislength)
            this.right
        }
        return this
    }
    Number.prototype.extract = function() {
        let object = this
        let coordinates = new Array;

        function extractCoordinates(mat, recur) {
            let stack = Object.values(mat);
            if (Number.isFinite(mat.left)) {
                coordinates.push(mat.leftGridArea)
            }
            if (Number.isFinite(mat.right)) {
                coordinates.push(mat.rightGridArea)
            }
            for (let key in stack) {
                if (stack[key] instanceof Object && !Array.isArray(stack[key])) {
                    extractCoordinates(stack[key])
                }
            }
        }
        extractCoordinates(this)
        return coordinates
    }
    let amend = {}
    amend.offset = function(index) {
        const arr = this.obj.cor
        const indicesToRemove = index;
        indicesToRemove.sort((a, b) => b - a);
        for (let i = 0; i < indicesToRemove.length; i++) {
            arr.splice(indicesToRemove[i], 1);
        }
        this.obj.cor = arr
        return this.obj
    }
    amend.order = function() {
        const arr = this.obj.cor.map(arr => {
            return Number(arr.join(''))
        })
        const sortedArr = arr.sort((a, b) => {
            const sumA = a
            const sumB = b
            return sumA - sumB;
        });
        let a = sortedArr.map(value => {
            return Array.from(String(value), Number)
        })
        this.obj.cor = a
        return this.obj
    }
    amend.property = function(value) {
        this.obj.property = this.obj.property ? this.obj.property : []
        this.obj.property.push(value)
    }
    amend.breakpoint = function(value) {
        const mediaQuery = window.matchMedia(value[0])
        if (mediaQuery.matches) {
            this.obj = value[1]
        }
        return
    }
    amend.childProperty = function(value) {
        this.obj.propertyChild = this.obj.propertyChild ? this.obj.propertyChild : []
        this.obj.propertyChild.push(value)
    }

    function breakpoint() {
        return {
            name: "breakpoint",
            value: [...arguments]
        }
    }
    function order() {
        return {
            name: "order"
        }
    }

    function offset() {
        return {
            name: "offset",
            value: [...arguments]
        }
    }

    function property() {
        return {
            name: "property",
            value: [...arguments]
        }
    }

    function childProperty() {
        return {
            name: "childProperty",
            value: [...arguments]
        }
    }
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

    function set(values, div) {
        let o, cor
        if (values.add == true) {
            o = values
            cor = values.cor
            //throw Error('not found')
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

    function repeat(parent, num, direction) {
        if (num < 13 && num > 1) {
            let base = 1;
            let remaining = num - 2
            let result = (parent).splits(base, base, direction)
            let right = result
            while (remaining <= 12 && remaining >= 1) {
                let o = (remaining + 1).splits(base, remaining, direction)
                right = right.right = o
                remaining--
            }
            return result
        } else {
            throw new Error('Invalid columns')
        }
    }
    Number.prototype.col = function(num, name) {
        return repeat(this, num, 'perpendicular')
    }
    Number.prototype.row = function(num, name) {
        return repeat(this, num, 'parallel')
    }
    const nodeList = document.querySelectorAll("div[layout]")
    const composeObject = []
    for (let i = 0; i < nodeList.length; i++) {
        var att = nodeList[i].getAttribute("layout")
        composeObject[i] = eval(att)
        set(composeObject[i], nodeList[i])
    }
})