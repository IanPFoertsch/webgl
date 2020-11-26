"use strict"
class Tree {
  //should contain both the webgl representation & the CPU data

  constructor({origin = [0,0], length = 0, angle = 0, propagate = 0, angle_variance = 0, length_decay = 1}) {

    this.origin = origin
    this.length = length
    this.terminus = [origin[0] + Math.cos(angle) * this.length, origin[1] + Math.sin(angle) * this.length]
    this.angle = angle

    if (propagate > 0) {
      this.left_child = new Tree({
        origin: this.terminus,
        length: length / length_decay,
        angle: angle + angle_variance,
        propagate: propagate - 1,
        angle_variance: angle_variance,
        length_decay: length_decay
      })
      this.right_child = new Tree({
        origin: this.terminus,
        length: length / length_decay,
        angle: angle - angle_variance,
        propagate: propagate - 1,
        angle_variance: angle_variance,
        length_decay: length_decay
      })
    }
  }

  vertices() {
    //todo: figure out a better way to do this
    var _vertices = this.origin.concat(this.terminus)

    if (this.left_child !== undefined) {
      _vertices.push(this.left_child.vertices())
    }

    if (this.right_child !== undefined) {
      _vertices.push(this.right_child.vertices())
    }

    return _vertices.flat()
  }
}

export { Tree }
