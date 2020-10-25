"use strict"
//precision mediump float -> determines precision of math inside the shader: medium ==
//vec2, vec3, vec4 -> vector of x elements
// gl_Position = vec4(vertexPosition, 0.0, 1.0) -> gives position of as a 4-vector
// vertexPosition already has 2 elements, so combine those 2 existing elements with
// 0.0, and 1.0
var vertexShaderText = `
  precision mediump float;
  attribute vec2 vertexPosition;
  void main() {
    gl_Position = vec4(vertexPosition, 0.0, 1.0);
  }
`
//fl_FragColor = vec4(1.0, 0.0, 0.0, 1.0) = fully non-transparent red
var fragmentShaderText = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`

var angle = 0
var translation = [0,0]
window.addEventListener("keydown", function(event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (event.key) {
    case "ArrowDown":
      translation[1] -= 0.01
      break;
    case "ArrowUp":
      translation[1] += 0.01
      break;
    case "ArrowRight":
      translation[0] += 0.01
      break;
    case "ArrowLeft":
      translation[0] -= 0.01
      break;
    case "PageDown":
      angle += 1
      console.log("pressing pagedown!")
      break;
    case "PageUp":
      angle -= 1
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true)

function updateBufferData(canvasContext, vertices, buffer) {
  canvasContext.bindBuffer(
    canvasContext.ARRAY_BUFFER,
    buffer
  )
  //Note: Javascript numbers are always 64 bit float precision numbers, so we need to converte
  //to 32 bit floats
  canvasContext.bufferData(
    canvasContext.ARRAY_BUFFER,
    new Float32Array(vertices),
    canvasContext.STATIC_DRAW
  )
}


function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  var success = gl.getProgramParameter(program, gl.LINK_STATUS)

  if (success) {
    return program;
  } else {
    console.error("ERROR COMPILING PROGRAM!", gl.getShaderInfoLog(program))
    gl.program(program)
  }
}

function createShader(gl, type, source) {
  var shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader;
  } else {
    console.error("ERROR COMPILING SHADER!", gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
  }
}

var initDemo = function() {

  var canvas = document.getElementById('glCanvas');
  const gl = canvas.getContext("webgl");

  //get WebGl ready to use shaders
  //create a shader using WebGL api
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText)
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText)

  //now that we've compiled & checked compile shader status, we need to create a
  //webgl program
  var program = createProgram(gl, vertexShader, fragmentShader)

  //Normal RAM variable that we'll supply to the graphics card program
  //We need to supply this RAM into a graphics card buffer memory
  // Now we need to add color to our vertices

  var vertexBufferObject = gl.createBuffer()
  function randomPoint() {
    return [(Math.random(2)*2)-1, (Math.random(2)*2)-1]
  }
  var point = new Array(10).fill(0).map(randomPoint).flat()



  updateBufferData(gl, point, vertexBufferObject)



  //so now we've provided the shader with vertex information, but we need to inform it how to handle it.
  //Get the attribute location of the 'vertexPosition' attribute from the program
  var positionAttributeLocation = gl.getAttribLocation(program, 'vertexPosition')

  //positionAttributeLocation is going to be some number

  //Now we need to specify the layout of that attribute:
  //6 parameters:
  // 1: location of the attribute
  // 2: number of elements per attribute (remember this matches to "attribute vec2 vertexPosition")
  // 3: The Type of the elements
  // 4: gl.FALSE - don't worry about this for now
  // 5: size of an individual vertex in number of bytes
  // 6: offset from the beginning of a single vertex to this attribute


  //Tell webgl about the color of the vertex
  gl.vertexAttribPointer(
    positionAttributeLocation, //attribute location
    2, //number of elements per attribute
    gl.FLOAT, //Type of elements
    gl.FALSE,
    0, // size of an individual vertex in bytes (5 * (number of bytes per float)
    0 // offset from the beginning of a single vertex to this attribute
  )

  // gl.vertexAttribPointer(
  //   colorAttributeLocation, //attribute location
  //   3, //number of elements per attribute
  //   gl.FLOAT, //Type of elements
  //   gl.FALSE,
  //   5 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex in bytes (5 * (number of bytes per float)
  //   2 * Float32Array.BYTES_PER_ELEMENT // offset from the bigining of a single vertex to this attribute
  // )

  gl.enableVertexAttribArray(positionAttributeLocation)

  gl.useProgram(program)

  //Note this uses whatever active buffer we have at the moment.


  var loop = function() {
    //note: not a good idea to create variables inside loop due to memory
    //allocation concerns

    updateBufferData(gl, point, vertexBufferObject)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.drawArrays(gl.POINTS, 0, 10)

    requestAnimationFrame(loop)
  }

  //Note: requestAnimationFrame(func) will run func argument
  // whenever the screen is ready to draw a new image (60x/second)
  //Also, won't call function when tab isn't in focus, which is neat
  //if tab is backgrounded.
  requestAnimationFrame(loop);
}

export { initDemo }
