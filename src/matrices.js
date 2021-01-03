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

var yRotation = function(angleInRadians, rotationPoint) {
  var cos = Math.cos(angleInRadians);
  var sin = Math.sin(angleInRadians);

  return [
    cos, 0, -sin, 0,
    0, 1, 0, 0,
    sin, 0, cos, 0,
    rotationPoint[0], rotationPoint[1], rotationPoint[2], 1,
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

var xRotationMatrix = function(angleInRadians, rotationPoint) {
  var cos = Math.cos(angleInRadians);
  var sin = Math.sin(angleInRadians);

  return [
    1, 0, 0, 0,
    0, cos, sin, 0,
    0, -sin, cos, 0,
    0, 0, 0, 1,
  ];
}

var xAxisRotationAroundPoint = function(vectorToRotate, angleInRadians, target) {
  var vec4 = vectorToRotate.concat(1)
  var x_rotation_matrix = xRotationMatrix(angleInRadians, target)
  // console.log("the x rotation", x_rotation)
  // console.log(vectorToRotate)
  // console.log(x_rotation_matrix[15])
  // console.log(vectorMatrixMultiply(vectorToRotate, x_rotation_matrix)[15])
  return vectorMatrixMultiply(vec4, x_rotation_matrix)
}


// all credit to
// https://webglfundamentals.org/webgl/lessons/webgl-3d-camera.html
// Note: This only works for a subset of 4x4 matrixes - something is up with m23
// any non-zero value there results in a inverse matrix filled with NaN values

//If we want to re-implement this without the bug, see https://semath.info/src/inverse-cofactor-ex4.html
var inverse = function(m) {

  var m00 = m[0 * 4 + 0];
  var m01 = m[0 * 4 + 1];
  var m02 = m[0 * 4 + 2];
  var m03 = m[0 * 4 + 3];
  var m10 = m[1 * 4 + 0];
  var m11 = m[1 * 4 + 1];
  var m12 = m[1 * 4 + 2];
  var m13 = m[1 * 4 + 3];
  var m20 = m[2 * 4 + 0];
  var m21 = m[2 * 4 + 1];
  var m22 = m[2 * 4 + 2];
  var m23 = m[2 * 4 + 3];
  var m30 = m[3 * 4 + 0];
  var m31 = m[3 * 4 + 1];
  var m32 = m[3 * 4 + 2];
  var m33 = m[3 * 4 + 3];
  var tmp_0  = m22 * m33;
  var tmp_1  = m32 * m23;
  var tmp_2  = m12 * m33;
  var tmp_3  = m32 * m13;
  var tmp_4  = m12 * m23;
  var tmp_5  = m22 * m13;
  var tmp_6  = m02 * m33;
  var tmp_7  = m32 * m03;
  var tmp_8  = m02 * m23;
  var tmp_9  = m22 * m03;
  var tmp_10 = m02 * m13;
  var tmp_11 = m12 * m03;
  var tmp_12 = m20 * m31;
  var tmp_13 = m30 * m21;
  var tmp_14 = m10 * m31;
  var tmp_15 = m30 * m11;
  var tmp_16 = m10 * m21;
  var tmp_17 = m20 * m11;
  var tmp_18 = m00 * m31;
  var tmp_19 = m30 * m01;
  var tmp_20 = m00 * m21;
  var tmp_21 = m20 * m01;
  var tmp_22 = m00 * m11;
  var tmp_23 = m10 * m01;


  var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
      (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);

  var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
      (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
  var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
      (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
  var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
      (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

  var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

  return [
    d * t0,
    d * t1,
    d * t2,
    d * t3,
    d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
          (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
    d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
          (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
    d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
          (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
    d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
          (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
    d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
          (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
    d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
          (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
    d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
          (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
    d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
          (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
    d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
          (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
    d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
          (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
    d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
          (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
    d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
          (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
  ];
}
//all credit to https://webglfundamentals.org/webgl/lessons/webgl-3d-camera.html
var cross = function(a, b) {
  return [a[1] * b[2] - a[2] * b[1],
          a[2] * b[0] - a[0] * b[2],
          a[0] * b[1] - a[1] * b[0]];
}

//all credit to https://webglfundamentals.org/webgl/lessons/webgl-3d-camera.html
var subtractVectors = function(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

var normalize = function(v) {
  var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  // make sure we don't divide by 0.
  if (length > 0.00001) {
    return [v[0] / length, v[1] / length, v[2] / length];
  } else {
    return [0, 0, 0];
  }
}

//all credit to https://webglfundamentals.org/webgl/lessons/webgl-3d-camera.html
var lookAt = function(cameraPosition, target, up) {
  var zAxis = normalize(
      subtractVectors(cameraPosition, target));
  var xAxis = normalize(cross(up, zAxis));
  var yAxis = normalize(cross(zAxis, xAxis));

  return [
     xAxis[0], xAxis[1], xAxis[2], 0,
     yAxis[0], yAxis[1], yAxis[2], 0,
     zAxis[0], zAxis[1], zAxis[2], 0,
     cameraPosition[0],
     cameraPosition[1],
     cameraPosition[2],
     1,
  ];
}

var vectorMatrixMultiply = function(vec4, mat4) {
  //Really this is a kind of matrix-matrix multiplication, but
  //for implementation reasons we've split this out to two functions

  return [
    ((vec4[0] * mat4[0]) + (vec4[1] * mat4[4]) + (vec4[2] * mat4[8]) + (vec4[3] * mat4[12])),
    ((vec4[0] * mat4[1]) + (vec4[1] * mat4[5]) + (vec4[2] * mat4[9]) + (vec4[3] * mat4[13])),
    ((vec4[0] * mat4[2]) + (vec4[1] * mat4[6]) + (vec4[2] * mat4[10]) + (vec4[3] * mat4[14])),
    ((vec4[0] * mat4[3]) + (vec4[1] * mat4[7]) + (vec4[2] * mat4[11]) + (vec4[3] * mat4[15]))
  ]
}


export {
  multiply4,
  translationMatrix,
  projectionMatrix,
  perspectiveMatrix,
  identityMatrix,
  translate,
  inverse,
  yRotation,
  zRotation,
  lookAt,
  xAxisRotationAroundPoint,
  vectorMatrixMultiply,
  subtractVectors
}
