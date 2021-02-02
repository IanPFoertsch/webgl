'use strict'
import { RotationUpdate, TranslationUpdate } from "../mouse_input.js"
import {
  multiply4,
  xRotationMatrix,
  yRotationMatrix,
  zRotationmatrix,
  vector_addition,
  vectorMatrixMultiply,
  subtractVectors,
  angle_between_vectors
} from "../matrices.js"


class CameraState {
  constructor() {
    this.focalTarget = [0.0, 0.0, 0.0]
    this.cameraPosition = [0.0, 0.0, -300.0]
  }

  zeroAndSave() {

  }


  updateFromTranslationEvent(update, event) {
    // TODO: When translating, (ie click & dragging view) we should project
    // A ray from camera to focal target onto the x-z horizonatal plane, and scale the
    // X-Z translation based on how zoomed out we are, so that we click & drag a greater
    // amount for a given mouse input when we're very zoomed out.

    this.focalTarget[0] += update.translation[0]
    //todo: scale this by current vertical rotation
    //Z-axis updated from Y-axis mouse input
    this.focalTarget[2] += - update.translation[1]

    this.cameraPosition[0] += update.translation[0]
    //todo: scale this by current vertical rotation
    this.cameraPosition[2] += - update.translation[1]
  }

  updateFromRotationEvent(update, event) {
    this.horizontal_plane_rotation(update)

    var rotation_target_vector = this.focalTarget.concat(1)
    //NOTE: the "vertical" rotation includes both X and Z components.
    // this is because when our view is rotated 90degrees around the vertical y-axis
    // (we're viewing the scene from the "right"), if we attempt to rotate the scene
    // vertically around the x-axis, there is no or muted effect, because we're
    // _on_ the x-axis, so rotating the point about the x-axis doesn't result in much
    // vertical camera motion.

    //TODO - this subtract from ninety degree thing we're doing here seems ham-handed
    //We could likely simplify this by taking the angle to a different vector
    var ninety_degrees = 1.5707963267948966
    //NOTE: We're scaling the input based on how close we are to the various planes
    //For example: when perpendicular to the y-x plane, (basically on the z-axis)
    // perform full x-axis rotataion.

    var camera_location = this.getCameraPosition()

    var angle_to_y_x_plane = ninety_degrees - angle_between_vectors(camera_location, [0,0,1])
    var x_rotation_scaling  = Math.sin(angle_to_y_x_plane)

    var angle_to_y_z_plane = ninety_degrees - angle_between_vectors(camera_location, [1,0,0])
    var z_rotation_scaling  = Math.sin(angle_to_y_z_plane)
    // console.log(this.getCameraPosition())
    var x_rotation = xRotationMatrix((- update.rotation[1] / 20) * x_rotation_scaling, rotation_target_vector)
    // console.log("x-axis", JSON.stringify(update.rotation[0]), "y-axis", JSON.stringify(- update.rotation[1]))
    var z_rotation = zRotationmatrix((- update.rotation[1] / 20) * z_rotation_scaling, rotation_target_vector)
    var y_rotation = yRotationMatrix(update.rotation[0] / 20, rotation_target_vector)
    // console.log("x:", this.matrix_to_string(x_rotation))
    // console.log("z:", this.matrix_to_string(z_rotation))
    var vertical_rotation_matrix = multiply4(x_rotation, z_rotation)
    // console.log("y:", this.matrix_to_string(y_rotation))
    // console.log("v:", this.matrix_to_string(y_rotation))
    var combined_rotation_matrix = multiply4(vertical_rotation_matrix, y_rotation)


    // console.log("v:", this.matrix_to_string(vertical_rotation_matrix))

    var rotated_camera_location = vectorMatrixMultiply(this.cameraPosition.concat(1), combined_rotation_matrix)

    var differential = subtractVectors(rotated_camera_location, this.cameraPosition)

    this.cameraPosition = vector_addition(this.cameraPosition, differential)
  }

  horizontal_plane_rotation(update) {
    //TODO: I think we can simplify this to get rid of the "active" & "existing" camera & focal point positions
    // console.log(update.rotation)
    // horizontal plane rotataion is update.rotation[0] -> this doesn't really
    // follow the x,y convention but it intuitively makes sense, as we're rotating \
    // in the horizontal plane around the y-axis
    var y_axis_rotation = update.rotation[0]
    // console.log(y_axis_rotation)
    // console.log(this.activeCameraPosition)
    // console.log(this.existingCameraPosition)
    //NOTES FOR IMPLEMENTATION - to rotate in the horizontal z-x plane around the vertical y-axis
    // 1. Translate camera and focal point to origin
    // 2. Rotate around the y-axis
    // 3. reverse the translation back to the starting point, plus the rotation
  }


  vertical_rotation() {
    //NOTES FOR IMPLEMENTATION - to rotate vertically around a virtual x-axis.
    // This accomplishes both x and z axis rotation. However we do it around a virtual x-axis
    // 1. Translate camera and focal point to origin
    // 2. Rotate camera -> focal point y-angle back to zero
    // 3. Perform the x-axis rotation
    // 4. Reverse the y-axis rotation
    // 5. Reverse the initial translation
  }

  matrix_to_string(matrix) {
    return `[${matrix[0].toFixed(2)}, ${matrix[1].toFixed(2)}, ${matrix[2].toFixed(2)}, ${matrix[3].toFixed(2)} \n [${matrix[4].toFixed(2)}, ${matrix[5].toFixed(2)}, ${matrix[6].toFixed(2)}, ${matrix[7].toFixed(2)}\n` +
    `[${matrix[8].toFixed(2)}, ${matrix[9].toFixed(2)}, ${matrix[10].toFixed(2)}, ${matrix[11].toFixed(2)} \n [${matrix[12].toFixed(2)}, ${matrix[13].toFixed(2)}, ${matrix[14].toFixed(2)}, ${matrix[15].toFixed(2)}]`
  }

  updateFromEvent(update, event) {
    if (update instanceof RotationUpdate) {
      this.updateFromRotationEvent(update, event)
    } else if (update instanceof TranslationUpdate) {
      this.updateFromTranslationEvent(update, event)
    }

  }

  getFocalTarget() {
    return this.focalTarget.slice()
  }

  getCameraPosition() {
    return this.cameraPosition.slice()
  }
}

export { CameraState }
