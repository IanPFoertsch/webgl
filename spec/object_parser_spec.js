"use strict"
// var fs = require 'fs'
import { ObjectParser } from "../src/object_parser.js"


// NOTE: https://v4.webpack.js.org/loaders/raw-loader/
// This should really be handled automatically from the webpack config
// but I can't get it to work from there, so we hard-code the
// "raw-loader!<file_path) keyword into the import statement
import cube_text from "raw-loader!../resources/cube.obj"

fdescribe("parse_object", () => {
  it("reads the file", () => {
    ObjectParser.parse_object(cube_text)
  })
})
