"use strict"

import {
  multiply4,
  inverse,
  vectorMatrixMultiply,
  dot_product,
  vector_addition,
  vector_inverse,
  vector_magnitude,
  vector_subtraction,
  angle_between_vectors
} from "../src/matrices.js"
// import { mat4 } from "../node_modules/gl-matrix/gl-matrix.js"
var radians_to_degrees = function(radians) {
  return (radians * 180) / Math.PI
}

describe("vector_addition", () => {
  it("throws an exception with vectors of different length", () => {
    var vector_a = [1, 2, 3]
    var vector_b = [4, 5, 6, 7]

    expect(
      () => { vector_addition(vector_a, vector_b)}
    ).toThrow(
      new Error("Attempting to add vectors of different length")
    )
  })

  it("adds the vectors together", () => {
    var vector_a = [1, 2, 3]
    var vector_b = [4, 5, 6]
    expect(
      vector_addition(vector_a, vector_b)
    ).toVectorEqual([5,7,9])
  })

  it("performs a commutative operation", () => {
    var vector_a = [1, 2, 3]
    var vector_b = [4, 5, 6]
    expect(
      vector_addition(vector_b, vector_a)
    ).toVectorEqual([5,7,9])
  })
})

describe("vector_addition", () => {
  it("throws an exception with a vector not of length 3", () => {
    var vector = [1, 2, 3, 4]


    expect(
      () => { vector_inverse(vector)}
    ).toThrow(
      new Error("Attempting to invert a vector with length not equal to 3")
    )
  })

  it("inverts the vector", () => {
    var vector_a = [1, 2, 3]
    expect(
      vector_inverse(vector_a)
    ).toVectorEqual([-1, -2, -3])
  })
})

describe("vector_subtraction", () => {
  it("throws an exception with vectors of different length", () => {
    var vector_a = [1, 2, 3]
    var vector_b = [4, 5, 6, 7]

    expect(
      () => { vector_subtraction(vector_a, vector_b)}
    ).toThrow(
      new Error("Attempting to subtract vectors not equal to length 3")
    )
  })

  it("subtracts the second vector from the first the vectors together", () => {
    var vector_a = [1, 6, 3]
    var vector_b = [4, 5, 9]
    expect(
      vector_subtraction(vector_a, vector_b)
    ).toVectorEqual([-3, 1, -6])
  })

  it("is not commutative", () => {
    var vector_a = [1, 2, 3]
    var vector_b = [4, 8, -1]
    expect(
      vector_subtraction(vector_b, vector_a)
    ).toVectorEqual([3, 6, -4])
  })
})

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

  // it("inverts the matrix ", () => {
  //   var inverted = inverse(a)
  //   var identity = multiply4(a, inverted)
  //
  //   // console.log(inverted)
  //   // console.log(identity)
  // })
})

describe("dot product", () => {

  describe("with vectors of different lengths", () => {
    it("raises an exception", () => {
      var vector_1 = [1, 2]
      var vector_2 = [4, 5, 6]
      expect(
        () => { dot_product(vector_1, vector_2)}
      ).toThrow(
        new Error("Attempting to take dot product of vectors with different lengths")
      )
    })
  })

  describe("with vectors of equal length", () => {
    it("with positive values it creates the expected result", () => {
      var vector_1 = [1, 2, 3]
      var vector_2 = [4, 5, 6]
      expect(dot_product(vector_1, vector_2)).toEqual(32)
    })

    it("with perpendicular unit vectors", () => {
      var vector_1 = [0, 0, 1]
      var vector_2 = [1, 0, 0]
      expect(dot_product(vector_1, vector_2)).toEqual(0)
    })

    it("with another set of perpendicular unit vector", () => {
      var vector_1 = [0, 0, 1]
      var vector_2 = [0, 1, 0]
      expect(dot_product(vector_1, vector_2)).toEqual(0)
    })
  })
})

describe("vector_magnitude", () => {
  describe("with unit vectors", () => {
    it("calculates a magnitude of 1", () => {
      var vector = [0,0,1]
      expect(vector_magnitude(vector)).toEqual(1)
    })
    it("calculates a magnitude of 1", () => {
      var vector = [0,1,0]
      expect(vector_magnitude(vector)).toEqual(1)
    })
    it("calculates a magnitude of 1", () => {
      var vector = [1,0,0]
      expect(vector_magnitude(vector)).toEqual(1)
    })
  })

  describe("with non-unit vectors", () => {
    it("calculates the length", () => {
      var vector = [3, 4, 5]
      expect(vector_magnitude(vector)).toEqual(
        Math.sqrt((3 * 3) + (4 * 4) + (5 * 5))
      )
    })
  })
})

describe("angle_between_vectors", () => {
  describe("with perpendicular angles", () => {
    it("returns a 90 degree angle", () => {
      var vector_a = [1,0,0]
      var vector_b = [0,1,0]
      var angle_in_radians = angle_between_vectors(vector_a, vector_b)
      expect(radians_to_degrees(angle_in_radians)).toEqual(90)
    })

    it("returns a 90 degree angle", () => {
      var vector_a = [1,0,0]
      var vector_b = [0,0,1]
      var angle_in_radians = angle_between_vectors(vector_a, vector_b)
      expect(radians_to_degrees(angle_in_radians)).toEqual(90)
    })
  })

  describe("with parallel angles", () => {
    it("returns a 0 degree angle", () => {
      var vector_a = [1,0,0]
      var vector_b = [20,0,0]
      var angle_in_radians = angle_between_vectors(vector_a, vector_b)
      expect(radians_to_degrees(angle_in_radians)).toEqual(0)
    })

    it("returns a 0 degree angle", () => {
      var vector_a = [1,2,3]
      var vector_b = [2,4,6]
      var angle_in_radians = angle_between_vectors(vector_a, vector_b)
      expect(radians_to_degrees(angle_in_radians)).toEqual(0)
    })
  })

  describe("with an all-zero vector ", () => {
    //NOTE: this might not be the correct behavior, but as the result with an all 0-vector
    //is undefined, I'm not sure what would happen to the application
    it("throws an error", () => {
      var vector_a = [0,0,0]
      var vector_b = [1,0,0]

      expect(() => {
        angle_between_vectors(vector_a, vector_b)
      }).toThrow(
        new Error("Attempting to measure the angle between a vector and an empty vector")
      )
    })
  })

  describe("with negative vector values", () => {
    it("returns a smaller than 90 degree result", () => {
      var x_axis_vector = [1, 0, 0]
      var camera_vector = [-128, -31, -317 ]
      // console.log(angle_between_vectors(camera_vector, x_axis_vector))
    })
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
