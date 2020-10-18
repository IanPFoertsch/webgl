"use strict"

import { rotate2d, translate } from "./matrices.js"

class BoxOutline {
  //We assume a box outline like so
  //  A ---- B
  //  |      |
  //  |      |
  //  D ---- C
  constructor(origin, dimension) {
    this.xOrigin = origin[0]
    this.yOrigin = origin[1]
    this.colors = {
      "a": this.randomColor(),
      "b": this.randomColor(),
      "c": this.randomColor(),
      "d": this.randomColor()
    }

    

    this.dimension = dimension
    this.buildVertices(this.points())
  }

  points() {
    return [
      this.pointA(),
      this.pointB(),
      this.pointC(),
      this.pointD()
    ]
  }

  randomColor() {
    return Array(3).fill(0).map(() => {
      return Math.random()
    })
  }

  buildVertices(points) {
    this.vertices = [
      points[0], this.colors.a,
      points[1], this.colors.b,
      points[1], this.colors.b,
      points[2], this.colors.c,
      points[2], this.colors.c,
      points[3], this.colors.d,
      points[3], this.colors.d,
      points[0], this.colors.a
    ].flat()
  }

  updatePosition(angle, translation) {
    var points = this.points()
    var rotated = points.map((point) => {
      return rotate2d(point, angle)
    })
    var translated = rotated.map((point) => {
      return translate(point, translation)
    })

    this.buildVertices(translated)
  }

  pointA() {
    return [this.xOrigin - this.dimension, this.yOrigin + this.dimension]
  }

  pointB() {
    return [this.xOrigin + this.dimension, this.yOrigin + this.dimension]
  }

  pointC() {
    return [this.xOrigin + this.dimension, this.yOrigin - this.dimension]
  }

  pointD() {
    return [this.xOrigin - this.dimension, this.yOrigin - this.dimension]
  }

}

export { BoxOutline }
