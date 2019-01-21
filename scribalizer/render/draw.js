function setup() {

  createCanvas(windowWidth, windowHeight)
  // console.log(`${windowWidth}, ${windowHeight}`)
  noStroke()
  background(0)

  input = createFileInput(onFileLoad)
  input.position(0, 0)

}

function draw() {

  background(0)

}

function mousePressed() {

}

function windowResized() {

  resizeCanvas(windowWidth, windowHeight)

}
