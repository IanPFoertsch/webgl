"use strict"
import { initDemo } from '../src/demos/perspective_demo.js'
import { initMouseHandlers } from './mouse_input.js'
import { State } from '../src/state/state.js'
function setup() {
  var state =  new State()
  initDemo(state)
  initMouseHandlers(state)
}

window.onload = setup;
