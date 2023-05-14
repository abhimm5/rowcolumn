function restructure(primaryValue,left,right,direction){
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
  export default restructure