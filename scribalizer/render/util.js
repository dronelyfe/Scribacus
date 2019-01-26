const spawn = require ('child_process').spawn;
var storedSpeech;

function onFileLoad(file) {

  var file_path = file.file.path;
  var scribacus_path = dataPath + '/scribacus.py'
  const scribacus = spawn('python3', [scribacus_path, file_path]);
  scribacus.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  scribacus.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });


  scribacus.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    if (code == 0){
      onAnalyze(file_path);
    }
  });

}

function onAnalyze(file_path) {
  
  var scribalizer_path = dataPath + '/scribalizer.py'
  const scribalizer= spawn('python3', [scribalizer_path, file_path]);
  
  scribalizer.stdout.on('data', (data) => {
    storedSpeech = JSON.parse(data);    
    console.log(storedSpeech);
  });

  scribalizer.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  scribalizer.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

}
