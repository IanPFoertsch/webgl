"use strict"

class Object {
  constructor(text) {
    this.data = []
    this.vertex_data = []
    this.texture_data = []
    this.normal_data = []
    this.parse_object(text)
  }

  parse_object(object_text) {
    var lines = object_text.split("\n")
    // console.log(lines)
    lines.forEach((line) => {
      if (line.startsWith("v ")) {
        this.add_vertex(
          this.parse_vertex(line)
        )
      } else if (line.startsWith("vt ")) {
        this.add_vertex_texture(
          this.parse_vertex_texture(line)
        )
      } else if (line.startsWith("vn ")) {
        this.add_normal(
          this.parse_normal(line)
        )
      } else if (line.startsWith("f ")) {
        this.parse_face(line)
      } else {
        console.log(`unrecognized line ${line}`)
      }
    })
  }

  parse_normal(line) {
    return line.split(" ").slice(1,4)
  }

  parse_vertex(line) {
    return line.split(" ").slice(1,4)
  }

  parse_vertex_texture(line) {
    return line.split(" ").slice(1,3)
  }

  parse_face(line) {
    // faces are formatted as
    // f  v/t/n v/t/n v/t/n v/t/n
    var faces = line.split(" ").slice(1,5)
    //get the vertex value from the vertex coordinates,
    // don't worry about the normals for now
    // the .obj files vertexes are listed in counter-clockwise
    // order of a square, so like this:
    // 1 - 4
    // |   |
    // 2 - 3
    // We need to create two triangles in counter-clockwise order,
    // so for a list of vertices 1,2,3,4, that would become 2 triangles:
    // Triangle A : 1, 2, 3
    // Triangle B : 1, 3, 4
    var face_data = faces.map((face) => { return face.split("/")})

    var triangle_one = this.parse_triangle(
      face_data[0],
      face_data[1],
      face_data[2]
    )
  }

  parse_triangle(face_one, face_two, face_three) {
    var vertex_coordinates =  [ face_one[0], face_two[0], face_three[0] ]
    var data = vertex_coordinates.map((coordinate) => {
      // for each coordinate, get the matching vertex data from the list of vertices
      return this.vertex_data[coordinate - 1]
    })
    return data
  }

  add_vertex(vertex) {
    this.vertex_data.push(vertex)
  }

  add_vertex_texture(vertex_texture) {
    this.texture_data.push(vertex_texture)
  }

  add_normal(normal) {
    this.normal_data.push(normal)
  }
}


class GraphicsObject {

}


export { Object }
