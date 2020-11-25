'use strict'


class State {
  constructor() {
    this.translation =  [0.0, 0.0]
    this.existingTranslation = [0.0, 0.0]
    this.rotation = 0
    this.existingRotation = 0
    this.inputState = {}
  }
}

export { State }
