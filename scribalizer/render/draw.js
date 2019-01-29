var thisP5 = new p5 ( function( sketch ) { 

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
  var groupings = new Array();

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
    sketch.background(26,20,35);

    //create file input button, with a callback that invokes the analysis scripts
    input = sketch.createFileInput(function(file) {
      speechLoaded = false;
      processFile(file);
      wordList = []; 
    });

    input.position(0, 0);
    sketch.fill(255);

    separator = sketch.createButton('Scribalize!');
    separator.mousePressed(sketch.separatorTrigger);
    separator.position(0, 50);
    separator.hide();

    toggleText = sketch.createCheckbox('Toggle Text', true);
    toggleText.position(0, 100);
    toggleText.hide();
  };

  //main draw thread, renders things inside canvas
  sketch.draw = function() {

    //sketch.background(26,20,35);
    sketch.background(255);
    sketch.textSize(20);
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
      for (var i = 0; i < groupings.length; i++) {
        groupings[i].renderGrouping();
      }
    }
  };

  //on window resize, adjust canvas accordingly
  sketch.windowResized = function() {

    sketch.resizeCanvas(window.innerWidth, window.innerHeight);

  };

  sketch.separatorTrigger = function () {
    var tagList = [];
    for (var i = 0; i < wordList.length; i++) {
      if (tagList.includes(wordList[i].getPos()) == false) {
        tagList.push(wordList[i].getPos());
      }
    }
  console.log(tagList);
  groupings = []; 
  var tagLoc = [sketch.random(window.innerWidth/2 - 300, window.innerWidth/2 + 300), sketch.random(window.innerHeight/2 - 300, window.innerHeight/2 + 300)];
    for (var i = 0; i < tagList.length; i++) {
      sketch.changeWordFoci(tagLoc, tagList[i], i);
      tagLoc = [sketch.random(window.innerWidth/2 - 300, window.innerWidth/2 + 300), sketch.random(window.innerHeight/2 - 300, window.innerHeight/2 + 300)];
    }
    console.log(groupings);
  }

  //fade markov_aurelius text in
  sketch.drawTextIn = function() {
    sketch.textAlign(sketch.CENTER);
    sketch.textSize(20);
    textVal += speed;
    sketch.fill(183, 93, 105, textVal);
    sketch.text(sentence, window.innerWidth/2, window.innerHeight/2);
    sketch.text(" - Markov Aurelius, Probably", window.innerWidth/2, window.innerHeight/1.8);
  };

  //fade markov_aurelius text out
  sketch.drawTextOut = function() {
    sketch.textAlign(sketch.CENTER);
    sketch.textSize(20);
    textVal -= speed;
    sketch.fill(183, 93, 105, textVal);
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
    separator.show();
    toggleText.show();
  };

  //create new instance of word for each token in NLP JSON
  sketch.buildWordArray = function(json) {
    for (i in json) {
      wordList.push(new word(json[i].text, json[i].dep, json[i].pos));
    };
  };

  sketch.changeWordFoci = function(focus, tag, group) {
    groupings.push(new grouping(focus[0], focus[1], 50, tag));
    for (var i = 0; i < wordList.length; i++) {
       if (wordList[i].getPos() == tag) {
         groupings[group].addChild(wordList[i]);
         wordList[i].setFocus(focus[0], focus[1]);
         //wordList[i].setSpeed(sketch.random(0.2, 1.0));
       }
    }
  }

  //word class definition
 class word {
    //drawing variables, location, destination, opacity, speed, and whether it is to be shown or not.
    constructor(txt, dp, ps) {
      this.focus = sketch.createVector(window.innerWidth/2, window.innerHeight/2);
      this.range = 50;
      this.show = true;
      this.coord = sketch.createVector(sketch.random((this.focus.x - this.range), (this.focus.x + this.range)), sketch.random((this.focus.y - this.range), (this.focus.y + this.range)));
      this.speed = 1.0; //sketch.random(0.2, 1.0);
      this.dest = sketch.createVector(sketch.random((this.focus.x - this.range), (this.focus.x + this.range)), sketch.random((this.focus.y - this.range), (this.focus.y + this.range)));
      this.opac = 0;
      this.opacmax = sketch.random(50, 225);
      //data from returned NLP JSON
      this.text = txt;
      this.dep = dp;
      //refers to position in speech, not position in sketch. that is the property of this.coord.
      this.pos = ps;
    }

    updateCoord() {
      if (sketch.dist(this.coord.x, this.coord.y, this.dest.x, this.dest.y) > 0.0) {
        if(this.coord.x < this.dest.x && this.coord.y < this.dest.y) {
          this.coord.x += this.speed;
          this.coord.y += this.speed;
        }
        else if (this.coord.x > this.dest.x && this.coord.y > this.dest.y) {
          this.coord.x -= this.speed;
          this.coord.y -= this.speed;
        }
        else if (this.coord.x > this.dest.x && this.coord.y < this.dest.y) {
          this.coord.x -= this.speed;
          this.coord.y += this.speed;
        }
        else if (this.coord.x < this.dest.x && this.coord.y > this.dest.y) {
          this.coord.x += this.speed;
          this.coord.y -= this.speed;
        }
      }
      if (sketch.dist(this.coord.x, this.coord.y, this.dest.x, this.dest.y) <= 1.0 ||
          sketch.dist(this.coord.x, this.coord.y, this.dest.x, this.dest.y) <= 0.0 ) {
        this.setDest(sketch.random((this.focus.x - this.range), (this.focus.x + this.range)), sketch.random((this.focus.y - this.range), (this.focus.y + this.range)))
      }
    }
    renderIn() {

      if (this.opac < this.opacmax) {
        this.opac += this.speed;
      }
      if (toggleText.checked() == false) {
        sketch.textAlign(sketch.CENTER);
        sketch.textSize(20);
        sketch.fill(0, this.opac);
        sketch.text(this.text, this.coord.x, this.coord.y);
      }
      this.updateCoord();
    } 
   
    setSpeed(speed) {
      this.speed = speed;
    }

    setRange (range) {
      this.range = range;
    }

    setFocus(x, y) {
      this.focus.x = x;
      this.focus.y = y;
    }

    setDest(x, y) {
      this.dest.x = x;
      this.dest.y = y;
    }

    getCoord() {
      return this.coord;
    } 

    getPos() {
      return this.pos;
    }

  };

  class grouping {
    constructor(x, y, range, word){
      this.loc = sketch.createVector(x, y);
      this.range = 50;
      this.opacity = 255;
      this.range = range;
      this.word = word;
      this.children = [];
    }

    addChild(child) {
      this.children.push(child);
    }

    setRange(range) {
      this.range = range;
    }

    setLoc(x, y) {
      this.loc.x = x;
      this.loc.y = y;
    }

    renderGrouping() {

      sketch.fill(119, 76, 96, 255);
      sketch.textAlign(sketch.CENTER);
      sketch.textSize(20);
      sketch.text(this.word, this.loc.x, this.loc.y - (this.range + 20));

      sketch.fill(119, 76, 96, 150);
      sketch.ellipse(this.loc.x, this.loc.y, this.range*2, this.range*2);
      
      for (var i = 0; i < this.children.length; i++) {
        if (sketch.dist(this.loc.x, this.loc.y, this.children[i].getCoord().x, this.children[i].getCoord().y) < this.range) {
          sketch.stroke(255, 100);
          sketch.line(this.loc.x, this.loc.y, this.children[i].getCoord().x, this.children[i].getCoord().y);
          sketch.noStroke();
        }
      }
    }

  };

});
