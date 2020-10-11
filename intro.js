//precision mediump float -> determines precision of math inside the shader: medium ==
//vec2, vec3, vec4 -> vector of x elements
// gl_Position = vec4(vertexPosition, 0.0, 1.0) -> gives position of as a 4-vector
// vertexPosition already has 2 elements, so combine those 2 existing elements with
// 0.0, and 1.0
var vertexShaderText = `
  precision mediump float;
  attribute vec2 vertexPosition;
  attribute vec3 vertexColor;
  varying vec3 fragmentColor;
  void main() {
    fragmentColor = vertexColor;
    gl_Position = vec4(vertexPosition, 0.0, 1.0);
  }
`
//fl_FragColor = vec4(1.0, 0.0, 0.0, 1.0) = fully non-transparent red
var fragmentShaderText = `
  precision mediump float;
  varying vec3 fragmentColor;
  void main() {
    gl_FragColor = vec4(fragmentColor, 1.0);
  }
`

var initDemo = function() {

  var canvas = document.getElementById('glCanvas');
  const gl = canvas.getContext("webgl");

  //We can dynamically resize the canvas if we'd like.
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;
  // gl.viewport - update the coordinate system for gl
  // gl.viewport(0, 0, window.innerWidth, window.innerHeight)


  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  //get WebGl ready to use shaders
  //create a shader using WebGL api
  var vertexShader = gl.createShader(gl.VERTEX_SHADER)
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

  // now we need to set the shader source code
  gl.shaderSource(vertexShader, vertexShaderText)
  gl.shaderSource(fragmentShader, fragmentShaderText)

  //now compile the shaders
  gl.compileShader(vertexShader)
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error("ERROR COMPILING VERTEXSHADER!", gl.getShaderInfoLog(vertexShader))
    return
  }

  gl.compileShader(fragmentShader)
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error("ERROR COMPILING VERTEXSHADER!", gl.getShaderInfoLog(fragmentShader))
    return
  }

  //now that we've compiled & checked compile shader status, we need to create a
  //webgl program
  var program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  //Now that we've attached, we need to link them together. ie like compiling & linking in c programs
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("ERROR LINKING PROGRAM!", gl.getProgramInfoLog(program))
    return
  }

  //NOW: Validating programs. Usually only do this in testing b/c it's expensive. Usually we only need to worry about this during debugging & testing
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error("ERROR VALIDATING PROGRAM!", gl.getProgramInfoLog(program))
    return
  }

  //Normal RAM variable that we'll supply to the graphics card program
  //We need to supply this RAM into a graphics card buffer memory
  // Now we need to add color to our vertices
  var a = [-0.5, 0.5]
  var b = [-0.5, -0.5]
  var c = [0.5, -0.5]
  var d = [0.5, 0.5]
  var randomColors = function() {
    return [Math.round(Math.random()), Math.round(Math.random()), Math.round(Math.random())]
  }
  // var squareVertices = [
  //   //x, y
  //   -0.5, 0.5,   Math.round(Math.random()), Math.round(Math.random()), Math.round(Math.random()),
  //   -0.5, -0.5, Math.round(Math.random()), Math.round(Math.random()), Math.round(Math.random()),
  //   0.5, -0.5,   Math.round(Math.random()), Math.round(Math.random()), Math.round(Math.random()),
  //   0.5, 0.5,   Math.round(Math.random()), Math.round(Math.random()), Math.round(Math.random()),
  // ]

  var createLine = function(origin, destination) {
    return [origin, randomColors(), destination, randomColors()].flat()
  }

  vertices = [
    createLine(a,b),
    createLine(b,c),
    createLine(c,d),
    createLine(d,a)
  ].flat(1)

  var squareVertexBufferObject = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBufferObject)
  //Note: Javascript numbers are always 64 bit float precision numbers, so we need to converte
  //to 32 bit floats
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

  //so now we've provided the shader with vertex information, but we need to inform it how to handle it.
  //Get the attribute location of the 'vertexPosition' attribute from the program
  var positionAttributeLocation = gl.getAttribLocation(program, 'vertexPosition')
  var colorAttributeLocation = gl.getAttribLocation(program, 'vertexColor')
  //positionAttributeLocation is going to be some number

  //Now we need to specify the layout of that attribute:
  //6 parameters:
  // 1: location of the attribute
  // 2: number of elements per attribute (remember this matches to "attribute vec2 vertexPosition")
  // 3: The Type of the elements
  // 4: gl.FALSE - don't worry about this for now
  // 5: size of an individual vertex in number of bytes
  // 6: offset from the beginning of a single vertex to this attribute
  gl.vertexAttribPointer(
    positionAttributeLocation, //attribute location
    2, //number of elements per attribute
    gl.FLOAT, //Type of elements
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex in bytes (5 * (number of bytes per float)
    0 // offset from the bigining of a single vertex to this attribute
  )

  //Tell webgl about the color of the vertex
  gl.vertexAttribPointer(
    colorAttributeLocation, //attribute location
    3, //number of elements per attribute
    gl.FLOAT, //Type of elements
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex in bytes (5 * (number of bytes per float)
    2 * Float32Array.BYTES_PER_ELEMENT // offset from the bigining of a single vertex to this attribute
  )

  gl.enableVertexAttribArray(positionAttributeLocation)
  gl.enableVertexAttribArray(colorAttributeLocation)
  gl.useProgram(program)
  //Note this uses whatever active buffer we have at the moment.
  //gl.drawArrays takes 3 params:
  //1: Type of thing we want to draw: usually triangles
  //2: number of vertexes we want to skip
  //3: number of vertexes we want to draw
  gl.drawArrays(gl.LINES, 0, 8)
}


window.onload = initDemo;
