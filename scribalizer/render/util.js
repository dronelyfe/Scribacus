
function processFile(file) {
  const spawn = require ('child_process').spawn;
  var storedSpeech;

  function onFileLoad(file) {

    var file_path = file.file.path;
    var scribacus_path = dataPath + '/scribacus.py'
    const scribacus = spawn('python', [scribacus_path, file_path]);
    scribacus.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    scribacus.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    scribacus.on('close', (code) => {
      if (code == 0){
        onAnalyze(file_path);
      }
    });

  }

  function onAnalyze(file_path) {
    
    var scribalizer_path = dataPath + '/scribalizer.py'
    const scribalizer= spawn('python', [scribalizer_path, file_path]);
    let chunks = [];

    scribalizer.stdout.on('data', (data) => {
        chunks.push(data);
    }).on('end', function() {
      let tempdata = Buffer.concat(chunks);
      storedSpeech = JSON.parse(tempdata);
    });

    scribalizer.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    scribalizer.on('close', (code) => {
      if (code == 0) {
        thisP5.setSpeechData(storedSpeech);
      }
    });

  }

  onFileLoad(file);
}