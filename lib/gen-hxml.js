/*const path = require('path')
const chalk = require('chalk')
const fs = require('fs-extra')
const vars = require('haxe/lib/vars');

module.exports = () => {
    console.log('safadsf');
    var package = JSON.parse(fs.readFileSync("./package.json").toString());

    var haxeDependencies = [];

    var hxmlStr = '';

    for (var key in package.haxeDependencies) {
        
        if (key == "haxe" || key == "haxelib" || key == "neko") continue;

        haxeDependencies.push( { key:key, version:package.haxeDependencies[key] } );
    }
    console.log('safadsf');
    for (var i = 0; i < haxeDependencies.length; i++){
        console.log('key = ' + key);
        var key = haxeDependencies[i].key;
        var version = haxeDependencies[i].version;
        var libDir = path.join(vars.env.HAXELIB_PATH, key);
        var currentFile = path.join(libDir, '.current');
        var currentVersion = fs.readFileSync(currentFile, 'utf8');
        var pathToLib = path.join(libDir, currentVersion.split('.').join(','));
        var haxelibJsonStr = path.join(pathToLib, 'haxelib.json');
        var haxelibJson = JSON.parse(fs.readFileSync(haxelibJsonStr, 'utf8'));
        if (haxelibJson.classPath !== undefined){
            pathToLib = path.join(pathToLib, haxelibJson.classPath);
        }

        hxmlStr += '-cp ' + pathToLib + "\n";

        if (key == 'haxe' || key == 'haxelib' || key == 'neko') continue;
        if (version === null || version === undefined){
            hxmlStr += '-D ' + key + "\n";
            
        } else {
            if (version.indexOf("git+") == 0){
                hxmlStr += '-D ' + key + "\n";
                
            } else {
                if (version.indexOf("^") == 0){

                }
                hxmlStr += '-D ' + key + "=" + version + "\n";
            }
        }
        hxmlStr += "\n";
    }

    console.log(hxmlStr);

    fs.writeFileSync('./libs.hxml', hxmlStr);

    console.log(
    chalk.green('Generation Complete:'),
    chalk.white('libs.xml\n')
    );
}*/



const vars = require('haxe/lib/vars');
const path = require('path');
const fs = require('fs');

var output = "";

module.exports = (callback) => {
    fs.readdir(vars.env.HAXELIB_PATH, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach(function (file) {
            var libDir = path.join(vars.env.HAXELIB_PATH, file);
            // Do whatever you want to do with the file
            if (fs.lstatSync(libDir).isDirectory()){
                var currentFile = path.join(libDir, '.current');
    
                if (!fs.existsSync(currentFile)) {
                    console.log('no .current file for ' + file);
                    return;
                  } else {
                    var currentVersion = fs.readFileSync(currentFile, 'utf8');
                    var currentVersionComma = currentVersion.split('.').join(',');
                    
                    var libRootPath = path.join(libDir, currentVersionComma);
                    var haxelibInfoFile = path.join(libRootPath, 'haxelib.json');
                    var haxelibInfo = JSON.parse(fs.readFileSync(haxelibInfoFile, 'utf8'));
                    
                    var sourceDir = libRootPath;
                    var classPath = haxelibInfo.classPath;
                    
                    if (classPath !== undefined){
                        sourceDir = path.join(sourceDir, classPath);
                    }
                    
    
                    output += '-cp ' + sourceDir + "\n";
                    output += '-D ' + file + '=' + currentVersion + '\n\n';
                    
                  }
            }
            
        });
    
        //console.log('OUTPUT\n' + output);
        fs.writeFileSync('./libs.hxml', output);
        if (callback !== undefined) callback(output);
    });
}

