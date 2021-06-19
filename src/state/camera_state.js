'use strict'
import { RotationUpdate, TranslationUpdate } from "../mouse_input.js"
import {
  multiply4,
  xRotationMatrix,
  yRotationMatrix,
  translationMatrix,
  vector_addition,
  vectorMatrixMultiply,
} from "../matrices.js"

import initialization from "../../config/init.json"

// degrees => radians
// radians = degrees * (PI/180)
var degrees_to_radians = function(degrees) {
  return degrees * (Math.PI/180.0)
}

const ninety_degrees = degrees_to_radians(90)

class CameraState {
  constructor() {
    this.vertical_rotation = 0
    this.horizontal_rotation = 0
    this.zoom = 300
    this.translation = [0, 0, 0]
    this.focalTarget = [0.0, 0.0, 0.0]
    
    this.cameraPosition = initialization.camera_position
  }

  updateFromTranslationEvent(update) {
    // TODO: When translating, (ie click & dragging view) we should project
    // A ray from camera to focal target onto the x-z horizonatal plane, and scale the
    // X-Z translation based on how zoomed out we are, so that we click & drag a greater
    // amount for a given mouse input when we're very zoomed out.
    this.translation = vector_addition(this.translation, update.translation)
  }

  updateFromRotationEvent(update) {
    // this.horizontal_planvar angle_to_z_axis = angle_between_vectors(vector_inverse(camera_position_at_origin), [0, 0, 1])e_rotation(update)
    this.horizontal_rotation = this.horizontal_rotation + (update.rotation[0] / 200)


    var vertical_diff = this.vertical_rotation + (update.rotation[1] / 200)
    if (vertical_diff > ninety_degrees - 0.1) {
      vertical_diff = ninety_degrees - 0.1
    }

    this.vertical_rotation = vertical_diff

  }


  updateFromEvent(update, event) {
    if (update instanceof RotationUpdate) {
      this.updateFromRotationEvent(update, event)
    } else if (update instanceof TranslationUpdate) {
      this.updateFromTranslationEvent(update, event)
    }
  }

  getFocalTarget() {
    return this.translation.slice()
  }

  getCameraPosition() {
    // start with a camera position of 0,0,- zoom
    // console.log(this.translation)
    var y_rotate = yRotationMatrix(this.horizontal_rotation)
    var x_rotate = xRotationMatrix(this.vertical_rotation)

    var translate = translationMatrix(this.translation[0], this.translation[1], this.translation[2])
    //TODO: This should really work: we should be able to multiply the matrices together, then apply the
    // resultant matrix to the starting vector to get the final position.
    // However it's not working for some reason I don't understand.
    // TODO: retake linear algebra and figure out why matrix multiplication doesn't work the way I expect.
    // var matrix = multiply4(x_rotate, y_rotate)
    // matrix = multiply4(matrix, translate)

    var starting_point = [0,0,- this.zoom, 1]
    var x_rotated = vectorMatrixMultiply(starting_point, x_rotate)
    var y_rotated = vectorMatrixMultiply(x_rotated, y_rotate)

    //TODO: refactor our vector handling to make either 4-vectors the default
    // or update the matrix math to seamlessly accept 3-vectors
    return vectorMatrixMultiply(y_rotated, translate).slice(0,3)
  }
}

export { CameraState }
