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

class MouseUpEventHandler {
  constructor(state, canvas) {
    this.state = state
    this.canvas = canvas
  }

  handleEvent() {
    this.state.existingTranslation = [
      this.state.translation[0],
      this.state.translation[1]
    ]
  }
}

class ViewUpdate {
  constructor() {
    this.translation = [0.0,0.0]
  }
}

class MouseMoveInputHandler {
  //TODO: I don't think we need access to the canvas
  constructor(state, canvas) {
    this.state = state
    this.canvas = canvas
  }

  handleEvent(event, update) {
    //TODO: WE should be able to not store the mousedown origin on the actual state,
    //but rather in something we add to the stack
    var normalizedX = (event.clientX - this.state.origin[0]) / this.canvas.width
    //Note: The events have an inverted Y axis, so we subtract the event's Y coordinate
    //rather than add it
    var normalizedY = (this.state.origin[1] - event.clientY) / this.canvas.height

    update.translation = [
      normalizedX,
      normalizedY
    ]
    return update
  }
}

class InputHandler {
  constructor(state, canvas) {
    this.state = state
    this.canvas = canvas
    this.queue = []
    this.registerDefaultHandlers()
  }

  registerDefaultHandlers() {
    //NOTE: There must be a better way to do this: binding the handler's mousedown function
    // directly wipes away references to "this", meaning we can't update the state,
    // so we wrap it in an intermediate anonymouse function
    //NOTE: replace this with document event listeners document.addEventListener("mousedown", event => {...})
    this.canvas.onmousedown = (event) => {
      this.handleEvent(event)
    }
    this.canvas.onmouseup = (event) => {
      this.handleEvent(event)
    }
    document.addEventListener("keydown", event => {
      this.handleEvent(event)
    })
    document.addEventListener("keyup", event => {
      this.handleEvent(event)
    })

    this.canvas.onmousemove = (event) => {
      var update = this.handleMouseMoveInput(event)
      this.stateUpdate(update)
    }
  }

  handleMouseMoveInput(event) {
    var stateUpdate = this.queue.reduce((oldUpdate, handler) => {
      var newUpdate = handler.handleEvent(event, oldUpdate)
      return newUpdate
    }, new ViewUpdate())
    return stateUpdate
  }

  handleEvent(event) {
    switch(event.type) {
      case "mousedown":
        new MouseDownEventHandler(this.state, this.canvas).handleEvent(event)
        this.queue.push(new MouseMoveInputHandler(this.state, this.canvas))
        break
      case "mouseup":
        new MouseUpEventHandler(this.state, this.canvas).handleEvent(event)
        this.queue = []
        break
      case "mousemove":
        break
      case "keydown":
        console.log("keydown!")
        break
      case "keyup":
        console.log("keyup!")
        break
      default:

        break
    }
  }

  stateUpdate(update) {
    this.state.translation[0] = update.translation[0] + this.state.existingTranslation[0]
    this.state.translation[1] = update.translation[1] + this.state.existingTranslation[1]
  }
}


function initMouseHandlers(state) {
  var canvas = document.getElementById('glCanvas');
  const inputHandler = new InputHandler(state, canvas)
}

export { initMouseHandlers }
