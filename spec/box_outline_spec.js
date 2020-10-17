"use strict"

import { BoxOutline } from "../src/box_outline.js"


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
  var box = new BoxOutline(0, 1)


  fit("generates the expected Transformation", () => {
    console.log(box.vertices)
    console.log(box.vertices.length)
  })



});
