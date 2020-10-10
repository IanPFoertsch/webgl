function drawTriangles() {

  var canvas = document.getElementById('glCanvas');
  const gl = canvas.getContext("webgl");

  var vertices = [
      -0.5,0.5,0.0,
      0.0,0.5,0.0,
      -0.25,0.25,0.0,
   ];


  var vertexBuffer = gl.createBuffer()
  //BindBuffer "binds a webglbuffer to a target"
  //I guess we're binding the vertexbuffer to the gl.ARRAY_BUFFER element or something?
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

  gl.bufferData(
     gl.ARRAY_BUFFER,
     new Float32Array(vertices),
     gl.STATIC_DRAW
  )

  gl.bindBuffer(gl.ARRAY_BUFFER, null);


  //steps: create the source code string
  //steps: Create a shader object of type VERTEX_SHADER
  //add the shader source code to the shader object
  //compile the shader source
  var vertCode =
    'attribute vec3 coordinates;' +

    'void main(void) {' +
       ' gl_Position = vec4(coordinates, 1.0);' +
       'gl_PointSize = 10.0;'+
    '}';
  var vertShader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vertShader, vertCode)
  gl.compileShader(vertShader)

  var fragCode = `
    void main(void) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);
    }
  `
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fragmentShader, fragCode)
  gl.compileShader(fragmentShader)

  //Review - "shader" program taking vertex & texture data & generating pixel data
  //a webGL program is a combination of two compiled WebGLShaders consisting of a
  //vertex shader and a fragment shader
  var shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertShader)
  gl.attachShader(shaderProgram, fragmentShader)
  // Linking the program? Docs didn't say exactly what's happening here but I assume
  // it's binding the 2 shaders together
  gl.linkProgram(shaderProgram)
  gl.useProgram(shaderProgram)

  //What does this do exactly?
  //also we did this way above? why do we have to do it again?
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  var coord = gl.getAttribLocation(shaderProgram, "coordinates");
  gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coord)


  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  //Not sure what the depth test is
  gl.enable(gl.DEPTH_TEST);
  //Also not sure what the buffer bit is
  gl.clear(gl.COLOR_BUFFER_BIT);
  //viewport = ???
  gl.viewport(0,0,canvas.width,canvas.height);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

window.onload = drawTriangles;
