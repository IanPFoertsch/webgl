"use strict"

import {
  multiply4,
  perspectiveMatrix,
  identityMatrix,
  xRotate,
  yRotate,
  translate,
  inverse,
  lookAt
} from "./matrices.js"

class ViewMatrixManager {

  static get ZNEAR() { return 1 }
  static get ZFAR() { return 2000 }
  static get FIELD_OF_VIEW_IN_RADIANS() { return 1.5 }


  constructor(canvas, gl, state) {
    this.canvas = canvas
    this.gl = gl
    this.state = state
    this.translationValue = []

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
    return - (
      this.negateYTranslation(translationValues) *
      Math.sin( this.state.getRotation()[1])
    )
  }

  zTranslation(translationValues) {
    //NOTE: For similar reasons to correcting by the cos(y-angle) when computing the Z translation
    return  - (
      this.negateYTranslation(translationValues) *
      Math.cos( this.state.getRotation()[1])
    ) + 200 // add our initial viewpoint zoomed out
  }

  negateYTranslation(translationValues) {
    //NOTE: the Y translation value is negative as we draw mouse to bottom of screen,
    // However this corresponds to moving "forward" on the Z-axis when we click & drag
    // to move the camera, so we negate it
    return - translationValues[1]
  }

  updateViewTranslation(cameraMatrix) {
    var translationValues = this.state.getTranslation()

    cameraMatrix = translate(
      cameraMatrix,
      this.xTranslation(translationValues),
      this.yTranslation(translationValues),
      this.zTranslation(translationValues) // Z translation -> need to scale this as well by cos(y-angle?)
    )
    return cameraMatrix
  }

  updateViewRotation(cameraMatrix) {
    cameraMatrix = yRotate(cameraMatrix, this.state.getRotation()[0])
    cameraMatrix = xRotate(cameraMatrix, this.state.getRotation()[1])

    return cameraMatrix
  }

  getUpdatedViewMatrix() {
    var perspective = perspectiveMatrix(
      ViewMatrixManager.FIELD_OF_VIEW_IN_RADIANS,
      this.aspect,
      ViewMatrixManager.ZNEAR,
      ViewMatrixManager.ZFAR
    )
    var cameraMatrix = identityMatrix()


    cameraMatrix = this.updateViewRotation(cameraMatrix, this.state)
    cameraMatrix = this.updateViewTranslation(cameraMatrix, this.state)
    console.log(this.state.getRotation()[1])

    var viewMatrix = inverse(cameraMatrix)
    var viewProjectionMatrix = multiply4(perspective, viewMatrix)

    return viewProjectionMatrix
  }

}

export { ViewMatrixManager }
