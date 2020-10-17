"use strict"

class BoxOutline {
  //We assume a box outline like so
  //  A ---- B
  //  |      |
  //  |      |
  //  D ---- C
  constructor(origin, dimension) {
    this.plus = origin + dimension
    this.minus = origin - dimension
    this.vertices = [
      this.pointA(), this.randomColor(),
      this.pointB(), this.randomColor(),
      this.pointB(), this.randomColor(),
      this.pointC(), this.randomColor(),
      this.pointC(), this.randomColor(),
      this.pointD(), this.randomColor(),
      this.pointD(), this.randomColor(),
      this.pointA(), this.randomColor()
    ].flat()
  }

  randomColor() {
    return Array(3).fill(0).map(() => {
      return Math.random()
    })
  }

  pointA() {
    return [this.minus, this.plus]
  }

  pointB() {
    return [this.plus, this.plus]
  }

  pointC() {
    return [this.plus, this.minus]
  }

  pointD() {
    return [this.minus, this.minus]
  }

}

export { BoxOutline }
