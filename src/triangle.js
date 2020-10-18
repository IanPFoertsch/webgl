//precision mediump float -> determines precision of math inside the shader: medium ==
//vec2, vec3, vec4 -> vector of x elements
// gl_Position = vec4(vertexPosition, 0.0, 1.0) -> gives position of as a 4-vector
// vertexPosition already has 2 elements, so combine those 2 existing elements with
// 0.0, and 1.0
"use strict"

import { mat4, glMatrix } from "../node_modules/gl-matrix/gl-matrix.js"


//Note: In openGl transformations are applied in Right to left order
//So gl_Position = Mprod * mView * mWorld * vec4(vertexPosition, 0.0, 1.0);
// this is equivalent to:
// step 1: Vec4(vertexPosition, 0.0, 1.0) creation
// step 2: Multiply vertexPosition vec4 by mWorld
// step 3: Multiply ^ that by mView
// step 4: Multiply ^ that by mProj
var vertexShaderText = `
  precision mediump float;
  attribute vec3 vertexPosition;
  attribute vec3 vertexColor;
  varying vec3 fragmentColor;
  uniform mat4 mWorld;
  uniform mat4 mView;
  uniform mat4 mProj;

  void main() {
    fragmentColor = vertexColor;
    gl_Position = mProj * mView * mWorld * vec4(vertexPosition, 1.0);
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


  gl.clearColor(0.75, 0.86, 0.8, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  //DepthTest basically means only render surfaces which are closer to the camera than what we just rendered
  //bascially don't waste computation on faces which aren't visible
  // gl.enable(gl.DEPTH_TEST)
  // CULL_FACE basically drops the back face
  gl.enable(gl.CULL_FACE)
  //frontface - A face is formed by the order of the vertices appearing:
  //CCW - counterclockwise to each other
  // CW - clockwise to each other
  gl.frontFace(gl.CCW)
  gl.cullFace(gl.BACK)

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
  var boxVertices = [ // X, Y, Z           R, G, B
		// Top
		-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
		-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
		-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
		-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
		-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
		1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

		// Bottom
		-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
		-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
		1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
	];

  //boxIndices - indicate which indices form triangles
  var boxIndices =
	[
		// Top triangles are
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];



  var boxVertexBufferObject = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject)
  //Note: Javascript numbers are always 64 bit float precision numbers, so we need to converte
  //to 32 bit floats
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW)

  var boxIndexBufferObject = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW)

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
    3, //number of elements per attribute
    gl.FLOAT, //Type of elements
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex in bytes (2 * (number of bytes per float)
    0 // offset from the bigining of a single vertex to this attribute
  )

  gl.vertexAttribPointer(
    colorAttributeLocation, //attribute location
    3, //number of elements per attribute
    gl.FLOAT, //Type of elements
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex in bytes (2 * (number of bytes per float)
    3 * Float32Array.BYTES_PER_ELEMENT // offset from the bigining of a single vertex to this attribute
  )

  gl.enableVertexAttribArray(positionAttributeLocation)
  gl.enableVertexAttribArray(colorAttributeLocation)


  //Tell opengl state machine which program should be active
  gl.useProgram(program)
  var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld')
  var matViewUniformLocation = gl.getUniformLocation(program, 'mView')
  var matProjUniformLocation = gl.getUniformLocation(program, 'mProj')


  var worldMatrix = new Float32Array(16)
  var viewMatrix = new Float32Array(16)
  var projMatrix = new Float32Array(16)

  //Now we have 3 cpu variables containing identity matrices

  mat4.identity(worldMatrix)

  //arguments: OutputMatrix, eye, center, up
  // eye: position of viewer in 3d space
  // center: position viewer is looking at
  // up: which direction is up?
  mat4.lookAt(viewMatrix, [0,0,-6], [0,0,0], [0,1,0])
  //arguments: Output, field of view, aspect ratio, near plane, far plane
  // output: array to write results to:
  // field of view: vertical field of view in radians
  // aspect: Aspect ratio: viewport width/height
  // near: near bound of the plane - I think this is clip space?
  // far: far bound of the plane - I think this is clip space?
  mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0)

  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix)
  gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix)
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix)



  //main render loop
  var identityMatrix = new Float32Array(16)
  var xRotationMatrix = new Float32Array(16)
  var yRotationMatrix = new Float32Array(16)
  mat4.identity(identityMatrix)
  var angle = 0
  var loop = function() {
    //6 * 2 * Math.PI = 1 full rotation every 6 seconds
    angle = performance.now() / 1000 / 6 * 2 * Math.PI
    //Rotate the identityMatrix by "angle" about the [0,1,0] - vertical axis,
    //and store the result in the worldMatrix mat4 matrix
    mat4.rotate(yRotationMatrix, identityMatrix, angle, [0,1,0])
    mat4.rotate(xRotationMatrix, identityMatrix, angle *2, [1,0,0])
    mat4.multiply(worldMatrix, yRotationMatrix, xRotationMatrix)

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix)
    gl.clearColor(0.75, 0.86, 0.8, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    //Note this uses whatever active buffer we have at the moment.
    //gl.drawElements takes 4 params:
    //1: Type of thing we want to draw: usually triangles
    //2: the number of things we want to draw: we can just make this the number of box indices we have
    //3: data type of values in the element array buffer -> in our case this is our indices
    //4: where in elements buffer to start: in our case just start at the beginning
    gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0)
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop)

}


export { initDemo }
