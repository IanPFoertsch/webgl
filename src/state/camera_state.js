'use strict'
import { RotationUpdate, TranslationUpdate } from "../mouse_input.js"
import {
  multiply4,
  xRotationMatrix,
  yRotationMatrix,
  zRotationmatrix,
  vectorMatrixMultiply,
  subtractVectors,
  angle_between_vectors
} from "../matrices.js"


class CameraState {
  constructor() {
    this.focalTarget = [0.0, 0.0, 0.0]
    this.existingFocalTarget = [0.0, 0.0, 0.0]

    this.activeCameraPosition = [0.0, 0.0, 0.0]
    this.storedCameraPosition = [0.0, 0.0, -300.0]
  }

  zeroAndSave() {
    this.storedCameraPosition = this.getCameraPosition()
    this.existingFocalTarget = this.getFocalTarget()

    this.focalTarget = [0,0,0]
    this.activeCameraPosition = [0,0,0]
  }


  updateFromTranslationEvent(update, event) {
    //need to:
    // 1- move the camera in the x-z plane
    //    a. correct the z-movement by the cos(theta) of the current x-axis (vertical)
    //       rotation
    // 2- move the focal target the same amount in the x-z plane

    // TODO: When translating, (ie click & dragging view) we should project
    // A ray from camera to focal target onto the x-z horizonatal plane, and scale the
    // X-Z translation based on how zoomed out we are, so that we click & drag a greater
    // amount for a given mouse input when we're very zoomed out.

    this.focalTarget[0] = update.translation[0]
    //todo: scale this by current vertical rotation
    //Z-axis updated from Y-axis mouse input
    this.focalTarget[2] = - update.translation[1]

    this.activeCameraPosition[0] = update.translation[0]
    //todo: scale this by current vertical rotation
    this.activeCameraPosition[2] = - update.translation[1]
  }

  rotationAroundPoint(yRotation, xRotation) {

  }

  updateFromRotationEvent(update, event) {
    var rotation_target_vector = this.focalTarget.concat(1)
    //NOTE: the "vertical" rotation includes both X and Z components.
    // this is because when our view is rotated 90degrees around the vertical y-axis
    // (we're viewing the scene from the "right"), if we attempt to rotate the scene
    // vertically around the x-axis, there is no or muted effect, because we're
    // _on_ the x-axis, so rotating the point about the x-axis doesn't result in much
    // vertical camera motion.
    var ninety_degrees = 1.5707963267948966

    var angle_to_y_x_plane = ninety_degrees - angle_between_vectors(this.storedCameraPosition, [0,0,1])
    var x_rotation_scaling  = Math.sin(angle_to_y_x_plane)

    var angle_to_y_z_plane = ninety_degrees - angle_between_vectors(this.storedCameraPosition, [1,0,0])
    var z_rotation_scaling  = Math.sin(angle_to_y_z_plane)
    console.log(z_rotation_scaling)
    var x_rotation = xRotationMatrix((- update.rotation[1] / 20) * x_rotation_scaling, rotation_target_vector)
    // console.log("x-axis", JSON.stringify(update.rotation[0]), "y-axis", JSON.stringify(- update.rotation[1]))
    var z_rotation = zRotationmatrix((- update.rotation[1] / 20) * z_rotation_scaling, rotation_target_vector)
    var y_rotation = yRotationMatrix(update.rotation[0] / 20, rotation_target_vector)
    // console.log("x:", this.matrix_to_string(x_rotation))
    // console.log("z:", this.matrix_to_string(z_rotation))
    var vertical_rotation_matrix = multiply4(x_rotation, z_rotation)
    // console.log("y:", this.matrix_to_string(y_rotation))
    // console.log("v:", this.matrix_to_string(y_rotation))
    var combined_rotation_matrix = multiply4(vertical_rotation_matrix, y_rotation)


    // console.log("v:", this.matrix_to_string(vertical_rotation_matrix))
    // console.log(this.storedCameraPosition)
    var rotated_camera_location = vectorMatrixMultiply(this.storedCameraPosition.concat(1), combined_rotation_matrix)
    // console.log(rotated_camera_location)
    var differential = subtractVectors(rotated_camera_location, this.storedCameraPosition)
    // console.log(JSON.stringify(differential))
    this.activeCameraPosition = differential

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
    return this.focalTarget.map((item, index) => {
      return item + this.existingFocalTarget[index]
    })
  }

  getCameraPosition() {
    return this.activeCameraPosition.map((item, index) => {
      return item + this.storedCameraPosition[index]
    })
  }
}

export { CameraState }
