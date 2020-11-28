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

class DefaultHandler {
  constructor(state, canvas) {
    this.state = state
    this.canvas = canvas
    this.outputNode = null
  }

  handleEvent(event) {
    if (this.outputNode === null) {
      return new Update(event)
    } else {
      return this.outputNode.handleEvent(event)
    }
  }
}

class TranslationHandler {
  constructor(state, canvas) {
    this.state = state
    this.canvas = canvas
    this.outputNode = null
  }

  handleEvent(update) {
    if (this.outputNode === null) {
      return new TranslationUpdate(event)
    } else {
      return this.outputNode.handleEvent(event)
    }
  }
}

class RotationHandler {
  constructor(state, canvas) {
    this.state = state
    this.canvas = canvas
    this.outputNode = null
  }

  handleEvent(update) {
    if (this.outputNode === null) {
      return new RotationUpdate (event)
    } else {
      return this.outputNode.handleEvent(event)
    }
  }
}

class TranslationUpdate {
  constructor(event) {
    this.x = event.clientX
    this.y = event.clientY
    this.translation = [event.clientX, event.clientY, 0.0]
    this.rotation = [0.0, 0.0, 0.0]
  }
}

class RotationUpdate {
  constructor(event) {
    this.x = event.clientX
    this.y = event.clientY
    this.translation = [0.0, 0.0, 0.0]
    this.rotation = [event.clientX, event.clientY, 0.0]
  }
}

class Update {
  constructor(event) {
    this.x = event.clientX
    this.y = event.clientY
    this.translation = [0.0, 0.0, 0.0]
    this.rotation = [0.0, 0.0, 0.0]
  }
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
    this.defaultHandler = new DefaultHandler(state, canvas)
    this.translationHandler = new TranslationHandler(state, canvas)
    this.rotationHandler = new RotationHandler(state, canvas)
    this.registerDefaultHandlers()
  }

  registerDefaultHandlers() {
    //NOTE: There must be a better way to do this: binding the handler's mousedown function
    // directly wipes away references to "this", meaning we can't update the state,
    // so we wrap it in an intermediate anonymouse function
    //NOTE: replace this with document event listeners document.addEventListener("mousedown", event => {...})
    this.canvas.onmousedown = (event) => {
      this.state.origin = [event.clientX, event.clientY, 0.0]
      this.defaultHandler.outputNode = this.translationHandler
    }
    this.canvas.onmouseup = (event) => {
      this.defaultHandler.outputNode = null
    }
    document.addEventListener("keydown", event => {
      this.handleKeyDownInput(event)
    })
    document.addEventListener("keyup", event => {
      this.handleKeyUpInput(event)
    })
    this.canvas.onmousemove = (event) => {
      var update = this.handleMouseMoveInput(event)
      this.stateUpdate(update)
    }
  }

  handleMouseMoveInput(event) {

    var update = this.defaultHandler.handleEvent(event)
    // var stateUpdate = this.stack.reduce((oldUpdate, handler) => {
    //   var newUpdate = handler.handleEvent(event, oldUpdate)
    //   return newUpdate
    // }, new Update())
    // return stateUpdate
    return update
  }

  handleKeyDownInput(event) {
    switch(event.key) {
      case "Control":
        this.translationHandler.outputNode = this.rotationHandler
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
        this.translationHandler.outputNode = null
        // Otherwise Don't add a handler to the stack
        // because another handler is already active
        break
      default:
        break
    }
  }

  stateUpdate(update) {

    //TODO: WE should be able to not store the mousedown origin on the actual state,
    //but rather in something we add to the stack

    var normalizedX = (update.translation[0] - this.state.origin[0]) / this.canvas.width
    //Note: The events have an inverted Y axis, so we subtract the event's Y coordinate
    //rather than add it
    var normalizedY = (this.state.origin[1] - update.translation[1]) / this.canvas.height

    this.state.translation[0] = normalizedX + this.state.existingTranslation[0]
    this.state.translation[1] = normalizedY + this.state.existingTranslation[1]

    this.state.rotation[1] = update.rotation[1] / 10
  }
}


function initMouseHandlers(state) {
  var canvas = document.getElementById('glCanvas');
  const inputHandler = new InputHandler(state, canvas)
}

export { initMouseHandlers }
