"use strict"

import { Tree } from "../src/tree.js"
describe("Tree", function() {
  describe("constructor", () => {
    describe("when growing a single-element tree", () => {
      it("generates a tree with no children", () => {
        var tree = new Tree({origin: [0,0], length: 1, angle: 0.0, propagate: 0, angle_variance: 0})
        expect(tree.left_child).toBeUndefined()
        expect(tree.right_child).toBeUndefined()
      })

      it("generates a terminus extending to the right", () => {
        var tree = new Tree({origin: [0,0], length: 1, angle: 0.0, propagate: 0, angle_variance: 0})
        expect(tree.terminus).toVectorEqual([1,0])
      })

      describe("when growing a tree straight up", () => {

        it("generates a terminus straight above the origin", () => {
          var angle = 90*(Math.PI/180)
          var tree = new Tree({origin: [0,0], length: 1, angle: angle, propagate: 0, angle_variance: 0})
          expect(tree.terminus).toVectorEqual([0,1])
        })
      })
    })

    describe("with a single level of children", () => {
      // propagate_to = 1
      it("creates two child elements", () => {
        var tree = new Tree({origin: [0,0], length: 1, angle: 0.0, propagate: 1, angle_variance: 0})
        expect(tree.left_child).toBeInstanceOf(Tree)
        expect(tree.right_child).toBeInstanceOf(Tree)
      })

      it("child element origin equal the parent element's terminus", () => {
        var tree = new Tree({origin: [0,0], length: 1, angle: 0.0, propagate: 1, angle_variance: 0})
        expect(tree.left_child.origin).toVectorEqual(tree.terminus)
        expect(tree.right_child.origin).toVectorEqual(tree.terminus)
      })

      describe("when the angle_variance angle is 0", () => {
        it("the child elements extend directly out of the parent element", () => {
          var tree = new Tree({origin: [0,0], length: 1, angle: 0.0, propagate: 1, angle_variance: 0})
          expect(tree.left_child.terminus).toVectorEqual([2,0])
          expect(tree.right_child.terminus).toVectorEqual([2,0])
        })
      })

      describe("when the angle_variance angle is 90 degrees", () => {
        it("the child elements extend away from the parent at 90 degree angles", () => {
          // 1° × π/180 = radians
          // 90deg & pi/180
          var tree = new Tree({origin: [0,0], length: 1, angle: 0.0, propagate: 1, angle_variance: (90 * (Math.PI / 180)) })

          expect(tree.left_child.terminus).toVectorEqual([1,1])
          expect(tree.right_child.terminus).toVectorEqual([1,-1])
        })
      })

      describe("length", () => {
        it("the child element's lengths decrease by the specified length_decay", () => {
          // 1° × π/180 = radians
          // 90deg & pi/180
          var length = 1
          var length_decay = 1.5
          var tree = new Tree({origin: [0,0], length: length, angle: 0.0, propagate: 1, angle_variance: (90 * (Math.PI / 180)), length_decay: length_decay })

          expect(tree.left_child.length).toEqual(length / length_decay)
          expect(tree.right_child.length).toEqual(length / length_decay)
        })
      })
    })
  })

  describe("vertices", () => {
    describe("with a single-element tree", () => {
      it("generates an array containing the origin an terminus of the single tree element", () => {
        var tree = new Tree({origin: [0,0], length: 1, angle: 0.0, propagate: 0, angle_variance: 0})
        var vertices = tree.vertices()
        expect(vertices).toVectorEqual([0, 0, 1, 0])
      })
    })

    describe("with a tree with one layer of children", () => {
      it("returns an array containing the terminus & origin of each child element", () => {
        var tree = new Tree({origin: [0,0], length: 1, angle: 0.0, propagate: 1, angle_variance: 0})
        var vertices = tree.vertices()
        console.log(vertices)
        expect(vertices).toVectorEqual([0, 0, 1, 0, 1, 0, 2, 0, 1, 0, 2, 0])
      })
    })
  })
})
