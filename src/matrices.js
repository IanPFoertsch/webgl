"use strict"

//Note: due to low level details in opengl, we're following the programming notation of
// rows & columns being inverted from mathematical convention
var multiply3 = function(a, b) {
  var c11 = (b[0] * a[0]) + (b[1] * a[3]) +  (b[2] * a[6])
  var c12 = (b[0] * a[1]) + (b[1] * a[4]) +  (b[2] * a[7])
  var c13 = (b[0] * a[2]) + (b[1] * a[5]) +  (b[2] * a[8])

  var c21 = (b[3] * a[0]) + (b[4] * a[3]) +  (b[5] * a[6])
  var c22 = (b[3] * a[1]) + (b[4] * a[4]) +  (b[5] * a[7])
  var c23 = (b[3] * a[2]) + (b[4] * a[5]) +  (b[5] * a[8])

  var c31 = (b[6] * a[0]) + (b[7] * a[3]) +  (b[8] * a[6])
  var c32 = (b[6] * a[1]) + (b[7] * a[4]) +  (b[8] * a[7])
  var c33 = (b[6] * a[2]) + (b[7] * a[5]) +  (b[8] * a[8])

  return [c11, c12, c13, c21, c22, c23, c31, c32, c33]
}

var rotationMatrix = function(radians) {
  var sin = Math.sin(radians)
  var cos = Math.cos(radians)
  return [
    cos, - sin, 0,
    sin,   cos, 0,
    0,       0, 1
  ]
}

var translationMatrix = function(tx, ty) {
  return [
    1,  0,  0,
    0,  1,  0,
    tx, ty, 1
  ]
}

export { multiply3, rotationMatrix, translationMatrix }
