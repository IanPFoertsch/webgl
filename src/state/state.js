'use strict'

import { CameraState } from "./camera_state.js"
import { RotationUpdate } from "../mouse_input.js"

class State {
  constructor() {
    this.cameraState = new CameraState()
  }


  zeroAndSave() {
    this.cameraState.zeroAndSave()
  }

  updateFromEvent(update, event) {
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
