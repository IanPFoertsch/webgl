'use strict'
import { RotationUpdate, TranslationUpdate } from "../mouse_input.js"
import {
  xAxisRotationAroundPoint,
  subtractVectors
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

  updateFromRotationEvent(update, event) {
    //rotate the stored camera position by our input event
    var verticalRotation = xAxisRotationAroundPoint(this.storedCameraPosition, update.rotation[1], this.focalTarget)
    // multiply vertical & horizontal rotation matrices? -> i thiiiink
    //take the differential between the rotated position and the stored camera position
    var differential = subtractVectors(verticalRotation, this.storedCameraPosition)
    //That differential becomes the active camera position
    this.activeCameraPosition = differential
    // console.log("ending camera position: ", JSON.stringify(this.getCameraPosition()))
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
