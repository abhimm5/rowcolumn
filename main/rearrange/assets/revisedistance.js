function reviseDistance(position,direction,array){
      let x,y
      if(!array){
        x = [] 
        y = []
      }
      if(array){
        x = array[0]
        y = array[1]
      }
      let cutOnAxes = position
      if(direction == "perpendicular"){
        x.push(cutOnAxes[0].x)
      }
      if(direction == "parallel"){
        y.push(cutOnAxes[0].y)
      }
      return [x,y]
    }
  export default reviseDistance