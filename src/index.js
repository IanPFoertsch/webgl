"use strict"
import { initDemo } from './points.js'
import { initMouseHandlers } from './mouse_input.js'
function setup() {
  var state = {
    translation: [0.0, 0.0],
    existingTranslation: [0.0, 0,0]
  }
  initDemo(state)
  initMouseHandlers(state)
}

window.onload = setup;
