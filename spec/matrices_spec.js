"use strict"

import { rotate2d, translate } from "../src/matrices.js"


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
              console.log(value)
              console.log(expectedVector[index])
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

describe("rotate2d", function() {
  var vector = [1,1]

  var expectedRotations = {
    90: [-1,1],
    180: [-1,-1],
    270: [1,-1],
    360: [1,1]
  }

  Object.entries(expectedRotations).forEach((fixture) => {
    var angle = fixture[0]
    var expectedTransform = fixture[1]
    it("generates the expected Transformation", () => {
      expect(rotate2d(vector, angle)).toVectorEqual(expectedTransform)
    })
  })


});
