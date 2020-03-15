const fs = require('fs-extra')
var vars = require('haxe/lib/vars');
var haxe = require('haxe').haxe;
var haxelib = require('haxe').haxelib;
var path = require('path');
const chalk = require('chalk')

var exec = require('child_process').exec;
var spawn = require('child_process').spawn

var haxeChangedDependencies = [];

function installLibs(callback, reject) {
  var package = JSON.parse(fs.readFileSync("./package.json").toString());

  var haxeDependencies = [];

  var libsXml = '<?xml version="1.0" encoding="utf-8"?>\n';
  libsXml += '<project>\n';
  for (var key in package.haxeDependencies) {
    haxeDependencies.push( { key:key, version:package.haxeDependencies[key] } );
  }

  
  
  var dirname = vars.env.HAXELIB_PATH;

  for (var i = 0; i < haxeDependencies.length; i++){
    var key = haxeDependencies[i].key;
    var gitPath = null;
    if (haxeDependencies[i].version.indexOf('git+') != -1){
      gitPath = haxeDependencies[i].version;
      haxeDependencies[i].version = "git";
    }
    var version = haxeDependencies[i].version;
    
    var libDir = path.join(dirname, key);
    if (key == 'haxe' || key == 'haxelib' || key == 'neko') continue;

    if (!fs.existsSync(libDir)) {
      haxeChangedDependencies.push( { key:key, version:version, gitPath:gitPath } ); // Add to download
    } else {
      var currentFile = path.join(libDir, '.current');
      
      if (!fs.existsSync(currentFile)) {
        haxeChangedDependencies.push( { key:key, version:version, gitPath:gitPath } ); // Add to download
      } else {
        var currentFile = path.join(libDir, '.current');
        
        var currentVersion = fs.readFileSync(currentFile, 'utf8');
        var versionDir = path.join(libDir, currentVersion.split('.').join(','));
        if (currentVersion != version || !fs.existsSync(versionDir)){
          haxeChangedDependencies.push( { key:key, version:version, gitPath:gitPath } ); // Add to download
          fs.writeFileSync(currentFile, version, 'utf8');
        }
      }
    }
  }
  console.log(
    chalk.green('Number of Dependencies:'),
    chalk.white(haxeChangedDependencies.length + '\n')
  );
  if (haxeChangedDependencies.length == 0){
    console.log(chalk.blueBright('No Lib Version Updates\n'));
    if (callback != null) callback();
  } else {
    installLib(0, callback, reject);
  }
}



function installLib(installIndex, callback, reject){
  if (installIndex >= haxeChangedDependencies.length){
    console.log(chalk.green('all libs installed'));
    if (callback != null) callback();
    return;
  }
  var key = haxeChangedDependencies[installIndex].key;
  var version = haxeChangedDependencies[installIndex].version;
  var gitPath = haxeChangedDependencies[installIndex].gitPath;
  
  if (version == null){
    console.log(
      chalk.green('\nhaxelib'),
      chalk.green('install'),
      chalk.white(key),
      chalk.grey('--always')
    );
    var updateLib = haxelib('install', key, '--always');
  }
  else {
    if (version == 'git'){
      var repo = gitPath.split("git+")[1];
      console.log(
        chalk.green('\nhaxelib'),
        chalk.green('git'),
        chalk.white(key),
        chalk.white(repo),
        chalk.grey('--always')
      );
      var updateLib = haxelib('git', key, repo, '--always');
    } else {
      console.log(
        chalk.green('\nhaxelib'),
        chalk.green('install'),
        chalk.white(key),
        chalk.white(version),
        chalk.grey('--always')
      );
      var updateLib = haxelib('install', key, version, '--always');
    }
  } 
  
  
  updateLib.stdout.on('data', function (data) {
    process.stdout.write(data);
  });
  
  updateLib.stderr.on('data', function (data) {
    process.stdout.write(data);
  });
  
  updateLib.on('exit', function (data) {
    installLib(installIndex + 1, callback, reject);
  });
}



module.exports = () => {
    return new Promise(function(resolve, reject) {
      installLibs(resolve, reject)
    });
}