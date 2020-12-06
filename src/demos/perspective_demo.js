"use strict"
//precision mediump float -> determines precision of math inside the shader: medium ==
//vec2, vec3, vec4 -> vector of x elements
// gl_Position = vec4(vertexPosition, 0.0, 1.0) -> gives position of as a 4-vector
// vertexPosition already has 2 elements, so combine those 2 existing elements with
// 0.0, and 1.0
import { multiply4, translationMatrix, perspectiveMatrix, xRotate, yRotate, zRotate, translate } from "../matrices.js"
import { Line } from "../line.js"
import { Cube } from "../cube.js"


var initDemo = function(state) {

  var canvas = document.getElementById('glCanvas');
  const gl = canvas.getContext("webgl");

  var cube = new Cube([], canvas, gl)
  var translationValue = []

  var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
  var fieldOfViewInRadians = 1
  var zNear = 1
  var zFar = 2000
  var perspective = perspectiveMatrix(fieldOfViewInRadians, aspect, zNear, zFar)


  var loop = function() {

    //obtain the current state & generate a view update matrix from it
    var translationValues = state.getTranslation()
    var rotationValues = state.getRotation()
    var translation = translationMatrix(translationValues[0], translationValues[1], 0)
    var matrix = xRotate(translation, rotationValues[1] - 0.5)
    matrix = yRotate(matrix, rotationValues[0] + 0.5)
    matrix = zRotate(matrix, 0)



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
