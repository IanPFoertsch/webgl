'use strict'
import { RotationUpdate, TranslationUpdate } from "../mouse_input.js"
import {
  multiply4,
  xRotationMatrix,
  yRotationMatrix,
  zRotationmatrix,
  vector_addition,
  vector_inverse,
  vectorMatrixMultiply,
  vector_subtraction,
  angle_between_vectors
} from "../matrices.js"


class CameraState {
  constructor() {
    this.focalTarget = [0.0, 0.0, 0.0]
    this.cameraPosition = [0.0, 0.0, -300.0]
  }

  updateFromTranslationEvent(update, event) {
    // TODO: When translating, (ie click & dragging view) we should project
    // A ray from camera to focal target onto the x-z horizonatal plane, and scale the
    // X-Z translation based on how zoomed out we are, so that we click & drag a greater
    // amount for a given mouse input when we're very zoomed out.

    this.focalTarget[0] += update.translation[0]
    //todo: scale this by current vertical rotation
    //Z-axis updated from Y-axis mouse input
    this.focalTarget[2] += - update.translation[1]

    this.cameraPosition[0] += update.translation[0]
    //todo: scale this by current vertical rotation
    this.cameraPosition[2] += - update.translation[1]
  }

  updateFromRotationEvent(update, event) {
    // this.horizontal_plane_rotation(update)

    var rotation_target_vector = this.focalTarget.concat(1)

    var camera_location = this.getCameraPosition()

    this.cameraPosition = this.horizontal_plane_rotation(update)
  }

  horizontal_plane_rotation(update) {
    // horizontal plane rotataion is update.rotation[0] -> this doesn't really
    // follow the x,y convention but it intuitively makes sense, as we're rotating \
    // in the horizontal plane around the y-axis

    //NOTES FOR IMPLEMENTATION - to rotate in the horizontal z-x plane around the vertical y-axis
    // 1. Translate camera and focal point to origin
    //   a. get diff between camera and focal point
    var focal_point_to_camera = vector_subtraction(this.cameraPosition, this.focalTarget)

    var focal_point_to_origin = vector_inverse(this.focalTarget)

    var camera_position_at_origin = vector_addition(this.cameraPosition, focal_point_to_origin)

    var y_rotation = yRotationMatrix(update.rotation[0] / 200)
    //vector-matrix multiply to get rotated camera position

    var rotated_camera_position_at_origin = vectorMatrixMultiply(
      camera_position_at_origin.concat(1),
      y_rotation
    ).slice(0,3)
    // console.log(y_rotation)

    var new_camera_position = vector_addition(
      rotated_camera_position_at_origin,
      this.focalTarget
    )


    return new_camera_position
  }


  vertical_rotation() {
    //NOTES FOR IMPLEMENTATION - to rotate vertically around a virtual x-axis.
    // This accomplishes both x and z axis rotation. However we do it around a virtual x-axis
    // 1. Translate camera and focal point to origin
    // 2. Rotate camera -> focal point y-angle back to zero
    // 3. Perform the x-axis rotation
    // 4. Reverse the y-axis rotation
    // 5. Reverse the initial translation
  }

  matrix_to_string(matrix) {
    return `[${matrix[0].toFixed(2)}, ${matrix[1].toFixed(2)}, ${matrix[2].toFixed(2)}, ${matrix[3].toFixed(2)} \n [${matrix[4].toFixed(2)}, ${matrix[5].toFixed(2)}, ${matrix[6].toFixed(2)}, ${matrix[7].toFixed(2)}\n` +
    `[${matrix[8].toFixed(2)}, ${matrix[9].toFixed(2)}, ${matrix[10].toFixed(2)}, ${matrix[11].toFixed(2)} \n [${matrix[12].toFixed(2)}, ${matrix[13].toFixed(2)}, ${matrix[14].toFixed(2)}, ${matrix[15].toFixed(2)}]`
  }

  updateFromEvent(update, event) {
    if (update instanceof RotationUpdate) {
      this.updateFromRotationEvent(update, event)
    } else if (update instanceof TranslationUpdate) {
      this.updateFromTranslationEvent(update, event)
    }

  }

  getFocalTarget() {
    return this.focalTarget.slice()
  }

  getCameraPosition() {
    return this.cameraPosition.slice()
  }
}

export { CameraState }
