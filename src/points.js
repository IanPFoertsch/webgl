"use strict"
//precision mediump float -> determines precision of math inside the shader: medium ==
//vec2, vec3, vec4 -> vector of x elements
// gl_Position = vec4(vertexPosition, 0.0, 1.0) -> gives position of as a 4-vector
// vertexPosition already has 2 elements, so combine those 2 existing elements with
// 0.0, and 1.0
var vertexShaderText = `
  precision mediump float;
  attribute vec2 vertexPosition;
  uniform vec2 u_translation;

  void main() {
    gl_Position = vec4(vertexPosition + u_translation, 0.0, 1.0);
  }
`
//fl_FragColor = vec4(1.0, 0.0, 0.0, 1.0) = fully non-transparent red
var fragmentShaderText = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`

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



var initDemo = function(state) {

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

  var point = [-0.25, -0.25, 0.25, 0.25]

  updateBufferData(gl, point, vertexBufferObject)



  //so now we've provided the shader with vertex information, but we need to inform it how to handle it.
  //Get the attribute location of the 'vertexPosition' attribute from the program
  var positionAttributeLocation = gl.getAttribLocation(program, 'vertexPosition')
  // var translationAttributeLocation = gl.getAttribLocation(program, "translation")

  // console.log(translationAttributeLocation)

  //positionAttributeLocation is going to be some number

  //Now we need to specify the layout of that attribute:
  //6 parameters:
  // 1: location of the attribute
  // 2: number of elements per attribute (remember this matches to "attribute vec2 vertexPosition")
  // 3: The Type of the elements
  // 4: gl.FALSE - don't worry about this for now
  // 5: "Stride" - move forward size * sizeof(type) each iteration to get the next position
  // 6: offset from the beginning of a single vertex to this attribute


  //Tell webgl about the color of the vertex
  gl.vertexAttribPointer(
    positionAttributeLocation, //attribute location
    2, //number of elements per attribute
    gl.FLOAT, //Type of elements
    gl.FALSE,
    2 * Float32Array.BYTES_PER_ELEMENT,
    0 // offset from the beginning of a single vertex to this attribute
  )

  // gl.vertexAttribPointer(
  //   translationAttributeLocation, //attribute location
  //   2, //number of elements per attribute
  //   gl.FLOAT, //Type of elements
  //   gl.FALSE,
  //   0,
  //   2 * Float32Array.BYTES_PER_ELEMENT // offset from the bigining of a single vertex to this attribute
  // )

  gl.enableVertexAttribArray(positionAttributeLocation)
  // gl.enableVertexAttribArray(translationAttributeLocation)
  gl.useProgram(program)

  //Note this uses whatever active buffer we have at the moment.

  var loop = function() {
    //note: not a good idea to create variables inside loop due to memory
    //allocation concerns
    // point[2] = translation[0]
    // point[3] = translation[1]

    var translationLocation = gl.getUniformLocation(program, "u_translation")

    gl.uniform2fv(translationLocation, state.translation)
    updateBufferData(gl, point, vertexBufferObject)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    //NOTE: Lines need at least 2 points you jabranus
    gl.drawArrays(gl.LINES, 0, 2)

    requestAnimationFrame(loop)
  }

  //Note: requestAnimationFrame(func) will run func argument
  // whenever the screen is ready to draw a new image (60x/second)
  //Also, won't call function when tab isn't in focus, which is neat
  //if tab is backgrounded.
  requestAnimationFrame(loop);
}

export { initDemo }
