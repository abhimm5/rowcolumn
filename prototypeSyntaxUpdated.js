window.addEventListener("load", () => {
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
  Number.prototype.rearrange = function(axis,value,parentDirection){
    let sum = Number(this.left) + Number(this.right)
    let parent = this.valueOf()
    let left = Math.round((parent/sum * Number(this.left)))
    let right =  Math.round((parent/sum * Number(this.right)))
    this.dimension = [left,right]

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

    let getPerpendicular = this.axis[0]
    let getParallel = this.axis[1]
    //console.log(left,right)
      if(typeof this.left == 'object'){
        let xl = getPerpendicular.left.splits((this.left.left),(this.left.right),this.left.direction)
        let yl = getParallel.left.splits((this.left.left),(this.left.right),this.left.direction) 
        let newAxisX = [{ left: Number(left)  , right: Number(right) , direction: "perpendicular" },this.axis[1]]
        let newAxisY = [this.axis[0],{ left: Number(left), right: Number(right), direction: "parallel" }]
        if(this.left.direction !== this.direction && this.left.direction == 'perpendicular'){
          newAxisX.map(getParent =>{
            if(getParent.direction==this.direction){
              getParent.left = left
              getParent.right = left
            }
          })
          this.left = xl.rearrange(newAxisX,left,this.direction)
        }
        else if(this.left.direction !== this.direction && this.left.direction == 'parallel'){
          newAxisY.map(getParent =>{
            if(getParent.direction==this.direction){
              getParent.left = left
              getParent.right = left
            }
          })
          this.left = yl.rearrange(newAxisY,left,this.direction)
        }
        else{
          this.left = this.left.direction == 'perpendicular'? xl.rearrange(newAxisX,left,this.direction):yl.rearrange(newAxisY,left,this.direction)
        }
      }
      else{
        this.left = this.dimension[0]
      }
      if(typeof this.right == 'object'){
        let xr = getPerpendicular.right.splits((this.right.left),(this.right.right),this.right.direction)
        let yr = getParallel.right.splits((this.right.left),(this.right.right),this.right.direction)
        let newAxisX = [{ left: Number(left), right: Number(right), direction: "perpendicular" },this.axis[1]]
        let newAxisY = [this.axis[0],{ left: Number(left), right: Number(right), direction: "parallel" }]
        if(this.right.direction !== this.direction && this.right.direction == 'perpendicular'){
          newAxisX.map(getParent =>{
            if(getParent.direction==this.direction){
              getParent.left = right
              getParent.right = right
            }
          })
          this.right = xr.rearrange(newAxisX,right,this.direction)
        }
        else if(this.right.direction !== this.direction && this.right.direction == 'parallel'){
          newAxisY.map(getParent =>{
            if(getParent.direction==this.direction){
              getParent.left = right
              getParent.right = right
            }
          })
          this.right = yr.rearrange(newAxisY,right,this.direction)
        }
        else{
          this.right = this.right.direction == 'perpendicular'? xr.rearrange(newAxisX,right,this.direction):yr.rearrange(newAxisY,right,this.direction)
        }
        
      }
      else{
        this.right = this.dimension[1]
      }
    return this
  }
})