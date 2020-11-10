"use strict"

var handleKeyboardInput = function(state, event) {
  console.log(event)
  if (event.key === "Control") {
    console.log(event)
    // state.inputState["Control"] = true
    // this.canvas.onmousedown = (event) => {
    //   this.state.origin = [event.clientX, event.clientY]
    //   this.canvas.onmousemove = (event) => {
    //       var normalizedRotation = (event.clientX - this.state.origin[0]) / this.canvas.width
    //       this.state.rotation = normalizedRotation
    //   }
    // }

    // this.canvas.onmouseup = (event) => {
      // state.inputState["Control"] = false
      //need to de-register existing onmousemove handler, re-register defaults
      // this.canvas.onmousemove = null
      //but also save the existing translation
      // this.rotationHandler(event)
    // }
  }
}

class MouseDownEventHandler {
  constructor(state, canvas) {
    this.state = state
    this.canvas = canvas
  }

  handleEvent(event) {
    this.state.origin = [event.clientX, event.clientY]
  }
}

class TranslationController {
  //TODO: I don't think we need access to the canvas
  constructor(state, canvas) {
    this.state = state
    this.canvas = canvas
  }

  handleEvent(event) {
    console.log("handling", this.state)
    var normalizedX = (event.clientX - this.state.origin[0]) / this.canvas.width
    //Note: The events have an inverted Y axis, so we subtract the event's Y coordinate
    //rather than add it
    var normalizedY = (this.state.origin[1] - event.clientY) / this.canvas.height

    this.state.translation = [
      normalizedX + this.state.existingTranslation[0],
      normalizedY + this.state.existingTranslation[1]]
  }
}

class InputHandler {
  constructor(state, canvas) {
    this.state = state
    this.canvas = canvas
    this.stack = []
    this.registerDefaultHandlers()
  }

  registerDefaultHandlers() {
    //NOTE: There must be a better way to do this: binding the handler's mousedown function
    // directly wipes away references to "this", meaning we can't update the state,
    // so we wrap it in an intermediate anonymouse function
    //NOTE: replace this with document event listeners document.addEventListener("mousedown", event => {...})
    this.canvas.onmousedown = (event) => {
      new MouseDownEventHandler(this.state, this.canvas).handleEvent(event)
      this.stack.push(new TranslationController(this.state, this.canvas))
    }
    this.canvas.onmouseup = (event) => {
      this.stack.pop()
      this.handleEvent(event)
    }
    this.canvas.onmousemove = (event) => {
      this.handleEvent(event)
    }



    // document.addEventListener("keydown", event => {
    //   handleKeyboardInput(this.state, event)
    // })
    //
    // document.addEventListener("keyup", event => {
    //   // if (event.key === "Control") {
    //   //   this.canvas.onmousedown = (event) => {this.mouseDown(event)}
    //   // }
    //   console.log("key up")
    //   handleKeyboardInput(this.state, event)
    // })
  }

  handleEvent(event) {
    if (this.stack.length === 0) {
      return
    } else {
      this.stack[this.stack.length - 1].handleEvent(event)
    }
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
  console.log('iniitializing', state)
  const inputHandler = new InputHandler(state, canvas)
}

export { initMouseHandlers }
