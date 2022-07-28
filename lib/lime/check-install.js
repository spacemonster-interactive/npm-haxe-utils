
require('haxe-utils/lib/apply-env');
var vars = require('haxe/lib/vars');
var spawn = require('child_process').spawn;
var limeLibPath = require('haxe-utils/lib/lime/lime-dir');
var loglines = require('haxe-utils/lib/loglines');
var installed = false;

function setupLime(callback, reject) {
  var cp = spawn( vars.neko.path, ['run.n'], {
    cwd: limeLibPath
  });
  
  cp.stdout.on('data', (data) => {
    var output = data.toString('utf8');
    //console.log("data:" + output);
    if (output.indexOf("Lime Command-Line Tools") != -1){
      installed = true;
    }
  });
  cp.stderr.on('data', (data) => {
    loglines("data:" + data.toString('utf8'), true);
  });
  cp.on('error', function(err){
      console.error("err:" + err);
      if (reject != null) reject();
  });
  cp.on('close', function(e){
    if (installed == true){
      if (callback != null) callback();
    } 
    else {
      if (reject != null) reject();
    }
  });
}




module.exports = () => {
  return new Promise(function(resolve, reject) {
    setupLime(resolve, reject)
  });
}