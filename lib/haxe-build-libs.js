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
        if (callback !== undefined) callback(output);
    });
}

