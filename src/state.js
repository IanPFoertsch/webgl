'use strict'


import { RotationUpdate } from "./mouse_input.js"

class State {
  constructor() {
    this.translation =  [0.0, 0.0, 0.0]
    this.existingTranslation = [0.0, 0.0, 0.0]
    this.rotation = [0.0, 0.0, 0.0]
    this.existingRotation = [0.0, 0.0, 0.0]
    this.inputState = {}

  }

  zeroAndSave() {
    this.existingRotation = this.getRotation()
    this.existingTranslation = this.getTranslation()

    this.rotation = [0,0,0]
    this.translation = [0,0,0]
  }

  updateFromEvent(update, event) {
    //Don't need to add existing translation here
    this.translation[0] = update.translation[0]
    this.translation[1] = update.translation[1]
    this.rotation[0] = update.rotation[0] / 10
    this.rotation[1] = update.rotation[1] / 10
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
}

export { State }
