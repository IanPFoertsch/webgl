"use strict"
class Cube {
  //should contain both the webgl representation & the CPU data

  constructor(vertices, canvas, gl) {
    // this.origin = origin
    this.canvas = canvas
    this.gl = gl
    var a = [-0.5, -0.5, 0.5]
    var b = [-0.5, 0.5, 0.5]
    var c = [0.5, 0.5, 0.5]
    var d = [0.5, -0.5, 0.5]

    var e = [-0.5, -0.5, -0.5]
    var f = [-0.5, 0.5, -0.5]
    var g = [0.5, 0.5, -0.5]
    var h = [0.5, -0.5, -0.5]

    var red = [1,0,0,1]
    var green = [0,1,0,1]
    var blue = [0,0,1,1]
    var pink = [1,0,1,1]
    var cyan = [0,1,1,1]
    var yellow = [1,1,0,1]

    this.wire_frame_vertices = [
      a, b,
      a, d,
      a, e,

      c, d,
      c, g,
      c, b,

      f, e,
      f, g,
      f, b,

      h, e,
      h, g,
      h, d
    ].flat()


     this.solid_vertices = [
       a, green, c, green, b, green, //front
       a, green, d, green, c, green, //front
       e, blue, g, blue, f, blue, //back
       e, blue, h, blue, g, blue, //back
       f, red, c, red, b, red, // top
       f, red, c, red, g, red, // top
       a, pink, h, pink, e, pink, // bottom
       a, pink, d, pink, h, pink, // bottom
       h, cyan, c, cyan, g, cyan, // right
       h, cyan, d, cyan, c, cyan, // right
       a, yellow, f, yellow, b, yellow, //left
       a, yellow, e, yellow, f, yellow, // left

     ].flat()

    this.vertexShaderText = `
      precision mediump float;
      attribute vec3 vertexPosition;
      uniform mat4 matrix;
      attribute vec4 inputColor;
      varying vec4 vertexColor;

      void main() {
        vec4 extendedPosition = vec4(vertexPosition, 1);
        gl_Position = matrix * extendedPosition;
        vertexColor = inputColor;
      }
    `

    this.fragmentShaderText = `
      precision mediump float;
      varying vec4 vertexColor;
      void main() {
        gl_FragColor = vertexColor;
      }
    `

    this.vertexShader = this.createShader(gl, gl.VERTEX_SHADER, this.vertexShaderText)
    this.fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, this.fragmentShaderText)
    this.program = this.createProgram(gl, this.vertexShader, this.fragmentShader)
    this.vertexBufferObject = gl.createBuffer()

    this.positionAttributeLocation = gl.getAttribLocation(this.program, 'vertexPosition')
    this.colorAttributeLocation = gl.getAttribLocation(this.program, 'inputColor')
  }

  vertices() {
    return this.solid_vertices
  }

  draw(matrix) {
    this.gl.useProgram(this.program)

    this.updateBufferData(this.gl, this.vertices(), this.vertexBufferObject)

    this.gl.vertexAttribPointer(
      this.positionAttributeLocation, //attribute location
      3, //number of elements per attribute
      this.gl.FLOAT, //Type of elements
      this.gl.FALSE,
      7 * Float32Array.BYTES_PER_ELEMENT, //stride: from the first peice of data, the positional info for the vertex is x elements
      0 * Float32Array.BYTES_PER_ELEMENT  // offset from the beginning of a single vertex to this attribute
    )


    this.gl.vertexAttribPointer(
      this.colorAttributeLocation, //attribute location
      4, //number of elements per attribute
      this.gl.FLOAT, //Type of elements
      this.gl.FALSE,
      7 * Float32Array.BYTES_PER_ELEMENT, //stride: from the first peice of data, the positional info for the vertex is x elements
      3 * Float32Array.BYTES_PER_ELEMENT // offset from the beginning of a single vertex to this attribute
    )

    this.gl.enableVertexAttribArray(this.positionAttributeLocation)
    this.gl.enableVertexAttribArray(this.colorAttributeLocation)

    var matrixLocation = this.gl.getUniformLocation(this.program, "matrix")
    this.gl.uniformMatrix4fv(matrixLocation, false, matrix)
    var num_vertices = this.vertices().length / 7

    this.gl.drawArrays(this.gl.TRIANGLES, 0, num_vertices)
  }

  updateBufferData(canvasContext, vertices, buffer) {
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

  createShader(gl, type, source) {
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

  createProgram(gl, vertexShader, fragmentShader) {
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

}

export { Cube }
