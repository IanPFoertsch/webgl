"use strict"

function detectInput(window) {
  window.addEventListener("keydown", function(event) {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }

    switch (event.key) {
      case "ArrowDown":
        console.log("ArrowDown")
        break;
      case "ArrowUp":
        console.log("ArrowUp")
        break;
      case "ArrowLeft":
        console.log("ARROW LEFT")
        break;
      case "ArrowRight":
        console.log("ARROWRIGHT")
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }

    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
  }, true)

}

export { detectInput }
