function revisePoint(point,value,direction,addition){
      if(addition){
        if(direction === "perpendicular"){
          point[0].x = point[0].x + value
        }
        if(direction === "parallel"){
          point[0].y = point[0].y + value
        }
        
      }
      if(!addition){
        if(direction === "perpendicular"){
          point[0].x =  value
        }
        if(direction === "parallel"){
          point[0].y = value
        }
      }
      return point
    }
  export default revisePoint