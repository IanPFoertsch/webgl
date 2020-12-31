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
  xRotate,
  yRotate,
  zRotate,
  translate,
  inverse,
  yRotation
} from "../matrices.js"
import { Line } from "../line.js"
import { Cube } from "../cube.js"


var initDemo = function(state) {

  var canvas = document.getElementById('glCanvas');
  const gl = canvas.getContext("webgl");

  var cube = new Cube([0, 0, 0], [], canvas, gl)
  var translationValue = []

  var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
  var fieldOfViewInRadians = 1.5
  var zNear = 1
  var zFar = 2000

  // var matrix = projectionMatrix(gl.canvas.clientWidth, gl.canvas.clientHeight, gl.canvas.clientWidth)
  var loop = function() {
    var perspective = perspectiveMatrix(fieldOfViewInRadians, aspect, zNear, zFar)

    var cameraMatrix = yRotation(state.getRotation()[0])
    cameraMatrix = translate(cameraMatrix, 0, 0, 200)
    var viewMatrix = inverse(cameraMatrix)
    var viewProjectionMatrix = multiply4(perspective, viewMatrix)
    //obtain the current state & generate a view update matrix from it


    // var rotationValues = state.getRotation()

    var matrix = viewProjectionMatrix
    // matrix = zRotate(matrix, rotationValues[1], rotationValues[0])

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
