const vars = require('haxe/lib/vars');
const path = require('path');
const fs = require('fs');

var output = "";

module.exports = (outputPath, callback) => { 
    fs.readdir(vars.env.HAXELIB_PATH, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        for (var i = 0; i < files.length; i++){
            var file = files[i];
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
                    output += '-D ' + file + '=' + currentVersion + "\n";
                    if (i < files.length-1){
                        output += '\n';
                    }    
                }
            }
        }
    
        //console.log('OUTPUT\n' + output);
        if (outputPath !== undefined){
            injectLibs(outputPath, output);
        }
        if (callback !== undefined) callback(output);
    });
}

function injectLibs(outputPath, output) {
    if (fs.existsSync(outputPath)) {
        // Update file
        var hxmlStr = fs.readFileSync(outputPath, "utf8");
        var lines = hxmlStr.split("\n")
        var startIndex = -1;
        var endIndex = -1;
        
        for (var i = 0; i < lines.length; i++){
            if (lines[i].indexOf('LIBS_START') != -1)
                startIndex = i;
            if (lines[i].indexOf('LIBS_END') != -1)
                endIndex = i;
        }

        if (startIndex == -1 || endIndex == -1){
            startIndex = 0;
            endIndex = 1;
            lines.unshift(
                "# LIBS_START ########################################################################################################",
                "# LIBS_END ##########################################################################################################",
                ""
            );
        }

        output = "\n" + output;
        lines.splice(startIndex+1, endIndex-startIndex-1, output);
        output = lines.join("\n");
    }
    fs.writeFileSync(outputPath, output);
}