var thisP5 = new p5 ( function( sketch ) {
  
  //drawing constants, like bg colour
  const bg = 0; 

  //markov_aurelius variables
  var markov_aurelius;
  var sentence;
  var loadFade = true;
  
  //text rendering variables
  var textVal = 0.0;
  var speed = 1.2;
  var max = 240.0;

  //speechData holds the JSON of NLP data
  var speechLoaded = false;
  var speechData;
  var wordList = new Array();

  //setup occurs on initialization of p5
  //load markov_aurelius, create canvas, create DOM elements
  sketch.setup = function() {

    markov_aurelius = new RiMarkov(3, true, false);
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
      wordList = []; 
    });

    input.position(0, 0);

    grouper = sketch.createRadio();
    grouper.option(); 

    
  };

  //main draw thread, renders things inside canvas
  sketch.draw = function() {

    sketch.background(bg);
    sketch.textSize(30);
    // sketch.text(sketch.frameRate(), window.innerWidth - 50, 50);
    if (speechLoaded == false && loadFade == true && textVal != max ) {
      sketch.drawTextIn();
      if (textVal > 255.0) {
        loadFade = false;
      }
    }

    else if (speechLoaded == false && loadFade == false) {
      sketch.drawTextOut();
      if (textVal <= 1) {
        loadFade = true;
        sentence = sketch.sentenceGen();
      }
    }

    else if (speechLoaded == true && textVal > 0.0) {
      sketch.drawTextOut();
    }

    else if (speechLoaded == true && textVal < 0) {
      for (var i = 0; i < wordList.length; i++) {
        wordList[i].renderIn();
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
    textVal += speed;
    sketch.fill(255, textVal);
    sketch.text(sentence, window.innerWidth/2, window.innerHeight/2);
    sketch.text(" - Markov Aurelius, Probably", window.innerWidth/2, window.innerHeight/1.8);
  };

  //fade markov_aurelius text out
  sketch.drawTextOut = function() {
    sketch.textAlign(sketch.CENTER);
    sketch.textSize(30);
    textVal -= speed;
    sketch.fill(255, textVal);
    sketch.text(sentence, window.innerWidth/2, window.innerHeight/2);
    sketch.text(" - Markov Aurelius, Probably", window.innerWidth/2, window.innerHeight/1.8);
  };

  //generate new sentence for markov_aurelius
  sketch.sentenceGen = function() {
    var sentenceArray = [];
    for (var i = 0; i < 10; i++) {
      sentenceArray.push(markov_aurelius.generateSentence());
    }
    return sketch.random(sentenceArray)
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
      wordList.push(new word(json[i].text, json[i].dep, json[i].pos));
    };
  };

  sketch.changeWordFoci = function(focus) {
    
  }

  //word class definition
 class word {
    //drawing variables, location, destination, opacity, speed, and whether it is to be shown or not.
    constructor(txt, dp, ps) {
      this.focus = [window.innerWidth/2, window.innerHeight/2]
      this.range = 400;
      this.show = true;
      this.coord = [sketch.random((this.focus[0] - this.range), (this.focus[0] + this.range)), sketch.random((this.focus[1] - this.range), (this.focus[1] + this.range))];
      this.speed = sketch.random(0.2, 1.0);
      this.dest = [sketch.random((this.focus[0] - this.range), (this.focus[0] + this.range)), sketch.random((this.focus[1] - this.range), (this.focus[1] + this.range))];
      this.opac = 0;
      this.opacmax = sketch.random(50, 225);
      //data from returned NLP JSON
      this.text = txt;
      this.dep = dp;
      //refers to position in speech, not position in sketch. that is the property of this.coord.
      this.pos = ps;
    }

    updateCoord() {
      if (sketch.dist(this.coord[0], this.coord[1], this.dest[0], this.dest[1]) > 1.0) {
        if(this.coord[0] < this.dest[0] && this.coord[1] < this.dest[1]) {
          this.coord[0] += this.speed;
          this.coord[1] += this.speed;
        }
        else if (this.coord[0] > this.dest[0] && this.coord[1] > this.dest[1]) {
          this.coord[0] -= this.speed;
          this.coord[1] -= this.speed;
        }
        else if (this.coord[0] > this.dest[0] && this.coord[1] < this.dest[1]) {
          this.coord[0] -= this.speed;
          this.coord[1] += this.speed;
        }
        else if (this.coord[0] < this.dest[0] && this.coord[1] > this.dest[1]) {
          this.coord[0] += this.speed;
          this.coord[1] -= this.speed;
        }
      }
      if (sketch.dist(this.coord[0], this.coord[1], this.dest[0], this.dest[1]) <= 1.0) {
        this.setDest(sketch.random((this.focus[0] - this.range), (this.focus[0] + this.range)), sketch.random((this.focus[1] - this.range), (this.focus[1] + this.range)))
      }
    }

    setRange (range) {
      this.range = range;
    }

    setFocus(x, y) {
      this.focus[0] = x;
      this.focus[1] = y;
    }

    setDest(x, y) {
      this.dest[0] = x;
      this.dest[1] = y;
    }

    renderIn() {

      if (this.opac < this.opacmax) {
        this.opac += this.speed;
      }
      sketch.textAlign(sketch.CENTER);
      sketch.textSize(30);
      sketch.fill(255, this.opac);
      sketch.text(this.text, this.coord[0], this.coord[1]);
      this.updateCoord();
    }

  };

});
