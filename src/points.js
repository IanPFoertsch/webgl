"use strict"
//precision mediump float -> determines precision of math inside the shader: medium ==
//vec2, vec3, vec4 -> vector of x elements
// gl_Position = vec4(vertexPosition, 0.0, 1.0) -> gives position of as a 4-vector
// vertexPosition already has 2 elements, so combine those 2 existing elements with
// 0.0, and 1.0
import { multiply4, rotationMatrix, translationMatrix } from "../src/matrices.js"
import { Line } from "./line.js"
import { Box } from "./box.js"
import { Triangle } from "./triangle.js"


var initDemo = function(state) {

  var canvas = document.getElementById('glCanvas');
  const gl = canvas.getContext("webgl");

  var box = new Box([], canvas, gl)
  var triangle = new Triangle([], canvas, gl)

  var loop = function() {
    //obtain the current state & generate a view update matrix from it
    var translation = translationMatrix(state.translation[0], state.translation[1])
    var rotation = rotationMatrix(state.rotation)
    var matrix = multiply4(translation, rotation)

    //clear the current drawing & redraw our objects
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    //NOTE: Lines need at least 2 points you jabranus\

    // a_line.draw(matrix)
    // b_line.draw(matrix)
    // c_line.draw(matrix)
    // d_line.draw(matrix)
    // console.log(loop)
    box.draw(matrix)
    requestAnimationFrame(loop)
  }

  //Note: requestAnimationFrame(func) will run func argument
  // whenever the screen is ready to draw a new image (60x/second)
  //Also, won't call function when tab isn't in focus, which is neat
  //if tab is backgrounded.
  requestAnimationFrame(loop);
}

export { initDemo }
