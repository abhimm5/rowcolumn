<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
        <div class="grid-container" id="grid-container" layout="(100).splits(lg.splits(lg.splits(lg,sm.splits(sm,lg,'perpendicular') ,'parallel'),sm ,'perpendicular'), sm.splits(sm,lg,'parallel'),'perpendicular')">
            <div>
                1
            </div>
            <div>
                2
            </div>
            <div>
                3
            </div>
            <div>
                4
            </div>
        </div>
        <script type="text/javascript">
            const parent = 100;
  const lg = 61.2;
  const sm = 38.8;
  function restructure(primaryValue,left,right,direction){
    //console.log(left)
    let x = { left: primaryValue, right: primaryValue, direction: "perpendicular"}
    let y = { left: primaryValue, right: primaryValue, direction: "parallel" }
    if(direction == "perpendicular"){
      x = { left: left, right: right, direction: "perpendicular"}
    }
    if(direction == "parallel"){
      y = { left: left, right: right, direction: "parallel"}
    }
    return [x,y]
  }
  Number.prototype.splits = function (a, b, c, axis) {
    [this.left, this.right, this.direction] = arguments;
    return this
  }
  Number.prototype.rearrange = function(axis,point){
    let sum = Number(this.left) + Number(this.right)
    let parent = this.valueOf()
    let left = Math.round((parent/sum * Number(this.left)))
    let right =  Math.round((parent/sum * Number(this.right)))
    let dimension = [left,right]

    if(axis){
      if(this.direction=="perpendicular"){
        axis[0].left = left
        axis[0].right = right
      }
      if(this.direction == "parallel"){
        axis[1].left = left
        axis[1].right = right
      }
      this.axis = axis     
    }
    else{
      this.axis = restructure(left+right,left,right,this.direction)
    }
    function reviseAxis(axis,value,direction,extras){
      axis.map(getParent =>{
        if(getParent.direction == direction){
          if(extras){
            getParent.left = extras[0] 
            getParent.right = extras[1] 
          }
          else{
            getParent.left = value 
            getParent.right = value
          }
        }
      })
      return axis
    }
    function revisePoint(point,value,direction){
      if(direction == "perpendicular"){
       point[0].x =  value
      }
      if(direction == "parallel"){
        point[0].y = value
      }
      return point
    }

    if(point){
      myPoint = point
    }
    else{
      let p = [{x:0,y:0}]
      myPoint = revisePoint(p,left,this.direction)
    }

      

    
    this.point = JSON.parse(JSON.stringify(myPoint))


    let raxis = JSON.parse(JSON.stringify(this.axis))
    let rectangles = reviseAxis(raxis,undefined,this.direction,[left,right])
    let leftRectangle = {width:rectangles[0].left,height:rectangles[1].left}
    let rightRectangle = {width:rectangles[0].right,height:rectangles[1].right}
    this.dimensions = [{left:leftRectangle,right:rightRectangle}]
  
    let getPerpendicular = this.axis[0]
    let getParallel = this.axis[1]
    //console.log(left,right)
      if(typeof this.left == 'object'){
        let xl = getPerpendicular.left.splits((this.left.left),(this.left.right),this.left.direction)
        let yl = getParallel.left.splits((this.left.left),(this.left.right),this.left.direction) 
        let newAxisX = [{ left: Number(left)  , right: Number(right) , direction: "perpendicular" },getParallel]
        let newAxisY = [getPerpendicular,{ left: Number(left), right: Number(right), direction: "parallel" }]
        if(this.left.direction !== this.direction && this.left.direction == 'perpendicular'){
          let revisedAxis = reviseAxis(newAxisX,left,this.left.direction)
          this.left = xl.rearrange(revisedAxis)
        }
        else if(this.left.direction !== this.direction && this.left.direction == 'parallel'){
          let revisedAxis = reviseAxis(newAxisY,left,this.left.direction)
          this.left = yl.rearrange(revisedAxis)
        }
        else{
          this.left = this.left.direction == 'perpendicular'? xl.rearrange(newAxisX):yl.rearrange(newAxisY)
        }
      }
      else{
        this.left = dimension[0]
      }
      if(typeof this.right == 'object'){
        
        
        let xr = getPerpendicular.right.splits((this.right.left),(this.right.right),this.right.direction)
        let yr = getParallel.right.splits((this.right.left),(this.right.right),this.right.direction)
        let newAxisX = [{ left: Number(left), right: Number(right), direction: "perpendicular" },getParallel]
        let newAxisY = [getPerpendicular,{ left: Number(left), right: Number(right), direction: "parallel" }]
        let newPointX = revisePoint(myPoint,xr.rearrange(newAxisX).left + myPoint[0].x ,this.direction)
        let newPointY = revisePoint(myPoint,yr.rearrange(newAxisY).left + myPoint[0].y ,this.direction)

        console.log(myPoint)

        if(this.right.direction !== this.direction && this.right.direction == 'perpendicular'){
          let revisedAxis = reviseAxis(newAxisX,right,this.right.direction)
          this.right = xr.rearrange(revisedAxis)
        }
        else if(this.right.direction !== this.direction && this.right.direction == 'parallel'){
          let revisedAxis = reviseAxis(newAxisY,right,this.right.direction)
          let revisedPoint = revisePoint(myPoint)
          //console.log(revisedPoint,newPointY,myPoint)
          this.right = yr.rearrange(revisedAxis)
        }
        else{
          this.right = this.right.direction == 'perpendicular'? xr.rearrange(newAxisX,newPointX):yr.rearrange(newAxisY,newPointY)
        }  
      }
      else{
        this.right = dimension[1]
      }
    return this
  }
  

        let composeCoordinates = (direction,coordinates) => {
          let x1,y1,x2,y2;
          if(!coordinates){
            [x1,y1,x2,y2] = defaultCoordinate;
          }
          else{
            [x1,y1,x2,y2] = coordinates
          }
          if (direction == 'parallel'||direction == 1) {
            let mx1 = x2 
            let mx2 = mx1 +1 
            return [{left:[x1,y1,x2,y2],right:[mx1, y1,mx2, y2]}]
          }
          if (direction == 'perpendicular'||direction == 0) {
            let my1 = y2 
            let my2 = my1 + 1 
            return [{left:[x1,y1,x2,y2],right:[x1, my1,x2, my2]}]
          }
        }
        let identifyCoordinates = (object,direction) => {
          let isAllObject = Object.values(object).map( value => typeof value == 'object' && !Array.isArray(value)).splice(0,2).every(value=>value==true)
          //console.log(object instanceof Function)
          for(let key in object){
            if (object[key] instanceof Object && !Array.isArray(object[key])) {
              if(object[key].direction == 'perpendicular'){
                console.log(object[key])
                numberOfDirection.push()
              }
              identifyCoordinates(object[key],'perpendicular')
            }
          }
        }
        let assignCoordinates = (quadrilateral,coordinate) => {
          if(Number.isFinite(quadrilateral)){
            console.log(true)
            identifyCoordinates(quadrilateral,'perpendicular')
            return
          }
          quadrilateral.coordinate = composeCoordinates(quadrilateral.direction,coordinate)
          //console.log(quadrilateral.coordinate)
          for(let key in quadrilateral){
            if (Number.isFinite(quadrilateral[key])) {
              identifyCoordinates(quadrilateral,'perpendicular') 
            }
            if (quadrilateral[key] instanceof Object && !Array.isArray(quadrilateral[key])) {
              assignCoordinates(quadrilateral[key],quadrilateral.coordinate[0][key])
            }
          }
        }

  function Engine(){
    this.primaryNumber = Number(this)
    this.primaryDirection = this.direction
    this.x = this.primaryNumber;
    this.y = this.primaryNumber;
    this.quadrilateral = [];
  }

 

  let test2 = (100).splits(lg.splits(lg.splits(lg.splits(sm,lg,'perpendicular'),sm.splits(sm,lg,'perpendicular') ,'parallel'),sm ,'perpendicular'), sm.splits(sm,lg,'parallel'),'perpendicular')
  let test1 = (100).splits(lg.splits(lg,sm ,'perpendicular'), sm.splits(lg,sm ,'parallel'),'perpendicular')
  let test3 = (100).splits(lg.splits(lg,sm.splits(lg,sm ,'perpendicular') ,'parallel'), sm,'perpendicular')
  let test4 = (100).splits(3/12,(9/12).splits(3/12,6/12,"parallel"),'perpendicular')
  let test5 = (100).splits(lg.splits(lg,sm,"parallel"),sm.splits(lg,sm,"parallel"),'perpendicular')
  let test6 = (100).splits(lg,sm.splits(lg,sm,"parallel"),'perpendicular') //basic
  let test7 = (100).splits(lg.splits(lg.splits(lg,sm.splits(sm,lg,'perpendicular') ,'parallel'),sm ,'perpendicular'), sm.splits(sm,lg,'parallel'),'perpendicular')
  let test8 = (100).splits(lg.splits(lg,sm,'perpendicular'), sm.splits(lg,sm ,'perpendicular') ,'perpendicular') //all one direction
  let test9 = (100).splits(lg.splits(sm,lg,'parallel'),sm.splits(lg,sm.splits(lg,sm,'perpendicular'),'parallel'),'perpendicular')
  console.log((100).splits(lg.splits(lg,sm,'parallel'), sm.splits(lg,sm ,'parallel') ,'parallel').rearrange())
  let case1 = (100).splits(lg.splits(lg,sm ,'perpendicular'), sm.splits(lg,sm ,'parallel'),'perpendicular')
  //test7.rearrange().layout()
        </script>
    </body>
</html>