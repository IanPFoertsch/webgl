"use strict"
import { initDemo } from '../src/demos/orthographic_3d_demo.js'
import { initMouseHandlers } from './mouse_input.js'
import { State } from './state.js'
function setup() {
  var state =  new State()
  initDemo(state)
  initMouseHandlers(state)
}

window.onload = setup;
