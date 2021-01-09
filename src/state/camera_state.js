'use strict'
import { RotationUpdate, TranslationUpdate } from "../mouse_input.js"
import {
  multiply4,
  xRotationMatrix,
  yRotationMatrix,
  zRotationmatrix,
  vectorMatrixMultiply,
  subtractVectors,
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

    //TODO: Make the scaling factor of the x-y rotation dynamic
    //NOTE: the "vertical" rotation includes both X and Z components.
    // this is because when our view is rotated 90degrees around the vertical y-axis
    // (we're viewing the scene from the "right"), if we attempt to rotate the scene
    // vertically around the x-axis, there is no or muted effect, because we're
    // _on_ the x-axis, so rotating the point about the x-axis doesn't result in much
    // vertical camera motion.
    var x_rotation = xRotationMatrix(update.rotation[1] / 50, rotation_target_vector)
    var z_rotation = zRotationmatrix(update.rotation[1] / 50, rotation_target_vector)
    var y_rotation = yRotationMatrix(update.rotation[0] / 50, rotation_target_vector)

    var vertical_rotation_matrix = multiply4(x_rotation, z_rotation)
    var combined_rotation_matrix = multiply4(vertical_rotation_matrix, y_rotation)

    var rotated_camera_location = vectorMatrixMultiply(this.storedCameraPosition.concat(1), combined_rotation_matrix)

    var differential = subtractVectors(rotated_camera_location, this.storedCameraPosition)
    this.activeCameraPosition = differential

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
