
require('./apply-env');
var path = require('path');
var vars = require('haxe/lib/vars');
var spawn = require('child_process').spawn;
var limeLibPath = require('./lime-dir');
var loglines = require('./loglines');
console.log('setupLime1');

function setupLime(callback, reject) {
  var cp = spawn( vars.neko.path, ['run.n', 'setup', '-y'], {
    cwd: limeLibPath
  });
  
  cp.stdout.on('data', (data) => {
    console.log(data.toString('utf8'));
  });
  cp.stderr.on('data', (data) => {
    loglines("data:" + data.toString('utf8'), true);
  });
  cp.on('error', function(err){
      console.error("err:" + err);
      if (reject != null) reject();
  });
  cp.on('close', function(e){
    if (callback != null) callback();
  });
}




module.exports = () => {
  return new Promise(function(resolve, reject) {
    setupLime(resolve, reject)
  });
}