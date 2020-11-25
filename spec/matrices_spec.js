"use strict"

import { multiply4 } from "../src/matrices.js"
import { mat4 } from "../node_modules/gl-matrix/gl-matrix.js"


beforeEach(function() {
  jasmine.addMatchers({
    toVectorEqual: function() {
      return {
        compare: function(actualVector, expectedVector) {
          var result = {pass:true,message:"Vectors are within threshold of difference"};

          if (actualVector.length !== expectedVector.length) {
            result.pass = false
            result.message = `Vector ${actualVector} is of different length than ${expectedVector}`
          }

          actualVector.forEach((value, index) => {

            var diff = Math.abs(value - expectedVector[index])

            if (diff > 0.00001) {
              result.pass = false
              result.message = `Vector elements at index ${index} differ by ${diff}` +
              ` expected: ${expectedVector}, actual: ${actualVector}`
            }
          })

          return result
        }
      }
    }
  })
})

// describe("rotate2d", function() {
//   var vector = [1,1]
//
//   var expectedRotations = {
//     90: [-1,1],
//     180: [-1,-1],
//     270: [1,-1],
//     360: [1,1]
//   }
//
//   Object.entries(expectedRotations).forEach((fixture) => {
//     var angle = fixture[0]
//     var expectedTransform = fixture[1]
//     it("generates the expected Transformation", () => {
//       expect(rotate2d(vector, angle)).toVectorEqual(expectedTransform)
//     })
//   })
// })


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
