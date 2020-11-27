"use strict"
//precision mediump float -> determines precision of math inside the shader: medium ==
//vec2, vec3, vec4 -> vector of x elements
// gl_Position = vec4(vertexPosition, 0.0, 1.0) -> gives position of as a 4-vector
// vertexPosition already has 2 elements, so combine those 2 existing elements with
// 0.0, and 1.0
import { multiply4, zRotation, yRotation, xRotation, translationMatrix } from "../matrices.js"
import { Line } from "../line.js"
import { Cube } from "../cube.js"


var initDemo = function(state) {

  var canvas = document.getElementById('glCanvas');
  const gl = canvas.getContext("webgl");

  var cube = new Cube([], canvas, gl)

  var loop = function() {

    //obtain the current state & generate a view update matrix from it
    var translation = translationMatrix(state.translation[0], state.translation[1], 0)
    var z_rotate = zRotation(state.rotation)
    var y_rotate = yRotation(0)
    var x_rotate = xRotation(state.rotation)
    var matrix = multiply4(x_rotate, y_rotate)
    matrix = multiply4(matrix, z_rotate)

    matrix = multiply4(translation, matrix)

    //clear the current drawing & redraw our objects
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST)
    //NOTE: Lines need at least 2 points you jabranus\
    cube.draw(matrix)
    // box.draw(matrix)
    requestAnimationFrame(loop)
  }

  //Note: requestAnimationFrame(func) will run func argument
  // whenever the screen is ready to draw a new image (60x/second)
  //Also, won't call function when tab isn't in focus, which is neat
  //if tab is backgrounded.
  requestAnimationFrame(loop);
}

export { initDemo }
