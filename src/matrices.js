"use strict"

//most of this was shamelessly copied from https://webglfundamentals.org/webgl/lessons/


//Note: due to low level details in opengl, we're following the programming notation of
// rows & columns being inverted from mathematical convention
var multiply4 = function(a, b) {
  var c11 = (b[0] * a[0]) + (b[1] * a[4]) +  (b[2] * a[8]) +  (b[3] * a[12])
  var c12 = (b[0] * a[1]) + (b[1] * a[5]) +  (b[2] * a[9]) +  (b[3] * a[13])
  var c13 = (b[0] * a[2]) + (b[1] * a[6]) +  (b[2] * a[10]) +  (b[3] * a[14])
  var c14 = (b[0] * a[3]) + (b[1] * a[7]) +  (b[2] * a[11]) +  (b[3] * a[15])

  var c21 = (b[4] * a[0]) + (b[5] * a[4]) +  (b[6] * a[8]) +  (b[7] * a[12])
  var c22 = (b[4] * a[1]) + (b[5] * a[5]) +  (b[6] * a[9]) +  (b[7] * a[13])
  var c23 = (b[4] * a[2]) + (b[5] * a[6]) +  (b[6] * a[10]) +  (b[7] * a[14])
  var c24 = (b[4] * a[3]) + (b[5] * a[7]) +  (b[6] * a[11]) +  (b[7] * a[15])

  var c31 = (b[8] * a[0]) + (b[9] * a[4]) +  (b[10] * a[8]) +  (b[11] * a[12])
  var c32 = (b[8] * a[1]) + (b[9] * a[5]) +  (b[10] * a[9]) +  (b[11] * a[13])
  var c33 = (b[8] * a[2]) + (b[9] * a[6]) +  (b[10] * a[10]) +  (b[11] * a[14])
  var c34 = (b[8] * a[3]) + (b[9] * a[7]) +  (b[10] * a[11]) +  (b[11] * a[15])

  var c41 = (b[12] * a[0]) + (b[13] * a[4]) +  (b[14] * a[8]) + (b[15] * a[12])
  var c42 = (b[12] * a[1]) + (b[13] * a[5]) +  (b[14] * a[9]) + (b[15] * a[13])
  var c43 = (b[12] * a[2]) + (b[13] * a[6]) +  (b[14] * a[10]) + (b[15] * a[14])
  var c44 = (b[12] * a[3]) + (b[13] * a[7]) +  (b[14] * a[11]) + (b[15] * a[15])

  return [c11, c12, c13, c14, c21, c22, c23, c24, c31, c32, c33, c34, c41, c42, c43, c44]
}

var zRotation = function(radians) {
  var sin = Math.sin(radians)
  var cos = Math.cos(radians)
  return [
    cos, - sin, 0, 0,
    sin,   cos, 0, 0,
    0,       0, 1,  0,
    0,       0, 0, 1
  ]
}

var xRotation = function(angleInRadians) {
  var cos = Math.cos(angleInRadians);
  var sin = Math.sin(angleInRadians);

  return [
    1, 0, 0, 0,
    0, cos, sin, 0,
    0, -sin, cos, 0,
    0, 0, 0, 1,
  ];
}

var yRotation = function(angleInRadians) {
  var cos = Math.cos(angleInRadians);
  var sin = Math.sin(angleInRadians);

  return [
    cos, 0, -sin, 0,
    0, 1, 0, 0,
    sin, 0, cos, 0,
    0, 0, 0, 1,
  ];
}

var translationMatrix = function(tx, ty, tz) {
  return [
    1,  0,  0, 0,
    0,  1,  0, 0,
    0,  0,  1, 0,
    tx, ty, tz, 1
  ]
}

var identityMatrix = function() {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]
}

var projectionMatrix = function(width, height, depth) {
  return [
    2 / width, 0, 0, 0,
    0, 2 / height, 0, 0,
    0, 0, 2 / depth, 0,
    1, 1, 0, 1,
  ]
}

//fieldOfViewInRadians
//aspect - image's width to height
//near - describes where things will be clipped in the near plane
//far - describes where things will be clipped in the far plane
var perspectiveMatrix = function(fieldOfViewInRadians, aspect, near, far) {
  var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
  var rangeInv = 1.0 / (near - far);

  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, (near * far) * rangeInv * 2, 0
  ];
}

var translate = function(matrix, tx, ty, tz) {
  return multiply4(matrix, translationMatrix(tx, ty, tz))
}

var xRotate = function(matrix, angleInRadians) {
  return multiply4(matrix, xRotation(angleInRadians))
}

var yRotate = function(matrix, angleInRadians) {
  return multiply4(matrix, yRotation(angleInRadians))
}

var zRotate = function(matrix, angleInRadians) {
  return multiply4(matrix, zRotation(angleInRadians))
}



export { multiply4, translationMatrix, projectionMatrix, perspectiveMatrix, xRotate, yRotate, zRotate, translate   }
