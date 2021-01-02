'use strict'

import { CameraState } from "./camera_state.js"

class State {
  constructor() {
    this.translation =  [0.0, 0.0, 0.0]
    this.existingTranslation = [0.0, 0.0, 0.0]
    this.rotation = [0.0, 0.0, 0.0]
    this.existingRotation = [0.0, 0.0, 0.0]

    this.cameraState = new CameraState()
  }


  zeroAndSave() {
    this.existingRotation = this.getRotation()
    this.existingTranslation = this.getTranslation()

    this.rotation = [0,0,0]
    this.translation = [0,0,0]
    this.cameraState.zeroAndSave()
  }

  updateFromEvent(update, event) {
    //Don't need to add existing translation here
    this.translation[0] = update.translation[0]
    this.translation[1] = update.translation[1]

    this.rotation[0] = update.rotation[0] / 10
    this.rotation[1] = update.rotation[1] / 10

    this.cameraState.updateFromEvent(update, event)
  }

  getTranslation() {
    //this translation & existing translation is starting to feel overly complicated
    return this.translation.map((item, index) => {
      return item + this.existingTranslation[index]
    })
  }

  getRotation() {
    return this.rotation.map((item, index) => {
      return item + this.existingRotation[index]
    })
  }

  getFocalTarget() {
    return this.cameraState.getFocalTarget()
  }

  getCameraPosition() {
    return this.cameraState.getCameraPosition()
  }
}

export { State }
