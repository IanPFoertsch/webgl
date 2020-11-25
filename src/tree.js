"use strict"
class Tree {
  //should contain both the webgl representation & the CPU data

  constructor({origin = [0,0], length = 0, angle = 0, propagate = 0, vary_by = 0}) {

    this.origin = origin
    this.length = length
    this.terminus = [origin[0] + Math.cos(angle), origin[1] + Math.sin(angle)]
    this.angle = angle

    if (propagate > 0) {
      this.left_child = new Tree({origin: this.terminus, length: length, angle: angle + vary_by,  propagate: propagate - 1})
      this.right_child = new Tree({origin: this.terminus, length: length, angle: angle - vary_by,  propagate: propagate - 1})
    }
  }

  vertices() {
    //todo: figure out a better way to do this
    var _vertices = this.origin.concat(this.terminus)
    var left_vertices = []
    var right_vertices = []

    if (this.left_child !== undefined) {
      left_vertices = this.left_child.vertices()
    }

    if (this.right_child !== undefined) {
      right_vertices = this.left_child.vertices()
    }

    return [..._vertices, ...left_vertices, ...right_vertices]
  }
}

export { Tree }
