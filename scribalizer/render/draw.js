var currentspeech;
var markov_aurelius;
var meditations;
var sentence;
var value = 0.0;
var speed = 1.2;
var max = 255

function setup() {

  markov_aurelius = new RiMarkov(4, true, false);
  textloc = dataPath + '/marcusaurelius.txt';
  markov_aurelius.loadFrom(textloc, function(){
    console.log(markov_aurelius);
    sentence = sentenceGen();
  });

  createCanvas(windowWidth, windowHeight);
  noStroke();
  background(0);
  input = createFileInput(onFileLoad);
  input.position(0, 0);

}

function draw() {

  background(0);
  textSize(30);
  drawTextIn();

};

function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

}

function drawTextIn() {
  textAlign(CENTER);
  textSize(30);
  value += speed;
  fill(255, value);
  text(sentence, windowWidth/2, windowHeight/2);
  text(" - Markov Aurelius, Probably", windowWidth/2, windowHeight/1.8);
}

function drawTextOut() {
  textAlign(CENTER);
  textSize(30);
  value -= speed;
  fill(255, value);
  text(sentence, windowWidth/2, windowHeight/2);
  text(" - Markov Aurelius, Probably", windowWidth/2, windowHeight/1.8);
}

function sentenceGen() {
  return markov_aurelius.generateSentences(1)
}
