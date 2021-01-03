"use strict"

import { multiply4, inverse, vectorMatrixMultiply } from "../src/matrices.js"
// import { mat4 } from "../node_modules/gl-matrix/gl-matrix.js"

describe("xAxisRotationAroundPoint", () => {

  it("multiplying by an identity matrix results in an identical vector", () => {
    var vectorToRotate = [1, 2, 3, 4]
    var matrixToMultiply = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]

    var result = vectorMatrixMultiply(vectorToRotate, matrixToMultiply)
    expect(result).toVectorEqual(vectorToRotate)
  })

  it("with a simple matrix to multiply by it creates the expected result", () => {
    var vectorToRotate = [1, 2, 3, 4]
    var matrixToMultiply = [
      1, 2, 3, 4,
      5, 6, 7, 8,
      9, 10, 11, 12,
      13, 14, 15, 16
    ]
    var result = vectorMatrixMultiply(vectorToRotate, matrixToMultiply)

    expect(result).toVectorEqual(
      [
        1 + 10 + 27 + 52,
        2 + 12 + 30 + 56,
        3+ 14 + 33 + 60,
        4 + 16 + 36 + 64
      ]
    )
  })


})

describe("inverse", () => {
  var a = [
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 10, 11, 0,
    2, 2, 300, 1
  ]

  var b = [
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 10, 11, 12,
    13, 14, 15, 16
  ]

  it("inverts the matrix ", () => {
    var inverted = inverse(a)
    var identity = multiply4(a, inverted)

    // console.log(inverted)
    console.log(identity)
  })
})


describe("multiply4", function() {
  describe("with all positive values", () => {
    var a = [
      1, 2, 3, 4,
      5, 6, 7, 8,
      9, 10, 11, 12,
      13, 14, 15, 16
    ]

    var b = [
      17, 18, 19, 20,
      21, 22, 23, 24,
      25, 26, 27, 28,
      29, 30, 31, 32
    ]


    it("should multiply to create the expected result", () => {
      var result = multiply4(a, b)
      expect(result).toVectorEqual([538, 612, 686, 760, 650, 740, 830, 920, 762, 868, 974, 1080, 874, 996, 1118, 1240])
    })
  })

  describe("with a mix of positive and negative values", () => {
    var a = [
      1, -2, 3, -4,
      5, -6, 7, -8,
      9, -10, 11, -12,
      13, -14, 15, -16
    ]

    var b = [
      -17, 18, -19, 20,
      -21, 22, -23, 24,
      -25, 26, -27, 28,
      -29, 30, -31, 32
    ]

    it("should multiply to create the expected result", () => {
      var result = multiply4(a, b)
      expect(result).toVectorEqual( [162, -164, 166, -168, 194, -196, 198, -200, 226, -228, 230, -232, 258, -260, 262, -264])
    })

    describe("when multiplying by the identity matrix", () => {
      var a = [
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16
      ]

      var identity = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ]

      it("multiplies to return the original matrix", () => {
        var result = multiply4(a, identity)
        expect(result).toVectorEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
      })
    })
  })
})
