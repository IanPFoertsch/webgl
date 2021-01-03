"use strict"

import {
  multiply4,
  perspectiveMatrix,
  inverse,
  lookAt,
  xAxisRotationAroundPoint
} from "./matrices.js"

class ViewMatrixManager {

  static get ZNEAR() { return 1 }
  static get ZFAR() { return 2000 }
  static get FIELD_OF_VIEW_IN_RADIANS() { return 1.5 }


  constructor(canvas, gl, state) {
    this.canvas = canvas
    this.gl = gl
    this.state = state
    this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
  }

  xTranslation(translationValues) { return - translationValues[0] }

  yTranslation(translationValues) {
    //NOTE: About the y-value translation we're applying here. This is complicated because of the
    // transformation between the camera and the world space. We're inverting the view to
    // move the "world" in front of the camera, rather than moving the camera around.
    //When we move the camera in the z-axis, it basically zooms in and out,
    // rather than moving linearly along the Z-X horizontal plane, because we're
    // literally moving a tilted viewport along z.
    // Therefore, when we want to move along a constant "horizontal" x-z plane, we need to apply
    // a y-component to the translation vector, to move vertically up and down to compensate.
    // this y-vector can be derived from our current y-rotation, basically at high y-rotation, we want a large
    // y-vector component, and vice versa at small y-rotation.
    // This is computed simply with Sin(y-rotation)
    // If I had a more advanced understanding of how our view is calculated, we could probably simplify this massively.
    // TODO: turn this into a matrix?
    return - (
      this.negateYTranslation(translationValues) // *
      // Math.sin( this.state.getRotation()[1])
    )
  }

  zTranslation(translationValues) {
    //NOTE: For similar reasons to correcting by the cos(y-angle) when computing the Z translation
    return  - (
      this.negateYTranslation(translationValues) // *
      // Math.cos( this.state.getRotation()[1])
    ) // add our initial viewpoint zoomed out
  }

  negateYTranslation(translationValues) {
    //NOTE: the Y translation value is negative as we draw mouse to bottom of screen,
    // However this corresponds to moving "forward" on the Z-axis when we click & drag
    // to move the camera, so we negate it
    return - translationValues[1]
  }

  translateVector(vector, translationValues) {
    //use vector multiplication here
    return [
      vector[0] + this.xTranslation(translationValues),
      vector[1] + this.yTranslation(translationValues),
      vector[2] + this.zTranslation(translationValues),
    ]
  }

  verticalCameraRotation(cameraPosition, angleInRadians, target) {

    return xAxisRotationAroundPoint(cameraPosition, angleInRadians, target)
  }

  updateViewRotation(cameraMatrix, rotationPoint) {
    //rotation point is a 3-vector (converted to 4-vector at calculation time)
    //describing the point we're rotating around: for the moment we can consider
    //this to be a spot on the x-z plane

    //mix up here: we apply the X rotation value to the Y-rotation function. Why exactly?
    // B/c we're rotation _AROUND_ the Y-axis, which results in "horizontal", or x-z plane rotation
    // cameraMatrix = yRotate(cameraMatrix, this.state.getRotation()[0])

    // cameraMatrix = xRotate(cameraMatrix, this.state.getRotation()[1])

    // return cameraMatrix
  }

  getUpdatedViewMatrix() {
    var perspective = perspectiveMatrix(
      ViewMatrixManager.FIELD_OF_VIEW_IN_RADIANS,
      this.aspect,
      ViewMatrixManager.ZNEAR,
      ViewMatrixManager.ZFAR
    )
    var target = this.state.getFocalTarget()
    //now: update the camera & target matrices when we transate
    // cameraMatrix = this.updateViewRotation(cameraMatrix, this.state)

    var cameraPosition = this.state.getCameraPosition()
    //TODO: This should be implemented in state when we're updating from events: the viewMatrixManager should just
    //be responsible for generating the new matrix from the state.
    // cameraPosition = this.verticalCameraRotation(this.state.cameraPosition, this.state.getRotation()[1], target)
    // console.log(cameraPosition)
    // console.log("cameraPosition", cameraPosition)
    // this.verticalCameraRotation(this.state.cameraPosition, this.state.getRotation()[1], target)
    var cameraMatrix = lookAt(cameraPosition, target, [0, 1, 0])

    var viewMatrix = inverse(cameraMatrix)

    var viewProjectionMatrix = multiply4(perspective, viewMatrix)

    return viewProjectionMatrix
  }

}

export { ViewMatrixManager }
