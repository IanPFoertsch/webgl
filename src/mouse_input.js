"use strict"

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
    this.rotation = 0.0
  }
  // get translation() {
  //   return this.translation
  // }
  // set translation(newTranslation) {
  //   this.translation = newTranslation
  // }
}

class MouseMoveInputHandler {
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

class ControlDownInputHandler {
  //ControlDown accepts an existing update and transforms it to rotational update
  // data
  constructor(state, canvas) {
    this.state = state
    this.canvas = canvas
  }

  handleEvent(event, update) {
    update.rotation = update.translation[0]
    update.translation[0] = 0.0
    update.translation[1] = 0.0
    return update
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
    var stateUpdate = this.stack.reduce((oldUpdate, handler) => {
      var newUpdate = handler.handleEvent(event, oldUpdate)
      return newUpdate
    }, new ViewUpdate())
    return stateUpdate
  }

  handleKeyDownInput(event) {
    switch(event.key) {
      case "Control":
        if (this.stack.length === 0) {
          this.stack.unshift(new ControlDownInputHandler())
        }
        // Otherwise Don't add a handler to the stack
        // because another handler is already active
        break
      default:
        break
    }
  }

  handleKeyUpInput(event) {
    switch(event.key) {
      case "Control":
        if (this.stack[this.stack.length - 1] instanceof ControlDownInputHandler) {
          //if the top of the stack is a ControlDownInputHandler
          this.stack.pop()
        }
        // Otherwise Don't add a handler to the stack
        // because another handler is already active
        break
      default:
        break
    }
  }

  handleEvent(event) {
    switch(event.type) {
      case "mousedown":
        new MouseDownEventHandler(this.state, this.canvas).handleEvent(event)
        this.stack.unshift(new MouseMoveInputHandler(this.state, this.canvas))
        break
      case "mouseup":
        new MouseUpEventHandler(this.state, this.canvas).handleEvent(event)
        this.stack = []
        break
      case "mousemove":
        break
      case "keydown":
        this.handleKeyDownInput(event)
        break
      case "keyup":
        this.handleKeyUpInput(event)
        break
      default:
        break
    }
  }

  stateUpdate(update) {
    this.state.translation[0] = update.translation[0] + this.state.existingTranslation[0]
    this.state.translation[1] = update.translation[1] + this.state.existingTranslation[1]
    this.state.rotation = update.rotation * 5
  }
}


function initMouseHandlers(state) {
  var canvas = document.getElementById('glCanvas');
  const inputHandler = new InputHandler(state, canvas)
}

export { initMouseHandlers }
