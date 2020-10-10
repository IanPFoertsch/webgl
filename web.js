


function main() {
  const canvas = document.querySelector("#glCanvas");
  // Initialize the GL context
  const gl = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  updateTheCanvas()
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
   }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    xmlHttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xmlHttp.send(null);
}

function updateTheCanvas() {
  console.log("running")
  const canvas = document.querySelector("#glCanvas");
  const gl = canvas.getContext("webgl");

  gl.clearColor(Math.random(), Math.random(), Math.random(), 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function iterate() {

  updateTheCanvas()
}

window.setInterval(iterate, 10000)
console.log('LOOK HERE')
window.onload = main;
