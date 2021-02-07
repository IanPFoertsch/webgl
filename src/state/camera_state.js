'use strict'
import { RotationUpdate, TranslationUpdate } from "../mouse_input.js"
import {
  multiply4,
  xRotationMatrix,
  yRotationMatrix,
  zRotationmatrix,
  vector_addition,
  vector_inverse,
  vectorMatrixMultiply,
  vector_subtraction,
  angle_between_vectors
} from "../matrices.js"

// degrees => radians
// radians = degrees * (PI/180)
var degrees_to_radians = function(degrees) {
  return degrees * (Math.PI/180.0)
}

const ninety_degrees = degrees_to_radians(90)


var matrix_to_string = function(matrix) {
  return `[${matrix[0].toFixed(2)}, ${matrix[1].toFixed(2)}, ${matrix[2].toFixed(2)}, ${matrix[3].toFixed(2)} \n [${matrix[4].toFixed(2)}, ${matrix[5].toFixed(2)}, ${matrix[6].toFixed(2)}, ${matrix[7].toFixed(2)}\n` +
  `[${matrix[8].toFixed(2)}, ${matrix[9].toFixed(2)}, ${matrix[10].toFixed(2)}, ${matrix[11].toFixed(2)} \n [${matrix[12].toFixed(2)}, ${matrix[13].toFixed(2)}, ${matrix[14].toFixed(2)}, ${matrix[15].toFixed(2)}]`
}


var angle_to_z_axis = function(camera_position_at_origin) {
  return ninety_degrees - angle_between_vectors(
    vector_inverse(camera_position_at_origin), [1, 0, 0]
  )
}

class CameraState {
  constructor() {
    this.vertical_rotation = 0
    this.horizontal_rotation = 0
    this.zoom = -300
    this.translation = [0, 0, 0]
    this.focalTarget = [0.0, 0.0, 0.0]
    this.cameraPosition = [300, 0.0, 0]
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

  updateFromRotationEvent(update) {
    // this.horizontal_planvar angle_to_z_axis = angle_between_vectors(vector_inverse(camera_position_at_origin), [0, 0, 1])e_rotation(update)

    var rotation_target_vector = this.focalTarget.concat(1)

    var camera_location = this.getCameraPosition()

    this.cameraPosition = this.horizontal_plane_rotation(update)
  }

  horizontal_plane_rotation(update) {

    // horizontal plane rotataion is update.rotation[0] -> this doesn't really
    // follow the x,y convention but it intuitively makes sense, as we're rotating \
    // in the horizontal plane around the y-axis

    //NOTES FOR IMPLEMENTATION - to rotate in the horizontal z-x plane around the vertical y-axis
    // 1. Translate camera and focal point to origin
    //   a. get diff between camera and focal point
    // var camera_relative_to_focus = vector_subtraction(this.cameraPosition, this.focalTarget)

    var camera_position_at_origin = vector_subtraction(this.cameraPosition, this.focalTarget)

    //rotate current y-axis rotation so that camera is dead-on to x-axis (basically aligned to z-axis)
    // get current angle to x-axis = angle_between_vectors((inverse of camera_position_at_origin), [1, 0, 0]

    var correction_angle = angle_to_z_axis(camera_position_at_origin)
    console.log("the correction angle: ", correction_angle)

    var rotated_to_straight_on_to_x = vectorMatrixMultiply(
      camera_position_at_origin.concat(1),
      yRotationMatrix(- correction_angle)
    )
    // console.log(rotated_to_straight_on_to_x)

    var vertical_rotation = xRotationMatrix(update.rotation[1] / 200) // x-axis-rotataion

    var horizontal_rotation = yRotationMatrix(update.rotation[0] / 200) // y-axis-rotation
    var rotation_matrix = multiply4(horizontal_rotation, vertical_rotation)
    console.log("the rotation matrix:\n", matrix_to_string(rotation_matrix))

    var rotated_camera_position_at_origin = vectorMatrixMultiply(
      rotated_to_straight_on_to_x,
      vertical_rotation
    )
    console.log("rotated_camera_position_at_origin", rotated_camera_position_at_origin)
    // var rotated = vectorMatrixMultiply(
    //   this.cameraPosition,
    //   vertical_rotation
    // ).slice(0,3)
    // console.log(rotated)

    // now un-rotate the y-axis rotation
    var un_rotated = vectorMatrixMultiply(
      rotated_camera_position_at_origin,
      yRotationMatrix(correction_angle)
    ).slice(0,3)

    console.log("the un rotated position", un_rotated)
    //where is x-axis change coming from?
    //z-axis changes present here
    // console.log(un_rotated[0])

    var new_camera_position = vector_addition(
      un_rotated,
      this.focalTarget
    )

    return new_camera_position
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

export { CameraState, angle_to_z_axis }
