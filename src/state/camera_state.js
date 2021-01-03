'use strict'
import { RotationUpdate, TranslationUpdate } from "../mouse_input.js"
import {
  multiply4,
  xRotationMatrix,
  yRotationMatrix,
  xAxisRotationAroundPoint,
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
    var vertical_rotation = xRotationMatrix(update.rotation[1] / 50, rotation_target_vector)
    var horizontal_rotation = yRotationMatrix(update.rotation[0] / 50, rotation_target_vector)
    var combined_rotation_matrix = multiply4(horizontal_rotation, vertical_rotation)
    //apply combined_rotation_matrix to storedCameraPosition vector
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
