var thisP5 = new p5 ( function( sketch ) {
  
  //drawing constants, like bg colour
  const bg = 0; 

  //markov_aurelius variables
  var markov_aurelius;
  var sentence;
  
  //text rendering variables
  var value = 0.0;
  var speed = 1.2;
  var posGroup;
  var tagGroup;

  //speechData holds the JSON of NLP data
  var speechLoaded = false;
  var speechData;
  var wordList = new Array();

  //setup occurs on initialization of p5
  //load markov_aurelius, create canvas, create DOM elements
  sketch.setup = function() {

    markov_aurelius = new RiMarkov(4, true, false);
    textloc = dataPath + '/marcusaurelius.txt';
    
    markov_aurelius.loadFrom(textloc, function() {
      console.log(markov_aurelius);
      sentence = sketch.sentenceGen();
    });

    sketch.createCanvas(window.innerWidth, window.innerHeight);
    sketch.noStroke();
    sketch.background(bg);

    //create file input button, with a callback that invokes the analysis scripts
    input = sketch.createFileInput(function(file) {
      speechLoaded = false;
      processFile(file); 
    });

    input.position(0, 0);
  };

  //main draw thread, renders things inside canvas
  sketch.draw = function() {

    sketch.background(bg);
    sketch.textSize(30);

    if (speechLoaded == false) {
      sketch.drawTextIn();
    }

    else if (value > 0.0) {
      sketch.drawTextOut();
    }

    else if (value < 0) {
      for (var i = 0; i < wordList.length; i++) {
        wordList[i].renderCode();
      }
    }
  };

  //on window resize, adjust canvas accordingly
  sketch.windowResized = function() {

    sketch.resizeCanvas(window.innerWidth, window.innerHeight);

  };

  //fade markov_aurelius text in
  sketch.drawTextIn = function() {
    sketch.textAlign(sketch.CENTER);
    sketch.textSize(30);
    value += speed;
    sketch.fill(255, value);
    sketch.text(sentence, window.innerWidth/2, window.innerHeight/2);
    sketch.text(" - Markov Aurelius, Probably", window.innerWidth/2, window.innerHeight/1.8);
  };

  //fade markov_aurelius text out
  sketch.drawTextOut = function() {
    sketch.textAlign(sketch.CENTER);
    sketch.textSize(30);
    value -= speed;
    sketch.fill(255, value);
    sketch.text(sentence, window.innerWidth/2, window.innerHeight/2);
    sketch.text(" - Markov Aurelius, Probably", window.innerWidth/2, window.innerHeight/1.8);
  };

  //generate new sentence for markov_aurelius
  sketch.sentenceGen = function() {
    return markov_aurelius.generateSentences(1)
  };

  //setter function for processFile to use for asynchronously passing speech data
  sketch.setSpeechData = function (data) {
    speechData = data;
    speechLoaded = true;

    sketch.buildWordArray(speechData);
  };

  //create new instance of word for each token in NLP JSON
  sketch.buildWordArray = function(json) {
    for (i in json) {
      wordList.push(new word(json[i].text, json[i].tag, json[i].pos));
    };
  };

  //word class definition
 class word {
    //drawing variables, location, destination, opacity, speed, and whether it is to be shown or not.
    constructor(txt, tg, ps) {
      this.show = true;
      this.coord = [window.innerWidth/2, window.innerHeight/2];
      this.speed = 1.2;
      this.dest = [window.innerWidth/2, window.innerHeight/2];
      this.opac = 255;

      //data from returned NLP JSON
      this.text = txt;
      this.tag = tg;
      //refers to position in speech, not position in sketch. that is the property of this.coord.
      this.pos = ps;
    }

    renderCode() {
          sketch.textAlign(sketch.CENTER);
          sketch.textSize(30);
          sketch.fill(255);
          sketch.text(this.text, this.coord[0], this.coord[1]);
    }

  };

});
