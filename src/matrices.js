"use strict"

var convertToRadians = function(angle) {
  return angle * (Math.PI/180)
}

var rotate2d = function(vector2d, theta) {
  const radians = convertToRadians(theta)
  const x = vector2d[0]
  const y = vector2d[1]
  const cosTheta = Math.cos(radians)
  const sinTheta = Math.sin(radians)
  return [
    ((x * cosTheta ) - (y * sinTheta)),
    ((x * sinTheta) + (y * cosTheta))
  ]
}

//pretty sure this is commutative so order doesn't matter
var translate = function(originVector, translateVector) {
  return originVector.map((originItem, index) => {
    return originItem + translateVector[index]
  })
}


export { rotate2d, translate }
