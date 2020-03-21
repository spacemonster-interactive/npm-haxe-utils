const vars = require('haxe/lib/vars');
var haxelib = require('haxe').haxelib;

var haxelibProcess = haxelib( "setup", vars.env.HAXELIB_PATH);

haxelibProcess.stdout.on('data', (data) => {
  console.log('Out: '+data.toString('utf8'));
});
haxelibProcess.stderr.on('data', (data) => {
    console.log('Error: '+data.toString('utf8'));
});