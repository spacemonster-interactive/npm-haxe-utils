const chalk = require('chalk')
const fs = require('fs-extra')
var haxe = require('haxe').haxe;
var haxelib = require('haxe').haxelib;

var package = JSON.parse(fs.readFileSync("./package.json").toString());

var haxeDependencies = [];

var libsXml = '<?xml version="1.0" encoding="utf-8"?>\n';
libsXml += '<project>\n';
for (var key in package.haxeDependencies) {
    if (key != "lime"){
        haxeDependencies.push( { key:key, version:package.haxeDependencies[key] } );
    }
}

/*haxeDependencies.sort((a1, a2) => {
    if (a1.key > a2.key) return 1;
    else if (a1.key < a2.key) return -1;
    else return 0;
});*/

for (var i = 0; i < haxeDependencies.length; i++){
    var key = haxeDependencies[i].key;
    var version = haxeDependencies[i].version;
    if (key == 'haxe' || key == 'haxelib' || key == 'neko') continue;
    if (version === null || version === undefined){
        libsXml += '\t<haxelib name="' + key + '" />\n';
    } else {
        if (version.indexOf("git+") == 0){
            libsXml += '\t<haxelib name="' + key + '" />\n';
        } else {
            if (version.indexOf("^") == 0){

            }
            libsXml += '\t<haxelib name="' + key + '" version="' + version + '" />\n';
        }
    }
}

libsXml += '</project>\n';

fs.writeFileSync('./libs.xml', libsXml);

console.log(
chalk.green('Generation Complete:'),
chalk.white('libs.xml\n')
);