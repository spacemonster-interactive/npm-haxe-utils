require('./apply-env');

const chalk = require('chalk')

var haxe = require('haxe').haxe;
var haxelib = require('haxe').haxelib;

module.exports = (callback) => {
  haxeVersion(() => {
    haxelibVersion(() => {
      haxelibList(callback);
    });
  });
}

function haxeVersion(callback){
  var _haxeVersion = haxe( "-version" );
  _haxeVersion.stdout.on('data', (data) => {
    console.log(
      '->',
      chalk.blueBright('Building with Haxe:'),
      chalk.white(data.toString('utf8'))
    )
  });
  _haxeVersion.on('exit', (data) => {
    if (callback !== undefined) callback();
  });
}


function haxelibVersion(callback){
  var _haxelibVersion = haxelib( "version" );
  _haxelibVersion.stdout.on('data', (data) => {
    console.log(
      '->',
      chalk.blueBright('Haxelib Version:'),
      chalk.white(data.toString('utf8'))
    )
  });
  _haxelibVersion.on('exit', (data) => {
    if (callback !== undefined) callback();
  });
}

function haxelibList(callback){
  var _haxelibList = haxelib( "list" );
  var list = "";
  _haxelibList.stdout.on('data', (data) => {
    list+=data.toString('utf8');
  });
  _haxelibList.on('exit', (data) => {
    var lines = list.split("\n");
    for (var i = 0; i < lines.length; i++){
      if (lines[i].indexOf(":") == -1) continue;
      var split1 = lines[i].split(':');
      var name = split1[0];
      var versions = split1[1];
      var versionSplit = versions.split("[");
      if (versionSplit.length >= 2){
        var versionSplit2 = versionSplit[1].split("]");
        versions = chalk.grey(versionSplit[0]) + chalk.white("[" + versionSplit2[0] + "]") + chalk.grey(versionSplit2[1]);
      } else {
        versions = chalk.white("[" + versions + "]");
      }
      lines[i] = chalk.green(name) + ":" + versions;
    }
    list = lines.join("\n"); 
    console.log(
      '->',
      chalk.blueBright('Dependencies List:'),
      '\n' + list
    )
    if (callback !== undefined) callback();
  });
}