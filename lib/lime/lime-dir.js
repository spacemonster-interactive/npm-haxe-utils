require('haxe-utils/lib/apply-env');
var vars = require('haxe/lib/vars');
var fs = require('fs');
const path = require('path')

var limeLibPath = null;
var limeDir = path.join(vars.env.HAXELIB_PATH, 'lime');
if (!fs.existsSync(limeDir)) {
  console.log('lime not installed');
  return;
}
var currentFile = path.join(limeDir, '.current');
if (!fs.existsSync(currentFile)) {
  console.log('no .current file');
  return;
} else {
  var currentVersion = fs.readFileSync(currentFile, 'utf8');
  limeLibPath = path.join(limeDir, currentVersion.split('.').join(','));
  if (!fs.existsSync(limeLibPath)) {
    console.log('lime ' + currentFile + " dir does not exist");
    return;
  }
}


module.exports = limeLibPath;