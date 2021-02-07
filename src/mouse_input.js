"use strict"

//todo: Refactor this to use inheritance & cover with unit tests
class DefaultHandler {
  constructor(state, canvas) {
    this.state = state
    this.canvas = canvas
    this.outputNode = null
  }

  handleEvent(event) {
    if (this.outputNode === null) {
      var update = new Update(event)
      this.state.updateFromEvent(update, event)
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
    //This is a hack
    this.origin = null
  }

  handleEvent(update) {
    if (this.outputNode === null) {
      var update = new TranslationUpdate(event)
      this.state.updateFromEvent(update)
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
      var update = new RotationUpdate(event)
      this.state.updateFromEvent(update)
    } else {
      return this.outputNode.handleEvent(event)
    }
  }
}

class TranslationUpdate {
  constructor(event) {
    //we want to move in horizontal plane, so remap our Y mouse input to z-axis
    //movement in world
    this.translation = [event.movementX, 0.0, event.movementY]
    this.rotation = [0.0, 0.0, 0.0]
  }
}

class RotationUpdate {
  constructor(event) {
    this.translation = [0.0, 0.0, 0.0]

    this.rotation = [event.movementX, event.movementY, 0.0]
  }
}

class Update {
  constructor(event) {
    this.translation = [0.0, 0.0, 0.0]
    this.rotation = [0.0, 0.0, 0.0]
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
    this.canvas.onmousedown = (event) => {
      this.translationHandler.origin = [event.clientX, event.clientY, 0.0]
      this.rotationHandler.origin = [event.clientX, event.clientY, 0.0]
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
      this.handleEvent(event)
    }
  }

  handleEvent(event) {
    this.defaultHandler.handleEvent(event)
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
}


function initMouseHandlers(state) {
  var canvas = document.getElementById('glCanvas');
  const inputHandler = new InputHandler(state, canvas)
}

export { initMouseHandlers, RotationUpdate, TranslationUpdate}
