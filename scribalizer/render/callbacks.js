const spawn = require ('child_process').spawn;

function onFileLoad(file) {

  var file_path = file.file.path;

  const scribacus = spawn('python3',["/home/dronelyfe/Documents/Scribacus/scribalizer/render/scribacus.py", file_path]);
  scribacus.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  scribacus.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });


  scribacus.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

}
