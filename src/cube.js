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

    var e = [-0.5, -0.5, -.5]
    var f = [-0.5, 0.5, -.5]
    var g = [0.5, 0.5, -.5]
    var h = [0.5, -0.5, -.5]

    this.vertices = [
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

    this.vertexShaderText = `
      precision mediump float;
      attribute vec3 vertexPosition;
      uniform mat4 matrix;

      void main() {
        vec4 extendedPosition = vec4(vertexPosition, 1.0);
        gl_Position = matrix * extendedPosition;
      }
    `

    this.fragmentShaderText = `
      precision mediump float;
      void main() {
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
      }
    `

    this.vertexShader = this.createShader(gl, gl.VERTEX_SHADER, this.vertexShaderText)
    this.fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, this.fragmentShaderText)
    this.program = this.createProgram(gl, this.vertexShader, this.fragmentShader)
    this.vertexBufferObject = gl.createBuffer()
    this.positionAttributeLocation = gl.getAttribLocation(this.program, 'vertexPosition')
  }

  draw(matrix) {

    this.gl.useProgram(this.program)
    this.updateBufferData(this.gl, this.vertices, this.vertexBufferObject)
    this.gl.vertexAttribPointer(
      this.positionAttributeLocation, //attribute location
      3, //number of elements per attribute
      this.gl.FLOAT, //Type of elements
      this.gl.FALSE,
      3 * Float32Array.BYTES_PER_ELEMENT, //stride: offset in bytes between consecutive attributes
      0 // offset from the beginning of a single vertex to this attribute
    )
    this.gl.enableVertexAttribArray(this.positionAttributeLocation)


    var matrixLocation = this.gl.getUniformLocation(this.program, "matrix")
    this.gl.uniformMatrix4fv(matrixLocation, false, matrix)
    this.gl.drawArrays(this.gl.LINES, 0, 24)
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
