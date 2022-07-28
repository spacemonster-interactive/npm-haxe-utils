var haxelib = require('haxe').haxelib;

function setup(callback){
  return new Promise(function(resolve, reject) {
    var haxelibProcess = haxelib( "setup", "node_modules\\haxe\\.haxelib" );

    haxelibProcess.stdout.on('data', (data) => {
      console.log('Out: '+data.toString('utf8'));
      resolve();
    });
    haxelibProcess.stderr.on('data', (data) => {
        console.log('Error: '+data.toString('utf8'));
        reject();
    });
  });
}

module.exports = setup;