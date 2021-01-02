"use strict"
//precision mediump float -> determines precision of math inside the shader: medium ==
//vec2, vec3, vec4 -> vector of x elements
// gl_Position = vec4(vertexPosition, 0.0, 1.0) -> gives position of as a 4-vector
// vertexPosition already has 2 elements, so combine those 2 existing elements with
// 0.0, and 1.0
import {
  multiply4,
  translationMatrix,
  projectionMatrix,
  perspectiveMatrix,
  identityMatrix,
  xRotate,
  yRotate,
  zRotate,
  translate,
  inverse,
  yRotation
} from "../matrices.js"
import { Line } from "../line.js"
import { Cube } from "../cube.js"
import { ViewMatrixManager } from "../view_matrix_manager.js"


var initDemo = function(state) {

  var canvas = document.getElementById('glCanvas');
  const gl = canvas.getContext("webgl");

  var cube = new Cube([0, 0, 0], [], canvas, gl)
  var otherCube = new Cube([50, 50, 50], [], canvas, gl)
  var thirdCube = new Cube([-55, 15, 50], [], canvas, gl)
  var viewMatrixManager = new ViewMatrixManager(canvas, gl, state)

  var matrix = []
  var loop = function() {

    matrix = viewMatrixManager.getUpdatedViewMatrix()
    // matrix = zRotate(matrix, rotationValues[1], rotationValues[0])

    //clear the current drawing & redraw our objects
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST)
    
    cube.draw(matrix)
    otherCube.draw(matrix)
    thirdCube.draw(matrix)
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
