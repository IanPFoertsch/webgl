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

    var cameraMatrix = yRotate(identityMatrix(), state.getRotation()[0])
    cameraMatrix = xRotate(cameraMatrix, state.getRotation()[1])
    translationValue = state.getTranslation()


    //NOTE: About the y-value translation we're applying here. This is complicated because of the
    // transformation between the camera and the world space. We're inverting the view to
    // move the "world" in front of the camera, rather than moving the camera around.
    //This when we move the camera in the z-plane, it basically zooms in and out, rather than moving linearly in Z,
    //Because we're literally moving a tilted viewport along z.
    // Therefore, when we want to move along a constant "horizontal" x-z plane, we need to apply
    // a y-component to the translation vector, to move vertically up and down to compensate.
    // this y-vector can be derived from our current y-rotation, basically at high y-rotation, we want a large
    // y-vector component, and vice versa at small y-rotation.
    // This is computed simply with Sin(y-rotation)
    // If I had a more advanced understanding of how our view is calculated, we could probably simplify this massively.
    cameraMatrix = translate(cameraMatrix, - translationValue[0], translationValue[1] * Math.sin( - state.getRotation()[1]),  - translationValue[1] +  200)
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
