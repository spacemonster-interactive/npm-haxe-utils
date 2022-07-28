module.exports = (task, profileXml, target, buildType, args, callback) => {
  require('./lib/apply-env');

  const chalk = require('chalk')
  var lime = require('haxe-utils/lib/lime/lime');
  var loglines = require('./lib/loglines');

  //var info = require('./lib/info');
  
  var _task = 'build';
  var _profileXml = 'project.xml';
  var _target = 'electron';
  var _buildType = '-release';
  var _args = [];
  if (args !== undefined){
    _args = args;
  }

  if (task !== undefined) _task = task;
  else if (process.env.TASK !== undefined) _task = process.env.TASK;
    
  if (profileXml !== undefined) _profileXml = profileXml;
  else if (process.env.PROJECT_XML !== undefined) _profileXml = process.env.PROJECT_XML;
  
  if (target !== undefined) _target = target;
  else if (process.env.TARGET !== undefined) _target = process.env.TARGET;

  if (buildType !== undefined) _buildType = buildType;
  else if (process.env.BUILD_TYPE !== undefined) _buildType = process.env.BUILD_TYPE;

  
  var _defines = [];
  if (process.env.HAXE_DEFINES !== undefined){
    console.log(process.env.HAXE_DEFINES);
    console.log(Array.isArray(process.env.HAXE_DEFINES));
    _defines = process.env.HAXE_DEFINES.split(", ").join(",").split(",");
  }
  for (var i = 0; i < _defines.length; i++){
    _args.push(_defines[i]);
  }
  

  //info(() => {
    //clean(() => {
      buildLime(callback);
    //});
  //});

  /*function clean(callback) {
    var limeProcess = lime("clean", _profileXml, "electron");
    limeProcess.on('close', function (code) {
      console.log('->',chalk.green('Clear Successfully'));
      if (callback !== undefined)
        callback();
    });
    limeProcess.on('error', function (err) {
      console.error('->',chalk.red('Clear Failed'),err);
      if (callback !== undefined)
        callback();
    });
  }*/

  function buildLime(callback) {
    var limeArgs = [_task, _profileXml, _target, _buildType];
    for (var i = 0; i < _args.length; i++){
      //limeArgs.push("-D");
      limeArgs.push(_args[i]);
    }
    console.log(
      '->',
      chalk.blueBright('Haxe Compiler: '),
      chalk.green("lime", limeArgs.join(" "))
    )
    var limeProcess = lime(...limeArgs);

    limeProcess.stdout.on('data', (data) => {
      loglines(data.toString('utf8'), false);
    });
    limeProcess.stderr.on('data', (data) => {
      loglines(data.toString('utf8'), true);
      
    });
    limeProcess.on('close', function (code) {
      console.log('->',chalk.blue('Haxe Compiler: '),chalk.green('Built Successfully'));
      if (callback !== undefined)
        callback();
    });
    limeProcess.on('error', function (err) {
      console.error('->',chalk.blue('Haxe Compiler: '),chalk.red('Build Failed'),err);
      if (callback !== undefined)
        callback();
    });
  }
}