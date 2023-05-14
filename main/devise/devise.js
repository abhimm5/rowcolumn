export const addDevise = () => {
	Number.prototype.devise = function(coordinates,length){
  let presetArea, thislength
  if(!coordinates){
    let defaultArea = [1,1,2,2]
    presetArea = defaultArea 
  }
  if(coordinates){
    presetArea = coordinates
  }
  if(length){
    thislength = length
  }
  else{
    thislength = [this.x,this.y]
  }

  let toRealObject = (object) => {
    let keys = Object.keys(object)
    let values = Object.values(object)
    let newObject = {} 
    keys.forEach((element,index) => { newObject[element] = values[index] })
    return newObject;
  }

    let countDirection = (object,direction,countArray) => {
      let numberOfDirection
      let stack = toRealObject(object)
      if(countArray){
        numberOfDirection = countArray
      }
      else{
        numberOfDirection = []
      }
      numberOfDirection.push(stack.direction)
      for(let key in stack){
        if (stack[key] instanceof Object && !Array.isArray(stack[key])) {
          countDirection(stack[key],stack[key].direction,numberOfDirection)
        }
      }
      return numberOfDirection.filter(element => element !== undefined)
    }
    let countPosition = (object,direction,countArray) => {
      //console.log(object.point[0])
      let stack = toRealObject(object)
      let numberOfPoint
      if(countArray){
        numberOfPoint = countArray
      }
      else{
        numberOfPoint = []
      }
      numberOfPoint.push(stack.position)
      for(let key in stack){
        if (stack[key] instanceof Object && !Array.isArray(stack[key])) {
          countPosition(stack[key],stack[key].direction,numberOfPoint)
        }
      }
      return numberOfPoint.filter(element => element !== undefined)
    }
    let getDirection = (result) => {
      return result.filter((item,index) => result.indexOf(item) === index).map(value => value.replace(/[0-9]/g, ''))
    }
    let getPosition = (result) => {
      return result.filter((item,index) => result.indexOf(item) === index).map(value => value.replace(/\D/g,''))
    }
    let identify = (area,callback) => {
      //debug point in count direction.
      let numOfDir =  countDirection(area)
      let numOfPos = countPosition(area)
      let result = []
      numOfDir.forEach((value,index) => {
        if(value == 'perpendicular'){
          result.push(value + numOfPos[index][0].x)
        }
        if(value == 'parallel'){
          result.push(value + numOfPos[index][0].y)
        }
      })
      return callback(result)
    }
    let identifyDirection = (area,callback) => {
      let numOfDir =  identify(area,getDirection)
      //console.log(numOfDir)
      let substitutionX = numOfDir.filter(element => element =="perpendicular").length
      let substitutionY = numOfDir.filter(element => element =="parallel").length
      
      return [substitutionX,substitutionY]
    }

    
     let composeArea = (direction,coordinates,gridArea,value) => {
      [x1,y1,x2,y2] = coordinates
      if(value == 0){
        if(gridArea == 'L'){
        if (direction == 'parallel'||direction == 1) {
          x2=x2-1
        }
        if (direction == 'perpendicular'||direction == 0) {
          y2= y2-1
        }
        return [x1,y1,x2,y2]
      }
      if(gridArea == 'R'){
        if (direction == 'parallel'||direction == 1) {
          x1 =x1+1
        }
        if (direction == 'perpendicular'||direction == 0) {
           y1 = y1+1
        }
        return [x1,y1,x2,y2]
      }
      }
      else if(value > 0){
        if(gridArea == 'L'){
        if (direction == 'parallel'||direction == 1) {
          x2=x2-(1 +value)
        }
        if (direction == 'perpendicular'||direction == 0) {
          y2= y2-(1 +value)
        }
        return [x1,y1,x2,y2]
      }
      if(gridArea == 'R'){
        if (direction == 'parallel'||direction == 1) {
          x1 =x1+(1 +value)
        }
        if (direction == 'perpendicular'||direction == 0) {
           y1 = y1+(1 +value)
        }
        return [x1,y1,x2,y2]
      }
      }
    }

    let reviseArea = (object,gridAreaName,length) => {
      let direction = object.direction;
      let lc = object.leftGridArea;
      let rc = object.rightGridArea;
      let left = object.left
      let right = object.right
      let array
      let thislength  = object.direction == 'perpendicular' ? array = length[0] : array = length[1]
      let getValues = (array,from,to) => {
        return array.slice(array.indexOf(from)+1, array.indexOf(to))
      }
      let getPosition = direction => {
        if(direction == 'perpendicular'){
          return Object.values(object.position[0])[0]
        }
        if(direction == 'parallel'){
          return Object.values(object.position[0])[1]
        }
      }
      let getAxis = direction => object.axis.filter( value => {
        if(value.direction == direction){
          return value
        }
      })
      let p = getPosition(object.direction)
      let l = p - getAxis(direction)[0].left
      let r = p + getAxis(direction)[0].right
      let directionOnLeft = getValues(thislength,l,p).length
      let directionOnRight = getValues(thislength,p,r).length

      if(gridAreaName == "L"){
        return composeArea(object.direction,object.gridArea,gridAreaName,directionOnRight)
      }
      if(gridAreaName == "R"){
        return composeArea(object.direction,object.gridArea,gridAreaName,directionOnLeft)       
      }
    }
    
    let [x1,y1,x2,y2] = presetArea
    let endCoordinates = identifyDirection(this)
    x2 = x2 + endCoordinates[1]
    y2 = y2 + endCoordinates[0]
    this.gridArea = coordinates ? this.gridArea = coordinates :this.gridArea = [x1,y1,x2,y2]
    
  if(typeof this.left == 'object'){
    
    let newArea = reviseArea(this,'L',thislength)
    //console.log(this.gridArea,coordinates,newArea)
    if(coordinates){
      //console.log(true)
      this.left.devise(newArea,thislength)
    }
    else{
      this.left.devise(newArea,thislength)
    }
  }
  else{
    //console.log(true)
    this.leftGridArea = reviseArea(this,'L',thislength)
    this.left
  }
  if(typeof this.right == 'object'){
    let newArea = reviseArea(this,'R',thislength)
    if(coordinates){
      this.right.devise(newArea,thislength)
    }
    else{
      //console.log(true)
      this.right.devise(newArea,thislength)
    }
  }
  else{
    //console.log(this.gridArea)
    this.rightGridArea =  reviseArea(this,'R',thislength)
    this.right
  }
  return this
 }
}