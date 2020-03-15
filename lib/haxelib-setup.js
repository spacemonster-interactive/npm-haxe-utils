var haxelib = require('haxe').haxelib;

var haxelibProcess = haxelib( "setup", "node_modules\\haxe\\.haxelib" );

haxelibProcess.stdout.on('data', (data) => {
  console.log('Out: '+data.toString('utf8'));
});
haxelibProcess.stderr.on('data', (data) => {
    console.log('Error: '+data.toString('utf8'));
});