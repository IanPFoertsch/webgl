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
      var update = new TranslationUpdate(event, this.origin)
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
      var update = new RotationUpdate(event, this.origin)
      this.state.updateFromEvent(update)
    } else {
      return this.outputNode.handleEvent(event)
    }
  }
}

class TranslationUpdate {
  constructor(event, origin) {
    //need access to origin somehow
    //TODO: WE should be able to not store the mousedown origin on the actual state. This is hamhanded
    //TODO: just dividing by the hardcoded height/width of the canvas here. This is bad - > we should find some way to derive this
    var normalizedX = (event.clientX - origin[0])

    //Note: The events have an inverted Y axis, because the top of the canvas is considered y = 0
    // with Y increasing as it goes down the canvas
    //so we subtract the event's Y coordinate rather than add it
    var normalizedY = (origin[1] - event.clientY )

    this.translation = [normalizedX, normalizedY, 0.0]
    this.rotation = [0.0, 0.0, 0.0]
  }
}

class RotationUpdate {
  constructor(event, origin) {
    // I'm not,like...100% sure why we need to invert the normalizedX value here...
    // something to do with how we're rotating around
    // the y-axis when we're rotating the x-coordinate plane.
    var normalizedX = (origin[0] - event.clientX) / 10
    //Note: The events have an inverted Y axis, so we subtract the event's Y coordinate
    //rather than add it
    var normalizedY = (origin[1] - event.clientY) / 10
    this.translation = [0.0, 0.0, 0.0]

    this.rotation = [normalizedX, normalizedY, 0.0]
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
      this.state.zeroAndSave()
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

export { initMouseHandlers, RotationUpdate }
