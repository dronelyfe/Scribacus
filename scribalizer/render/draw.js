var thisP5 = new p5 ( function( sketch ) {
  var markov_aurelius;
  var sentence;
  //text rendering variables
  var value = 0.0;
  var speed = 1.2;
  var speechLoaded = false;

  var speechData;

  sketch.setup = function() {

    markov_aurelius = new RiMarkov(4, true, false);
    textloc = dataPath + '/marcusaurelius.txt';
    
    markov_aurelius.loadFrom(textloc, function(){
      console.log(markov_aurelius);
      sentence = sketch.sentenceGen();
    });

    sketch.createCanvas(window.innerWidth, window.innerHeight);
    sketch.noStroke();
    sketch.background(0);

    input = sketch.createFileInput(function(file){
      speechLoaded = false;
      speechData = processFile(file); 
      if (speechData !== null) {
        speechLoaded = true;
      }
    });
    input.position(0, 0);
  };

  sketch.draw = function() {

    sketch.background(0);
    sketch.textSize(30);

    if (speechLoaded == false) {
      sketch.drawTextIn();
    }
    else {
      sketch.drawTextOut();
    }
  };

  sketch.windowResized = function() {

    sketch.resizeCanvas(window.innerWidth, window.innerHeight);

  };

  sketch.drawTextIn = function() {
    sketch.textAlign(sketch.CENTER);
    sketch.textSize(30);
    value += speed;
    sketch.fill(255, value);
    sketch.text(sentence, window.innerWidth/2, window.innerHeight/2);
    sketch.text(" - Markov Aurelius, Probably", window.innerWidth/2, window.innerHeight/1.8);
  };

  sketch.drawTextOut = function() {
    sketch.textAlign(sketch.CENTER);
    sketch.textSize(30);
    value -= speed;
    sketch.fill(255, value);
    sketch.text(sentence, window.innerWidth/2, window.innerHeight/2);
    sketch.text(" - Markov Aurelius, Probably", window.innerWidth/2, window.innerHeight/1.8);
  };

  sketch.sentenceGen = function() {
    return markov_aurelius.generateSentences(1)
  };
});
