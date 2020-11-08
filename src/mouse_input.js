"use strict"


class MouseHandler {
  constructor(state, canvas) {
    this.state = state
    this.canvas = canvas
    this.registerDefaultHandlers()
  }

  registerDefaultHandlers() {
    //NOTE: There must be a better way to do this: binding the handler's mousedown function
    // directly wipes away references to "this", meaning we can't update the state,
    // so we wrap it in an intermediate anonymouse function
    this.canvas.onmousedown = (event) => {this.mouseDown(event)}
    this.canvas.onmouseup = (event) => {this.mouseUp(event)}
  }

  mouseMove(event) {
    var normalizedX = (event.clientX - this.state.origin[0]) / this.canvas.width
    //Note: The events have an inverted Y axis, so we subtract the event's Y coordinate
    //rather than add it
    var normalizedY = (this.state.origin[1] - event.clientY) / this.canvas.height

    this.state.translation = [
      normalizedX + this.state.existingTranslation[0],
      normalizedY + this.state.existingTranslation[1]]
  }

  mouseDown(event) {
    this.state.origin = [event.clientX, event.clientY]
    this.canvas.onmousemove = (moveEvent) => {this.mouseMove(moveEvent)}
  }

  mouseUp(event) {
    this.state.origin = null
    this.canvas.onmousemove = null
    this.state.existingTranslation = [
      this.state.translation[0],
      this.state.translation[1]
    ]
  }
}


function initMouseHandlers(state) {
  var canvas = document.getElementById('glCanvas');
  const handler = new MouseHandler(state, canvas)
}

export { initMouseHandlers }
