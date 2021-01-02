'use strict'
import { RotationUpdate } from "../mouse_input.js"


class CameraState {
  constructor() {
    this.focalTarget = [0.0, 0.0, 0.0]
    this.existingFocalTarget = [0.0, 0.0, 0.0]

    this.cameraPosition = [0.0, 0.0, 0.0]
    this.existingCameraPosition = [0.0, 0.0, -300.0]
  }

  zeroAndSave() {
    this.existingCameraPosition = this.getCameraPosition()
    this.existingFocalTarget = this.getFocalTarget()

    this.focalTarget = [0,0,0]
    this.cameraPosition = [0,0,0]
  }


  updateFromTranslationEvent(update, event) {
    //need to:
    // 1- move the camera in the x-z plane
    //    a. correct the z-movement by the cos(theta) of the current x-axis (vertical)
    //       rotation
    // 2- move the focal target the same amount in the x-z plane

    this.focalTarget[0] = update.translation[0]
    //todo: scale this by current vertical rotation
    this.focalTarget[2] = update.translation[1]

    this.cameraPosition[0] = update.translation[0]
    //todo: scale this by current vertical rotation
    this.cameraPosition[2] = update.translation[1]
  }

  updateFromEvent(update, event) {
    this.updateFromTranslationEvent(update, event)
  }

  getFocalTarget() {
    return this.focalTarget.map((item, index) => {
      return item + this.existingFocalTarget[index]
    })
  }

  getCameraPosition() {
    return this.cameraPosition.map((item, index) => {
      return item + this.existingCameraPosition[index]
    })
  }
}

export { CameraState }
