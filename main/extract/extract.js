export const addExtract = () => {
	Number.prototype.extract = function(){
    let object = this
    let coordinates = new Array;
    function extractCoordinates(mat,recur){
      let stack = Object.values(mat);
      if(Number.isFinite(mat.left)){
        coordinates.push(mat.leftGridArea)
      }
      if(Number.isFinite(mat.right)){
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
}