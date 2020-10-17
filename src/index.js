"use strict"
import { initDemo } from './intro.js'

function component() {
  const element = document.createElement('div');
  console.log(convertToRadians(90))

  element.innerHTML = "hello world!"
  return element
}


window.onload = initDemo;
