window.addEventListener("load", () => {
  const lg = 61.2;
  const sm = 38.8;
  Number.prototype.splits = function (a, b, c, axis) {
    [this.left, this.right, this.direction] = arguments;
    return this
  }
  Number.prototype.rearrange = function (axis) {
    let sum = Number(this.left) + Number(this.right)
    let parent = this.valueOf()
    let left = Math.round((parent / sum * Number(this.left)))
    let right = Math.round((parent / sum * Number(this.right)))
    this.dimension = [left, right]

    if (axis) {
      this.axis = axis
    }
    else {
      this.axis = [{ left: sum, right: sum, direction: "perpendicular" }, { left: sum, right: sum, direction: "parallel" }]
    }

    let getPerpendicular = this.axis[0]
    let getParallel = this.axis[1]

    if (this.direction == 'perpendicular') {
      this.axis[0].left = left
      this.axis[0].right = right
      if (typeof this.left == 'object') {
        let xl = getPerpendicular.left.splits((this.left.left), (this.left.right), this.left.direction)
        let yl = getParallel.left.splits((this.left.left), (this.left.right), this.left.direction)
        let newAxisX = [{ left: (xl), right: (xl), direction: xl.direction }, this.axis[1]]
        let newAxisY = [this.axis[0], { left: (yl.left), right: (yl.right), direction: yl.direction }]
        this.left = this.left.direction == 'perpendicular' ? xl.rearrange(newAxisX) : yl.rearrange(newAxisY)
      }
      else {
        this.left = this.dimension[0]
      }
      if (typeof this.right == 'object') {
        let xr = getPerpendicular.right.splits((this.right.left), (this.right.right), this.right.direction)
        let yr = getParallel.right.splits((this.right.left), (this.right.right), this.right.direction)
        let newAxisX = [{ left: (xr), right: (xr), direction: xr.direction }, this.axis[1]]
        let newAxisY = [this.axis[0], { left: (yr.left), right: (yr.right), direction: yr.direction }]
        this.right = this.right.direction == 'perpendicular' ? xr.rearrange(newAxisX) : yr.rearrange(newAxisY)
      }
      else {
        this.right = this.dimension[1]
      }
    }
    else if (this.direction == 'parallel') {
      this.axis[1].left = left
      this.axis[1].right = right
      if (typeof this.left == 'object') {
        let xl = getPerpendicular.left.splits((this.left.left), (this.left.right), this.left.direction)
        let yl = getParallel.left.splits((this.left.left), (this.left.right), this.left.direction)
        let newAxisX = [{ left: xl.left, right: xl.right, direction: xl.direction }, this.axis[1]]
        let newAxisY = [this.axis[0], { left: yl, right: yl, direction: yl.direction }]
        this.left = this.left.direction == 'parallel' ? yl.rearrange(newAxisY) : xl.rearrange(newAxisX)
      }
      else {
        this.left = this.dimension[0]
      }
      if (typeof this.right == 'object') {
        let xr = getPerpendicular.right.splits((this.right.left), (this.right.right), this.right.direction)
        let yr = getParallel.right.splits((this.right.left), (this.right.right), this.right.direction)
        let newAxisX = [{ left: (xr), right: (xr), direction: xr.direction }, this.axis[1]]
        let newAxisY = [this.axis[0], { left: (yr.left), right: (yr.right), direction: yr.direction }]

        this.right = this.right.direction == 'parallel' ? yr.rearrange(newAxisY) : xr.rearrange(newAxisX)
      }
      else {
        this.right = this.dimension[1]
      }
    }
    else {
      throw new TypeError('direction argument is not defined')
    }
    return this
  }
  let test = (100).splits(lg.splits(sm, lg, 'parallel'), sm.splits(lg, sm.splits(lg, sm, 'perpendicular'), 'parallel'), 'perpendicular')
  console.log(test.rearrange())
})