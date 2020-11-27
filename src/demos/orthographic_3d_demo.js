"use strict"
//precision mediump float -> determines precision of math inside the shader: medium ==
//vec2, vec3, vec4 -> vector of x elements
// gl_Position = vec4(vertexPosition, 0.0, 1.0) -> gives position of as a 4-vector
// vertexPosition already has 2 elements, so combine those 2 existing elements with
// 0.0, and 1.0
import { multiply4, zRotation, translationMatrix } from "../src/matrices.js"
import { Line } from "./line.js"
import { Tree } from "./tree.js"


var initDemo = function(state) {

  var canvas = document.getElementById('glCanvas');
  const gl = canvas.getContext("webgl");

  var tree = new Tree({origin: [0.0,-0.5], length: 0.5, angle: 1.57, propagate:6, angle_variance: 0.4, length_decay: 1.7})
  var vertices = tree.vertices()
  var lines = []
  for (var i = 0; i < vertices.length; i += 4 ) {
    lines.push(new Line(vertices.slice(i, i + 4), canvas, gl))
  }

  var loop = function() {

    //obtain the current state & generate a view update matrix from it
    var translation = translationMatrix(state.translation[0], state.translation[1], 0)
    var rotation = zRotation(state.rotation)
    var matrix = multiply4(translation, rotation)

    //clear the current drawing & redraw our objects
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    //NOTE: Lines need at least 2 points you jabranus\
    // line.draw(matrix)
    lines.forEach((line) => { line.draw(matrix) })
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
